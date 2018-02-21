import * as http from 'http';
import { CreateCoins, Transaction, TransferCoins } from './transactions';
import * as url from 'url';
import * as fs from 'fs';
import Mustache from 'mustache';

export class RestServer {
    private tsValidator: (ts: Transaction) => boolean;
    private server: http.Server;
    private callbacks;

    /**
     * Create a new REST server.
     * @param port The port for the server.
     * @param tsValidator A function that validates incoming transactions.
     */
    constructor(port: Number, tsValidator: (ts: Transaction) => boolean) {
        this.tsValidator = tsValidator;
        this.callbacks = {};
        let router = new Router();

        router.addRoute('/coins', 'POST', (req, res) => this.addCoins(req, res));
        router.addRoute('/coins', 'PUT', (req, res) => this.transferCoins(req, res));

        this.server = http.createServer((req, res) => router.route(req, res));
        this.server.listen(port, () => console.log(`Server started on port ${port}`));
    }

    private async addCoins(req: http.IncomingMessage, res: http.ServerResponse) {
        let body = await this.consumeResource(req);
        let bodyJson = JSON.parse(body);
        
        let ts = new CreateCoins(bodyJson.to, bodyJson.amount);

        if (!this.tsValidator(ts)) {
            res.statusCode = 422;
            res.write('422 Unprocessable Entity');
            return res.end();
        }

        this.fire('createCoins', ts);
        res.end();
    }

    private async transferCoins(req: http.IncomingMessage, res: http.ServerResponse) {
        let body = await this.consumeResource(req);
        let bodyJson = JSON.parse(body);
        
        let ts = new TransferCoins(bodyJson.to, bodyJson.from, bodyJson.amount);

        if (!this.tsValidator(ts)) {
            res.statusCode = 422;
            res.write('422 Unprocessable Entity');
            return res.end();
        }

        this.fire('transferCoins', ts);
        res.end();
    }

    /**
     * Consume the entire resource from the incoming request.
     * @param req The incoming request.
     */
    private consumeResource(req: http.IncomingMessage): Promise<string> {
        return new Promise((res, rej) => {
            let body = [];
            req.on('error', err => rej(err));
            req.on('data', chunk => body.push(chunk));
            req.on('end', () => res(Buffer.concat(body).toString('utf8')));
        });
    }

    /**
     * Register a callback for the given event.
     * @param event The event that should occur.
     * @param cb The callback that will handle the event.
     */
    on(event: string, cb: Function) {
        if (!(event in this.callbacks)) this.callbacks[event] = [];
        this.callbacks[event].push(cb);
    }

    /**
     * Fire an event and call the associated callbacks.
     * @param event The event to fire.
     * @param params The params associated with the event.
     */
    fire(event: string, ...params) {
        if (!(event in this.callbacks)) return;
        this.callbacks[event].forEach(c => c.apply(null, params));
    }
}

/** 
 * A simple router abstraction that maps routes to functions.
*/
class Router {
    private routes;
    
    constructor() {
        this.routes = { };
    }

    /**
     * Main entry point for the router. This method accepts an incoming message and routes it
     * to the appropriate function registered earlier.
     * @param req The incoming request.
     * @param res The server response.
     */
    route(req: http.IncomingMessage, res: http.ServerResponse) {
        let urlParts = url.parse(req.url);
        if (!(urlParts.path in this.routes)) return this.error(req, res);
        this.routes[urlParts.path][req.method](req, res);
    }


    addRoute(path: string, method: string, handler: (req: http.IncomingMessage, res: http.ServerResponse) => any) {
        if (!(path in this.routes)) this.routes[path] = {};
        this.routes[path][method] = handler;
    }

    /**
     * The default response when a route does not exist for the incoming request.
     * @param req The incoming request.
     * @param res The server response.
     */
    error(req: http.IncomingMessage, res: http.ServerResponse) {
        res.statusCode = 404;
        res.write('404 Not Found');
        res.end();
    }
}
