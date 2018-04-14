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
import { config } from '../config';

// Parse arguments
const args = minimist(process.argv.slice(2));
const port = args.p || 8080;
const amount = !!args.amount ? Number.parseInt(args.amount) : 100;
if (!args.wallet && !config.wallet) exitWithMessage('--wallet argument is required.');
const wallet = JSON.parse(fs.readFileSync(!!args.wallet ? args.wallet : config.wallet, 'utf8'));
if (amount == NaN) exitWithMessage('Amount is not recognized as a valid number');

// Setup environment
const blockChain = new BlockChain();
const utxoPool = new UTXOPool();
const txValidator = new TxValidator(utxoPool, blockChain);
const restServer = new RestServer(port, txValidator, blockChain, utxoPool);
const logger = new Logger('server');

// Setup initial transaction
const outputs = [new Output(wallet.public, amount)];
const initialTx = new Transaction([], outputs);
blockChain.append(initialTx);
outputs.forEach((o, index) => utxoPool.add(new UTXO(initialTx.id, index)));
logger.info(`Starting server with ${amount} coins.`);