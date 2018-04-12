export class Transaction {
    id?: number;
    inputs: Array<Input>;
    outputs: Array<Output>;
    prevTxId?: number;

    constructor(inputs: Array<Input>, outputs: Array<Output>, prevTxId?: number, id?: number) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.prevTxId = prevTxId;
        this.id = id;
    }

    toJSONString(): any {
        return JSON.stringify(this);
    }

    static fromJSONString(jsonString): Transaction {
        let json = JSON.parse(jsonString);
        return new Transaction(json.inputs, json.outputs, json.prevTxId, json.id);
    }
}

export class Input {
    txId: number;
    outputId: number;

    constructor(txId: number, outputId: number) {
        this.txId = txId;
        this.outputId = outputId;
    }
}

export class Output {
    receiver: string;
    amount: number;

    constructor(receiver: string, amount: number) {
        this.receiver = receiver;
        this.amount = amount;
    }
}