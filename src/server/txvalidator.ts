import { UTXOPool } from './utxo';
import { Transaction } from '../transaction';

export class TxValidator {
    private utxoPool: UTXOPool;

    constructor(utxoPool: UTXOPool) {
        this.utxoPool = utxoPool;
    }

    isValid(tx: Transaction) {
        return true;
    }
}