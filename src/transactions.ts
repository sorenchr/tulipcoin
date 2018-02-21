export interface Transaction {
    
}

export class CreateCoins implements Transaction {
    to: string;
    amount: Number;

    constructor(to: string, amount: Number) {
        this.to = to;
        this.amount = amount;
    }
}

export class TransferCoins implements Transaction {
    to: string;
    from: string;
    amount: Number;

    constructor(to: string, from: string, amount: Number) {
        this.to = to;
        this.from = from;
        this.amount = amount;
    }
}