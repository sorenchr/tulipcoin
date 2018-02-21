import * as http from 'http';
import * as minimist from 'minimist';
import { BlockChain } from './blockchain';
import { RestServer } from './restserver';

// Parse arguments
let args = minimist(process.argv.slice(2));
const port = args.p || 8080;

// Setup environment
const blockchain = new BlockChain();
const restServer = new RestServer(port, ts => blockchain.isValid(ts));

// Handle created coins
restServer.on('createCoins', ts => {
    blockchain.append(ts);
    log(`${ts.amount} new coins created for ${ts.to}`);
});

// Handle transferred coins
restServer.on('transferCoins', ts => {
    blockchain.append(ts);
    log(`${ts.amount} coins transferred from ${ts.from} to ${ts.to}`);
});

/**
 * Logs a message to the console with a timestamp.
 * @param msg The message to log.
 */
function log(msg) {
    let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    console.log(`[${timestamp}] ${msg}`);
}