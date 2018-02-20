import * as http from 'http';
import * as minimist from 'minimist';
import { BlockChain } from './blockchain';

// Parse arguments
let args = minimist(process.argv.slice(2));
const port = args.p || 8080;

// Setup environment
const blockchain = new BlockChain();

// Setup the server
const server = http.createServer((req, res) => {
    res.end('test');
});

server.listen(port, () => console.log(`Server started on port ${port}`));