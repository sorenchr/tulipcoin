import * as http from 'http';
import * as url from 'url';
import { Logger } from '../logger';

const logger = new Logger('router');

/** 
 * A simple router abstraction that maps URL routes to functions.
*/
export class Router {
    private routes: Array<Route>;
    
    constructor() {
        this.routes = [];
    }

    /**
     * Main entry point for the router. This method accepts an incoming message and routes it
     * to the appropriate function registered earlier.
     * @param req The incoming request.
     * @param res The server response.
     */
    route(req: http.IncomingMessage, res: http.ServerResponse) {
        let urlParts = url.parse(req.url);

        logger.info(`Incoming request for ${urlParts.pathname}.`);

        // Check if one of the routes match the incoming request path
        let route = this.routes.find(r => r.matches(urlParts.pathname, req.method) !== null);
        if (route === undefined) return this.error(req, res);

        // Extract any parameters from the path
        let params = [];
        let match = route.matches(urlParts.pathname, req.method);
        if (match.length > 1) params = match.slice(1);

        // Call handler for route
        route.handler.apply(null, [req, res].concat(params));
    }

    /**
     * Add a handler for the given route.
     * @param path The path that should be routed.
     * @param method The HTTP method used by incoming requests to the path.
     * @param handler The handler for the route.
     */
    addRoute(path: string, method: string, handler: (req: http.IncomingMessage, res: http.ServerResponse, ...args) => any) {
        path = path.replace(':string', '([-a-zA-Z0-9@:%._\+~#=]+)');
        path = path.replace(':number', '([0-9]+)');

        let pattern = new RegExp(path + '$', 'g');
        let route = new Route(pattern, method, handler);

        this.routes.push(route);
    }

    /**
     * The default response when a route does not exist for the incoming request.
     * @param req The incoming request.
     * @param res The server response.
     */
    error(req: http.IncomingMessage, res: http.ServerResponse) {
        let urlParts = url.parse(req.url);
        logger.warn(`No route mapped for ${urlParts.pathname}, showing 404.`);

        res.statusCode = 404;
        res.write('404 Not Found');
        res.end();
    }
}

class Route {
    pattern: RegExp;
    method: string;
    handler: (req: http.IncomingMessage, res: http.ServerResponse, ...args) => any;

    constructor(pattern: RegExp, method: string, handler: (req: http.IncomingMessage, res: http.ServerResponse, ...args) => any) {
        this.pattern = pattern;
        this.method = method;
        this.handler = handler;
    }

    matches(path: string, method: string) {
        if (method.toLowerCase() !== this.method.toLowerCase()) return null;
        let match = this.pattern.exec(path);
        this.pattern.lastIndex = 0;
        return match;
    }
}