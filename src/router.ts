import * as http from 'http';
import * as url from 'url';

/** 
 * A simple router abstraction that maps URL routes to functions.
*/
export class Router {
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

    /**
     * Add a handler for the given route.
     * @param path The path that should be routed.
     * @param method The HTTP method used by incoming requests to the path.
     * @param handler The handler for the route.
     */
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