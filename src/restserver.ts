import * as http from 'http';

export class RestServer {
    server: http.Server;

    constructor(port: Number) {
        this.server = http.createServer(this.requestHandler);
        this.server.listen(port, () => console.log(`Server started on port ${port}`));
    }

    requestHandler(req, res) {
        console.log(req.url);
        res.end('test');
    }
}