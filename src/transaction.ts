export class Transaction {
    id?: Number;
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
        let obj = <any>{
            to: this.to,
            from: this.from,
            amount: this.amount,
            prevTx: this.prevTx
        };

        if (!!this.id) obj.id = this.id;
        
        return obj;
    }

    static fromJSONString(jsonString): Transaction {
        let json = JSON.parse(jsonString);
        let tx = new Transaction(json.to, json.from, json.amount, json.prevTx);
        if (!!json.id) tx.id = json.id;
        return tx;
    }
}