import * as keypair from 'keypair';
import * as minimist from 'minimist';
import * as fs from 'fs';

// Parse arguments
let args = minimist(process.argv.slice(2));

// Generate keys
const keys = keypair({ bits: 256 });

// Check if the keys should be saved to a file
if (!!args.o) fs.writeFileSync(args.o, JSON.stringify(keys), 'utf8');

// Display the keys to the user
console.log(keys);