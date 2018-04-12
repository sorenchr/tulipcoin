import * as minimist from 'minimist';
import { BlockChain } from './blockchain';
import { RestServer } from './restserver';
import * as keypair from 'keypair';
import * as fs from 'fs';
import { Transaction, Output } from '../transaction';
import { exitWithMessage } from '../utilities';
import { Logger } from '../logger';
import { UTXOPool, UTXO } from './utxo';
import { TxValidator } from './txvalidator';

// Parse arguments
let args = minimist(process.argv.slice(2));
const port = args.p || 8080;
const amount = !!args.amount ? Number.parseInt(args.amount) : 100;
if (!args.keys) exitWithMessage('--keys argument is required.');
if (amount == NaN) exitWithMessage('Amount is not recognized as a valid number');
const keys = JSON.parse(fs.readFileSync(args.keys, 'utf8'));

// Setup environment
const blockChain = new BlockChain();
const utxoPool = new UTXOPool();
const txValidator = new TxValidator(utxoPool);
const restServer = new RestServer(port, txValidator, blockChain, utxoPool);
const logger = new Logger('server');

// Setup initial transaction
const outputs = [new Output(keys.public, amount)];
const initialTx = new Transaction([], outputs, 0, 0);
blockChain.append(initialTx);
outputs.forEach((o, index) => utxoPool.add(new UTXO(initialTx.id, index)));
logger.info(`Starting server with ${amount} coins.`);