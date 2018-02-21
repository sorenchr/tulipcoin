import * as http from 'http';
import * as minimist from 'minimist';
import { BlockChain } from './blockchain';
import { RestServer } from './restserver';

// Parse arguments
let args = minimist(process.argv.slice(2));
const port = args.p || 8080;

// Setup environment
const blockchain = new BlockChain();
const restServer = new RestServer(port);

// Handle created coins
restServer.onCreateCoins(req => log(`${req.amount} new coins created for ${req.to}`));

/**
 * Logs a message to the console with a timestamp.
 * @param msg The message to log.
 */
function log(msg) {
    let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    console.log(`[${timestamp}] ${msg}`);
}