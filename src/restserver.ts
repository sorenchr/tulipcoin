import * as http from 'http';
import { CreateCoins } from './transactions';
import * as url from 'url';

export class RestServer {
    server: http.Server;
    createCoinsCb?: (req: CreateCoins) => any;

    /**
     * Create a new REST server.
     * @param port The port for the server.
     */
    constructor(port: Number) {
        let router = new Router();
        router.addRoute('/transactions', 'POST', (req, res) => this.postTransaction(req, res));
        this.server = http.createServer((req, res) => router.route(req, res));
        this.server.listen(port, () => console.log(`Server started on port ${port}`));
    }

    private async postTransaction(req: http.IncomingMessage, res: http.ServerResponse) {
        let body = await this.consumeResource(req);
        res.end();
        let json = JSON.parse(body);
        let ts = new CreateCoins(json.to, json.amount);
        if (!!this.createCoinsCb) this.createCoinsCb(ts);
    }

    consumeResource(req: http.IncomingMessage): Promise<string> {
        return new Promise((res, rej) => {
            let body = [];
            req.on('error', err => rej(err));
            req.on('data', chunk => body.push(chunk));
            req.on('end', () => res(Buffer.concat(body).toString('utf8')));
        });
    }

    onCreateCoins(cb: (req: CreateCoins) => any) {
        this.createCoinsCb = cb;
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
