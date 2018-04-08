export class Transaction {
    id?: Number;
    input: Input;
    outputs: Array<Output>;
    prevTxId: Number;

    constructor(input: Input, outputs: Array<Output>, prevTxId: Number, id?: Number) {
        this.input = input;
        this.outputs = outputs;
        this.prevTxId = prevTxId;
        this.id = id;
    }

    toJSONString(): any {
        return JSON.stringify(this);
    }

    static fromJSONString(jsonString): Transaction {
        let json = JSON.parse(jsonString);
        return new Transaction(json.input, json.outputs, json.prevTxId, json.id);
    }
}

export class Input {
    txId: Number;
    outputId: Number;

    constructor(txId: Number, outputId: Number) {
        this.txId = txId;
        this.outputId = outputId;
    }
}

export class Output {
    receiver: string;
    amount: Number;

    constructor(receiver: string, amount: Number) {
        this.receiver = receiver;
        this.amount = amount;
    }
}