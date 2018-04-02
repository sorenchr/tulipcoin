import * as http from 'http';
import { Transaction } from './transaction';
import { Router } from './router';
import { BlockChain } from './blockchain';

export class RestServer {
    private blockChain: BlockChain;
    private server: http.Server;
    private callback: (Transaction) => any;

    /**
     * Create a new REST server.
     * @param port The port for the server.
     * @param blockChain The blockchain associated with the server.
     */
    constructor(port: Number, blockChain: BlockChain) {
        this.blockChain = blockChain;
        let router = new Router();

        router.addRoute('/transactions', 'GET', (req, res) => this.getTransactions(req, res))
        router.addRoute('/transactions', 'POST', (req, res) => this.postTransaction(req, res));

        this.server = http.createServer((req, res) => router.route(req, res));
        this.server.listen(port, () => console.log(`Server started on port ${port}`));
    }

    /**
     * Retrieves all or some of the transactions in the blockchain.
     * @param req The incoming request.
     * @param res The outgoing response.
     */
    private getTransactions(req: http.IncomingMessage, res: http.ServerResponse) {
        let jsonTxs = this.blockChain.all().map(this.padTxWithIndex);
        res.write(JSON.stringify(jsonTxs));
        res.end();
    }

    /**
     * Pads a JSON representation of a transaction with its index in the blockchain.
     * @param tx The transaction to pad.
     * @param i The index of the transaction in the blockchain.
     */
    private padTxWithIndex(tx, i) {
        let txJson = tx.toJSON();
        txJson.index = i;
        return txJson;
    }

    /**
     * Stores a new transaction in the blockchain.
     * @param req The incoming request.
     * @param res The outgoing response.
     */
    private async postTransaction(req: http.IncomingMessage, res: http.ServerResponse) {
        let body = await this.consumeResource(req);
        let tx = Transaction.fromJSONString(body);

        if (!this.isValidTx(tx)) {
            res.statusCode = 422;
            res.write('422 Unprocessable Entity');
            return res.end();
        }

        this.callback(tx);
        res.end();
    }

    /**
     * Checks if an incoming transaction is valid.
     * @param tx The transaction to check.
     */
    private isValidTx(tx: Transaction): boolean {
        return true;
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
     * Register a callback for incoming transactions.
     * @param cb The callback that will handle the event.
     */
    onTransaction(cb: (Transaction) => any) {
        this.callback = cb;
    }
}