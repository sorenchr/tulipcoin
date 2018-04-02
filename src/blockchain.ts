import { Transaction } from './transaction';

export class BlockChain {
    private transactions: Array<Transaction>;

    constructor() {
        this.transactions = [];
    }

    append(ts: Transaction): void {
        this.transactions.push(ts);
    }

    isValid(ts: Transaction): boolean {
        return true;
    }

    head(): Transaction {
        return this.transactions.length > 0 ? this.transactions[this.transactions.length - 1] : null;
    }

    all(): Array<Transaction> {
        return this.transactions;
    }
}

class ValidationError extends Error {}