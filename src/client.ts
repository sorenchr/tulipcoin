import * as http from 'http';
import * as minimist from 'minimist';

// Parse arguments
let args = minimist(process.argv.slice(2));
if (!args.keys) exitWithMessage('--keys argument is required.');
if (!args.type) exitWithMessage('--type arguments is required');
if (!['create'].includes(args.type)) exitWithMessage('Unsupported type argument (create is supported)');

// Check if new coins should be created
if (args.type === 'create') {
    
}

/**
 * Kills the running process with an error.
 * @param msg The message to display to the user before exiting.
 */
function exitWithMessage(msg) {
    console.log(msg);
    process.exit(1);
}