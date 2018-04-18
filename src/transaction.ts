import * as NodeRSA from 'node-rsa';

export class Transaction {
    id?: number;
    inputs: Array<Input>;
    outputs: Array<Output>;
    prevTxId?: number;
    signature?: string;
    publicKey: string;

    constructor(inputs: Array<Input>, outputs: Array<Output>, publicKey: string, 
                signature?: string, prevTxId?: number, id?: number) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.publicKey = publicKey;
        this.signature = signature;
        this.prevTxId = prevTxId;
        this.id = id;
    }

    toJSONString(): string {
        return JSON.stringify(this);
    }

    sign(privateKey: string) {
        let key = new NodeRSA(privateKey);
        let obj = { inputs: this.inputs, outputs: this.outputs };
        this.signature = key.sign(JSON.stringify(obj), 'hex', 'utf8');
    }

    verifySignature() {
        let key = new NodeRSA(this.publicKey);
        let obj = { inputs: this.inputs, outputs: this.outputs };
        return key.verify(JSON.stringify(obj), this.signature, 'utf8', 'hex');
    }

    static fromJSONString(jsonString): Transaction {
        let json = JSON.parse(jsonString);
        return new Transaction(json.inputs, json.outputs, json.publicKey, json.signature,
            json.prevTxId, json.id);
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