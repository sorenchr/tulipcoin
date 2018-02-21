import * as http from 'http';
import * as minimist from 'minimist';
import { BlockChain } from './blockchain';

// Parse arguments
let args = minimist(process.argv.slice(2));
const port = args.p || 8080;

// Setup environment
const blockchain = new BlockChain();

// Setup the HTTP server
const server = http.createServer((req, res) => {
    console.log(req.url);
    res.end('test');
});

// Start the HTTP server
server.listen(port, () => console.log(`Server started on port ${port}`));