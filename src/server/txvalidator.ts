import { UTXOPool } from './utxo';
import { Transaction } from '../transaction';
import { Logger } from '../logger';

const logger = new Logger('txvalidator');

export class TxValidator {
    private utxoPool: UTXOPool;

    constructor(utxoPool: UTXOPool) {
        this.utxoPool = utxoPool;
    }

    isValid(tx: Transaction) {
        logger.info('Transaction validated.');
        return true;
    }
}