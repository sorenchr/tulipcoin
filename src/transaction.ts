export class Transaction {
    to: string;
    from: string;
    amount: Number;
    prevTx: Number;

    constructor(to: string, from: string, amount: Number, prevTx: Number) {
        this.to = to;
        this.from = from;
        this.amount = amount;
        this.prevTx = prevTx;
    }

    toJSON(): any {
        return {
            to: this.to,
            from: this.from,
            amount: this.amount,
            prevTx: this.prevTx
        };
    }

    static fromJSONString(jsonString) {
        let json = JSON.parse(jsonString);
        return new Transaction(json.to, json.from, json.amount, json.prevTx);
    }
}