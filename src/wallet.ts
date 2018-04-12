import * as keypair from 'keypair';
import * as minimist from 'minimist';
import * as fs from 'fs';

// Parse arguments
let args = minimist(process.argv.slice(2));
const bits = args.b || 256;

// Generate keys and strip them from their headers and footers
let keys = keypair({ bits: bits });
keys.public = keys.public.match('-----BEGIN RSA PUBLIC KEY-----\n(.*?)\n-----END RSA PUBLIC KEY-----\n').pop();
keys.private = keys.private.replace(/(?:\r\n|\r|\n)/g, '').match('-----BEGIN RSA PRIVATE KEY-----(.*?)-----END RSA PRIVATE KEY-----', 'm').pop();

// Check if the keys should be saved to a file
if (!!args.o) fs.writeFileSync(args.o, JSON.stringify(keys), 'utf8');

// Display the keys to the user
console.log(keys);