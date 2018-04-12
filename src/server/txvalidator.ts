import { UTXOPool, UTXO } from './utxo';
import { Transaction } from '../transaction';
import { Logger } from '../logger';
import { BlockChain } from './blockchain';

const logger = new Logger('txvalidator');

export class TxValidator {
    private utxoPool: UTXOPool;
    private blockChain: BlockChain;

    constructor(utxoPool: UTXOPool, blockChain: BlockChain) {
        this.utxoPool = utxoPool;
        this.blockChain = blockChain;
    }

    isValid(tx: Transaction) {
        logger.info('Validating new transaction.');

        // Check that all inputs are in the UTXO pool
        for (var i = 0; i < tx.inputs.length; i++) {
            let input = tx.inputs[i];
            if (this.utxoPool.contains(new UTXO(input.txId, input.outputId))) continue;
            let error = `Input ${i} of transaction does not exist in the UTXO pool.`;
            logger.error(error);
            return new ValidationResult(false, error);
        }

        // Check if any of the UTXO's are claimed multiple times
        let spentUtxos = new Array<UTXO>();
        for (var i = 0; i < tx.inputs.length; i++) {
            let input = tx.inputs[i];
            let utxo = new UTXO(input.txId, input.outputId);
            let contains = spentUtxos.some(spentUtxo => spentUtxo.equals(utxo));
            if (contains) { 
                let error = `Input ${i} of transaction is spent twice or more.`;
                logger.error(error);
                return new ValidationResult(false, error);
            }
            spentUtxos.push(utxo);
        }

        // Validate that all outputs are non-negative
        for (var i = 0; i < tx.outputs.length; i++) {
            let output = tx.outputs[i];
            if (output.amount >= 0) continue;
            let error = `Output ${i} of transaction contains a negative amount.`;
            logger.error(error);
            return new ValidationResult(false, error);
        }

        // Validate that the sum of inputs equals the sum of outputs
        let inputSum = tx.inputs.reduce((acc, i) => acc + this.blockChain.get(i.txId).outputs[i.outputId].amount, 0);
        let outputSum = tx.outputs.reduce((acc, o) => acc + o.amount, 0);
        if (inputSum !== outputSum) {
            let error = `Sum of inputs (${inputSum}) is different from sum of outputs (${outputSum}).`;
            logger.error(error);
            return new ValidationResult(false, error);
        }

        logger.info('Transaction validated.');
        return new ValidationResult(true);
    }
}

class ValidationResult {
    isValid: boolean;
    error?: string;

    constructor(isValid: boolean, error?: string) {
        this.isValid = isValid;
        this.error = error;
    }
}