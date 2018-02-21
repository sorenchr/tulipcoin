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