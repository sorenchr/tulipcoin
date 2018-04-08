import { Transaction } from './transaction';

export class BlockChain {
    private transactions: Array<Transaction>;

    constructor() {
        this.transactions = [];
    }

    append(ts: Transaction): void {
        ts.id = this.transactions.length;
        this.transactions.push(ts);
    }

    to(to: string): Array<Transaction> {
        return this.transactions.filter(tx => tx.to === to);
    }

    all(): Array<Transaction> {
        return this.transactions;
    }
}