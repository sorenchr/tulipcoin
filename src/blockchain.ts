interface Transaction {
    
}

export class TransferCoins implements Transaction {
    constructor() {

    }
}

export class CreateCoins implements Transaction {

}

export class BlockChain {
    transactions: Array<Transaction>;

    append(ts: Transaction) {
        if (!this.verify(ts)) throw new ValidationError('Transaction isn\'t valid'); 
    }   

    verify(ts: Transaction) {
        
    }

    head(): Transaction {
        return this.transactions.length > 0 ? this.transactions[this.transactions.length - 1] : null;
    }
}

class ValidationError extends Error {}