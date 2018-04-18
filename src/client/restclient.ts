import * as http from 'http';
import * as querystring from 'querystring';
import { Transaction, Input, Output } from '../transaction';
import { UTXO } from '../server/utxo';
import * as NodeRSA from 'node-rsa';
import * as shajs from 'sha.js';

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
    postTransaction(inputs: Array<Input>, outputs: Array<Output>, privateKey: string, publicKey: string): Promise<string> {
        let tx = new Transaction(inputs, outputs, publicKey);
        tx.sign(privateKey);
        let body = JSON.stringify(tx);

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

    /**
     * Retrieve a list of unspent coins for the given wallet.
     * @param publicKey The public key of the wallet.
     */
    getWallet(publicKey: string): Promise<Array<{txId: number, outputIndex: number, amount: number}>> {
        let publicKeyHash = shajs('sha256').update(publicKey).digest('hex');

        const options = {
            hostname: this.host,
            port: this.port,
            path: '/wallets/' + publicKeyHash,
            method: 'GET'
        };

        return new Promise((resolve, reject) => {
            let resData = '';
            const req = http.request(options, res => {
                res.setEncoding('utf8')
                res.on('data', chunk => resData += chunk);
                res.on('end', () => res.statusCode === 200 ? resolve(JSON.parse(resData)) : reject(resData));
            });
            req.on('error', err => reject(err));
            req.end();
        });
    }

    /**
     * Retrieve the list of blockchain transactions from the server.
     */
    getTransactions(): Promise<Array<Transaction>> {
        const options = {
            hostname: this.host,
            port: this.port,
            path: '/transactions',
            method: 'GET'
        };

        return new Promise((resolve, reject) => {
            let resData = '';
            const req = http.request(options, res => {
                res.setEncoding('utf8')
                res.on('data', chunk => resData += chunk);
                res.on('end', () => res.statusCode === 200 ? resolve(JSON.parse(resData)) : reject(resData));
            });
            req.on('error', err => reject(err));
            req.end();
        });
    }

    /**
     * Retrieve a single blockchain transaction from the server.
     * @param id The id of the transaction to retrieve.
     */
    getTransaction(id: number): Promise<Transaction> {
        const options = {
            hostname: this.host,
            port: this.port,
            path: '/transactions/' + id,
            method: 'GET'
        };

        return new Promise((resolve, reject) => {
            let resData = '';
            const req = http.request(options, res => {
                res.setEncoding('utf8')
                res.on('data', chunk => resData += chunk);
                res.on('end', () => res.statusCode === 200 ? resolve(JSON.parse(resData)) : reject(resData));
            });
            req.on('error', err => reject(err));
            req.end();
        });
    }
}