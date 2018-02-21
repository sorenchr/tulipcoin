import * as http from 'http';
import * as querystring from 'querystring';

export class RestClient {
    host: string;
    port: string;

    constructor(host: string) {
        const hostParts = host.split(':');
        this.host = hostParts[0];
        this.port = hostParts[1];
    }

    /**
     * 
     * @param amount 
     * @param cb 
     */
    createCoins(amount: Number, to: string, cb?: (err: Error) => any) {
        const body = { amount: amount, to: to };
        this.postRequest(body, cb);
    }

    /**
     * Executes a transaction POST request towards the server indicated by the user.
     * @param body The body that will be sent to the server.
     * @param cb The callback that will be invoked when the transaction request has been handled.
     */
    postRequest(body: Object, cb?: (err: Error, resData?: string) => any) {
        const bodyStringified = JSON.stringify(body);

        const options = {
            hostname: this.host,
            port: this.port,
            path: '/transactions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(bodyStringified)
            }
        };

        let resData = '';
        const req = http.request(options, res => {
            res.setEncoding('utf8')
            res.on('data', chunk => resData += chunk);
            res.on('end', () => cb(null, resData));
        });
        req.on('error', e => cb(e));
        req.write(bodyStringified);
        req.end();
    }
}