import { Transaction, CreateCoins } from './transactions';

export class BlockChain {
    private transactions: Array<Transaction>;

    append(ts: Transaction): void {
        if (!this.isValid(ts)) throw new ValidationError('Transaction isn\'t valid');
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