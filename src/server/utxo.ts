/**
 * Unspent transaction output.
 */
export class UTXO {
    txId: Number;
    outputIndex: Number;
    
    constructor(txId: Number, outputIndex: Number) {
        this.txId = txId;
        this.outputIndex = outputIndex;
    }

    equals(utxo: UTXO): boolean {
        if (this.txId !== utxo.txId) return false;
        if (this.outputIndex !== utxo.outputIndex) return false;
        return true;
    }
}

/**
 * A pool of unspent transaction outputs. Used for keeping tracking of outputs
 * from other transactions that have not been spent yet.
 */
export class UTXOPool {
    private utxos: Array<UTXO>;

    constructor() {
        this.utxos = [];
    }

    add(utxo: UTXO) {
        this.utxos.push(utxo);
    }

    remove(utxo: UTXO) {
        this.utxos = this.utxos.filter(val => !val.equals(utxo));
    }

    contains(utxo: UTXO) {
        return this.utxos.findIndex(val => val.equals(utxo)) !== -1;
    }
}