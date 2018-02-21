import { RestClient } from './restclient';
import * as minimist from 'minimist';
import * as fs from 'fs';

// Parse arguments
let args = minimist(process.argv.slice(2));
if (!args.host) exitWithMessage('--host argument is required');
if (!args.keys) exitWithMessage('--keys argument is required.');
if (!args.type) exitWithMessage('--type arguments is required');
if (!['create'].includes(args.type)) exitWithMessage('Unsupported type argument (create is supported)');

// Setup environment
const keys = fs.readFileSync(args.keys);
const restClient = new RestClient(args.host);

// Check if new coins should be created
if (args.type === 'create') {
    // Parse additional arguments
    if (!args._[0]) exitWithMessage('Amount required as a parameter when creating coins');
    let amount = Number.parseInt(args._[0]);
    if (amount == NaN) exitWithMessage('Amount is not recognized as a valid number');

    // Create a "New coins" transaction and send it to the server
    restClient.createCoins(amount, err => {
        if (!!err) {
            console.log('An error occurred while attempting to communicate with server:');
            return console.log(err);
        }

        console.log(`${amount} coins were created succesfully`);
    });
}

/**
 * Kills the running process with an error.
 * @param msg The message to display to the user before exiting.
 */
function exitWithMessage(msg) {
    console.log(msg);
    process.exit(1);
}