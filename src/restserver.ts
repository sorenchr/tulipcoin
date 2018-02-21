import * as http from 'http';
import { CreateCoins } from './transactions';
import * as url from 'url';

export class RestServer {
    server: http.Server;
    createCoinsCb: (req: CreateCoins) => any;

    constructor(port: Number) {
        let router = new Router();
        router.addRoute('/transactions', 'POST', this.postTransaction);
        this.server = http.createServer(router.route);
        this.server.listen(port, () => console.log(`Server started on port ${port}`));
    }

    private postTransaction(req: http.IncomingMessage, res: http.ServerResponse) {
        let body = [];
        req.on('data', (chunk) => body.push(chunk));
        req.on('end', () => {
            let bodyString = Buffer.concat(body).toString('utf8');
            console.log(JSON.parse(bodyString));
            res.end();
        });
    }

    onCreateCoins(cb: (req: CreateCoins) => any) {
        this.createCoinsCb = cb;
    }
}

class Router {
    private routes: { }
    
    constructor() {
        this.routes = { };
    }

    route(req: http.IncomingMessage, res: http.ServerResponse) {
        let urlParts = url.parse(req.url);
        if (!(urlParts.path in this.routes)) return this.error(req, res);
        this.routes[urlParts.path](req, res);
    }

    addRoute(path: string, method: string, handler: (req: http.IncomingMessage, res: http.ServerResponse) => any) {
        if (!(path in this.routes)) this.routes[path] = {};
        this.routes[path][method] = handler;
    }

    error(req: http.IncomingMessage, res: http.ServerResponse) {

    }
}
