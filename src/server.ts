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