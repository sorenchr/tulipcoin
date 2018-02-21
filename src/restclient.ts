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
     */
    createCoins(amount: Number, to: string): Promise<string> {
        const body = { amount: amount, to: to };
        return this.postRequest(body);
    }

    /**
     * Executes a transaction POST request towards the server indicated by the user.
     * @param body The body that will be sent to the server.
     */
    private postRequest(body: Object): Promise<string> {
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

        return new Promise((resolve, reject) => {
            let resData = '';
            const req = http.request(options, res => {
                res.setEncoding('utf8')
                res.on('data', chunk => resData += chunk);
                res.on('end', () => resolve(resData));
            });
            req.on('error', err => reject(err));
            req.write(bodyStringified);
            req.end();
        });
    }
}