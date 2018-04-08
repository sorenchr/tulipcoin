import { Transaction } from '../transaction';

export class BlockChain {
    private transactions: Array<Transaction>;

    constructor() {
        this.transactions = [];
    }

    append(tx: Transaction): void {
        this.transactions.push(tx);
    }

    all(): Array<Transaction> {
        return this.transactions;
    }

    get(id: Number): Transaction {
        return this.transactions.find(tx => tx.id === id);
    }
}