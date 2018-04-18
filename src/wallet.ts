import * as NodeRSA from 'node-rsa';
import * as minimist from 'minimist';
import * as fs from 'fs';
import { config } from './config';
import { exitWithMessage } from './utilities';

// Parse arguments
let args = minimist(process.argv.slice(2));
const bits = Number.parseInt(!!args.b ? args.b : !!config.keySize ? config.keySize : 512);
if (bits == NaN) exitWithMessage('Keysize in bits is not recognized as a valid number');

// Generate wallet
let key = new NodeRSA({ b: bits });
let wallet = {
    public: key.exportKey('pkcs1-public-pem'),
    private: key.exportKey('pkcs1-private-pem')
};

// Check if the wallet should be saved to a file
if (!!args.o) fs.writeFileSync(args.o, JSON.stringify(wallet), 'utf8');

// Display the wallet to the user
console.log(wallet);