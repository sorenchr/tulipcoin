import * as express from 'express';
import * as minimist from 'minimist';
import { BlockChain } from './blockchain';

// Parse arguments
let args = minimist(process.argv.slice(2));
let port = args.p || 8080;

// Setup environment
const app = express();
const blockchain = new BlockChain();

app.get('/transactions', (req, res) => res.send('list all transactions'));

app.listen(port, () => console.log(`Server started on port ${port}`));