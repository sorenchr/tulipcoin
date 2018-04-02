import * as http from 'http';
import * as querystring from 'querystring';
import { Transaction } from './transaction';

export class RestClient {
    host: string;
    port: string;

    constructor(host: string) {
        const hostParts = host.split(':');
        this.host = hostParts[0];
        this.port = hostParts[1];
    }

    /**
     * Send a coin transfer transaction to the REST server.
     * @param amount The amount to transfer.
     * @param from The public key that the coins are transferred from.
     * @param to The public key that the coins are transferred to.
     * @param prevTx The previous transaction that contains the coins needed for this transaction.
     */
    transferCoins(amount: Number, from: string, to: string): Promise<string> {
        let tx = new Transaction(to, from, amount, 0);
        let body = JSON.stringify(tx.toJSON());

        const options = {
            hostname: this.host,
            port: this.port,
            path: '/transactions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        return new Promise((resolve, reject) => {
            let resData = '';
            const req = http.request(options, res => {
                res.setEncoding('utf8')
                res.on('data', chunk => resData += chunk);
                res.on('end', () => res.statusCode === 200 ? resolve(resData) : reject(resData));
            });
            req.on('error', err => reject(err));
            req.write(body);
            req.end();
        });
    }
}