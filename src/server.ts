import * as express from 'express';
import { BlockChain } from './blockchain';

const app = express();
const blockchain = new BlockChain();

app.get('/transactions', (req, res) => res.send(JSON.stringify(blockchain.all())));

app.listen(8080, () => console.log('App started on port 8080'));