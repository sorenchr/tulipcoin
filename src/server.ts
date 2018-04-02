import * as http from 'http';
import * as minimist from 'minimist';
import { BlockChain } from './blockchain';
import { RestServer } from './restserver';
import * as keypair from 'keypair';
import * as fs from 'fs';
import { Transaction } from './transaction';

// Parse arguments
let args = minimist(process.argv.slice(2));
const port = args.p || 8080;
const amount = !!args.amount ? Number.parseInt(args.amount) : 100;
if (!args.keys) exitWithMessage('--keys argument is required.');
if (amount == NaN) exitWithMessage('Amount is not recognized as a valid number');
const keys = JSON.parse(fs.readFileSync(args.keys, 'utf8'));

// Setup environment
const blockChain = new BlockChain();
const restServer = new RestServer(port, blockChain);

// Setup initial transaction
const initialTx = new Transaction(keys.public, keys.public, amount, 0);
blockChain.append(initialTx);
log(`Starting server with ${amount} coins.`);

// Handle transferred coins
restServer.onTransaction(tx => {
    blockChain.append(tx);
    log(`${tx.amount} coins transferred from ${tx.from} to ${tx.to}.`);
});

/**
 * Logs a message to the console with a timestamp.
 * @param msg The message to log.
 */
function log(msg) {
    let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    console.log(`[${timestamp}] ${msg}`);
}

/**
 * Kills the running process with an error.
 * @param msg The message to display to the user before exiting.
 */
function exitWithMessage(msg): void {
    console.log(msg);
    process.exit(1);
}