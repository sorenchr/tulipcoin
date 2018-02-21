import * as http from 'http';
import * as minimist from 'minimist';
import * as querystring from 'querystring';
import * as fs from 'fs';

// Parse arguments
let args = minimist(process.argv.slice(2));
if (!args.host) exitWithMessage('--host argument is required');
if (!args.keys) exitWithMessage('--keys argument is required.');
if (!args.type) exitWithMessage('--type arguments is required');
if (!['create'].includes(args.type)) exitWithMessage('Unsupported type argument (create is supported)');

// Load the keys from disk
const keys = fs.readFileSync(args.keys);

// Check if new coins should be created
if (args.type === 'create') {
    // Parse additional arguments
    if (!args._[0]) exitWithMessage('Amount required as a parameter when creating coins');
    let amount = Number.parseInt(args._[0]);
    if (amount == NaN) exitWithMessage('Amount is not recognized as a valid number');

    // Create a "New coins" transaction and send it to the server
    const body = { type: "createCoins", amount: amount };
    postRequest(body, (err, res) => {
        if (!!err) {
            console.log('An error occurred while attempting to communicate with server:');
            return console.log(err);
        }

        console.log(`${amount} coins were created succesfully`);
    });
}

/**
 * Executes a transaction POST request towards the server indicated by the user.
 * @param body The body that will be sent to the server.
 * @param cb The callback that will be invoked when the transaction request has been handled.
 */
function postRequest(body, cb) {
    const bodyStringified = querystring.stringify(body);
    const hostParts = args.host.split(':');

    const options = {
        hostname: hostParts[0],
        port: hostParts[1],
        path: '/transactions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(bodyStringified)
        }
    };

    let resData = '';
    const req = http.request(options, res => {
        res.setEncoding('utf8')
        res.on('data', chunk => resData += chunk);
        res.on('end', () => cb(null, resData));
    });
    req.on('error', e => cb(e));
    req.write(bodyStringified);
    req.end();
}

/**
 * Kills the running process with an error.
 * @param msg The message to display to the user before exiting.
 */
function exitWithMessage(msg) {
    console.log(msg);
    process.exit(1);
}