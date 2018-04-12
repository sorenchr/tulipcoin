import * as http from 'http';
import { Transaction } from '../transaction';
import { Router } from './router';
import * as url from 'url';
import * as querystring from 'querystring';
import { TxValidator } from './txvalidator';
import { BlockChain } from './blockchain';
import { UTXOPool, UTXO } from './utxo';
import { Logger } from '../logger';

const logger = new Logger('restserver');

export class RestServer {
    private server: http.Server;
    private txValidator: TxValidator;
    private blockChain: BlockChain;
    private utxoPool: UTXOPool;

    /**
     * Create a new REST server.
     * @param port The port for the server.
     * @param txValidator A transaction validator.
     * @param blockChain The blockchain associated with the server.
     * @param utxoPool The pool of unspent transaction outputs associated with the server and blockchain.
     */
    constructor(port: Number, txValidator: TxValidator, blockChain: BlockChain, utxoPool: UTXOPool) {
        this.txValidator = txValidator;
        this.blockChain = blockChain;
        this.utxoPool = utxoPool;
        let router = new Router();

        router.addRoute('/transactions', 'GET', (req, res) => this.getTransactions(req, res));
        router.addRoute('/transactions', 'POST', (req, res) => this.postTransaction(req, res));
        router.addRoute('/wallets/:string', 'GET', (req, res, publicKey) => this.getWallet(req, res, publicKey));

        this.server = http.createServer((req, res) => router.route(req, res));
        this.server.listen(port, () => logger.info(`Server started on port ${port}.`));
    }

    private getWallet(req: http.IncomingMessage, res: http.ServerResponse, publicKey: string) {
        // Get an array of all unspent transaction outputs, their amount and output index
        let utxos = this.utxoPool.all();
        let utxoTxIds = utxos.map(utxo => utxo.txId);
        let txs = this.blockChain.all().filter(tx => utxoTxIds.includes(tx.id));
        let amounts = txs.map(tx => tx.outputs.filter(o => o.receiver === publicKey).map((o, i) => ({ txId: tx.id, outputIndex: i, amount: o.amount })));
        let flatAmounts = [].concat(...amounts); // flatten array

        res.write(JSON.stringify(flatAmounts));
        res.end();
    }

    /**
     * Retrieves all or some of the transactions in the blockchain.
     * @param req The incoming request.
     * @param res The outgoing response.
     */
    private getTransactions(req: http.IncomingMessage, res: http.ServerResponse) {
        var jsonTxs = this.blockChain.all();
        res.write(JSON.stringify(jsonTxs));
        res.end();
    }

    /**
     * Stores a new transaction in the blockchain.
     * @param req The incoming request.
     * @param res The outgoing response.
     */
    private async postTransaction(req: http.IncomingMessage, res: http.ServerResponse) {
        let body = await this.consumeResource(req);
        let tx = Transaction.fromJSONString(body);

        // Validate the incoming transaction
        if (!this.txValidator.isValid(tx)) {
            res.statusCode = 422;
            res.write('422 Unprocessable Entity');
            return res.end();
        }

        // Add the transaction to the blockchain
        this.blockChain.append(tx);

        // Update the pool of unspent transaction outputs
        tx.outputs.forEach((o, index) => this.utxoPool.add(new UTXO(tx.id, index)));
        tx.inputs.forEach(i => this.utxoPool.remove(new UTXO(i.txId, i.outputId)));

        res.write(JSON.stringify(tx));
        res.end();
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
}