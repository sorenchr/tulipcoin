import { RestClient } from './restclient';
import * as minimist from 'minimist';
import * as fs from 'fs';

// Parse arguments
let args = minimist(process.argv.slice(2));
if (!args.host) exitWithMessage('--host argument is required');
if (!args.keys) exitWithMessage('--keys argument is required.');
if (!args.to) exitWithMessage('--to argument is required');
if (!args.amount) exitWithMessage('--amount argument is required');

// Setup environment
const keys = JSON.parse(fs.readFileSync(args.keys, 'utf8'));
const restClient = new RestClient(args.host);

// Parse amount argument
let amount = Number.parseInt(args.amount);
if (amount == NaN) exitWithMessage('Amount is not recognized as a valid number');

// Send a "Transfer coins" transaction to the server
restClient.transferCoins(amount, keys.public, args.to)
    .then(() => console.log(`${amount} coins were transferred succesfully`))
    .catch(err => console.log(`An error occurred while attempting to transfer coins: ${err}`));

/**
 * Kills the running process with an error.
 * @param msg The message to display to the user before exiting.
 */
function exitWithMessage(msg): void {
    console.log(msg);
    process.exit(1);
}