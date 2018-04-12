import { Transaction } from '../transaction';
import { Logger } from '../logger';

const logger = new Logger('blockchain');

export class BlockChain {
    private transactions: Array<Transaction>;

    constructor() {
        this.transactions = [];
    }

    append(tx: Transaction): void {
        let head = this.transactions.length > 0 ? this.transactions[this.transactions.length - 1] : null;
        tx.id = head !== null ? head.id++ : 0;
        if (head !== null) tx.prevTxId = head.id;
        this.transactions.push(tx);
        logger.info(`Appending transaction with id: ${tx.id} to blockchain.`);
    }

    all(): Array<Transaction> {
        return this.transactions;
    }

    get(id: Number): Transaction {
        return this.transactions.find(tx => tx.id === id);
    }
}