import { RestClient } from './restclient';
import { CreateCoins } from './transactions';
import * as minimist from 'minimist';
import * as fs from 'fs';

// Parse arguments
let args = minimist(process.argv.slice(2));
if (!args.host) exitWithMessage('--host argument is required');
if (!args.keys) exitWithMessage('--keys argument is required.');
if (!args.type) exitWithMessage('--type arguments is required');
if (!['create'].includes(args.type)) exitWithMessage('Unsupported type argument (create is supported)');

// Setup environment
const keys = JSON.parse(fs.readFileSync(args.keys, 'utf8'));
const restClient = new RestClient(args.host);

// Check if new coins should be created
if (args.type === 'create') {
    // Parse additional arguments
    if (!args._[0]) exitWithMessage('Amount required as a parameter when creating coins');
    let amount = Number.parseInt(args._[0]);
    if (amount == NaN) exitWithMessage('Amount is not recognized as a valid number');
    let to = args._[1] || keys.public;

    // Send a "Create coins" transaction to the server
    restClient.createCoins(amount, to)
        .then(() => console.log(`${amount} coins were created succesfully`))
        .catch(err => console.log(`An error occurred while attempting to create coins: ${err}`));
}

/**
 * Kills the running process with an error.
 * @param msg The message to display to the user before exiting.
 */
function exitWithMessage(msg) {
    console.log(msg);
    process.exit(1);
}