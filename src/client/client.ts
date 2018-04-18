import { RestClient } from './restclient';
import * as minimist from 'minimist';
import * as fs from 'fs';
import { exitWithMessage } from '../utilities';
import { Logger } from '../logger';
import { Input, Output, Transaction } from '../transaction';
import { config } from '../config';

// Parse arguments
const args = minimist(process.argv.slice(2));
if (!args.host && !config.host) exitWithMessage('--host argument is required.');
if (!args.wallet && !config.wallet) exitWithMessage('--wallet argument is required.');
const host = !!args.host ? args.host : config.host;
const wallet = JSON.parse(fs.readFileSync(!!args.wallet ? args.wallet : config.wallet, 'utf8'));
if (!args.cmd) exitWithMessage('--cmd argument is required.');
if (!['wallet', 'transfer', 'transactions'].includes(args.cmd)) exitWithMessage('--cmd must be either \'wallet\', \'transfer\' or \'transactions\'.');

// Setup environment
const restClient = new RestClient(host);
const logger = new Logger('client');

// Check if this is a 'wallet' command
if (args.cmd === 'wallet') {
    restClient.getWallet(wallet.public)
        .then(res => {
            let total = res.reduce((acc, o) => acc + o.amount, 0);
            console.log('  ' + `You have the following ${total} unspent coins:`);
            res.forEach(o => console.log(`  [\x1b[32m${o.amount}\x1b[0m] \x1b[2m(transaction ID: ${o.txId}, output index: ${o.outputIndex})\x1b[0m`));
        })
        .catch(err => logger.error(`An error occurred while attempting to retrieve wallet: ${err}`));
}

// Check if this is a 'transfer' command
if (args.cmd === 'transfer') {
    // Parse and validate additional arguments
    if (!args.inputs) exitWithMessage('--inputs argument is required.');
    if (!args.outputs) exitWithMessage('--outputs argument is required.');
    var inputs = args.inputs.split(',');
    var outputs = args.outputs.split(',');
    if (!inputs.every(i => /\d+:\d+$/g.test(i))) exitWithMessage('--inputs must be in the format txId1:outputIndex, txId2:outputIndex, ...');
    if (!outputs.every(o => /.+:\d+$/g.test(o))) exitWithMessage('--outputs must be in the format publicKey1:amount, publicKey2: amount, ...');
    inputs = inputs.map(i => i.split(':'));
    outputs = outputs.map(o => o.split(':'));

    // Create inputs and outputs
    let txInputs = inputs.map(i => new Input(Number(i[0]), Number(i[1])));
    let txOutputs = outputs.map(o => new Output(o[0], Number(o[1])));

    // Send a "Transfer coins" transaction to the server
    restClient.postTransaction(txInputs, txOutputs, wallet.private, wallet.public)
        .then(() => logger.info(`Transaction was succesfully added to blockchain.`))
        .catch(err => logger.error(`An error occurred while attempting to transfer coins: ${err}.`));
}

// Check if this is a 'transactions' command
if (args.cmd === 'transactions') {
    // Check if the client is requesting just a single transaction
    if (!!args.id) {
        const id = Number.parseInt(args.id);
        if (id == NaN) exitWithMessage('ID is not recognized as a valid number');
        restClient.getTransaction(id)
            .then(tx => printTransaction(tx))
            .catch(err => logger.error(`An error occured while attempting to retrieve transaction: ${err}`));
    } else {
        restClient.getTransactions()
            .then(txs => {
                let sortedTxs = txs.sort((tx1, tx2) => tx1.id - tx2.id);
                console.log('  ' + `Retrieved the following ${sortedTxs.length} transaction(s):`);
                sortedTxs.forEach(tx => printTransaction(tx));
            })
            .catch(err => logger.error(`An error occured while attempting to retrieve transactions: ${err}`)); 
    }
}

function printTransaction(tx: Transaction) {
    console.log('    ' + `\x1b[4m● Transaction ID: ${tx.id}, previous transaction ID: ${tx.prevTxId}.\x1b[0m`);
    
    if (tx.inputs.length > 0) console.log('      ' + '\x1b[2m→ Inputs:\x1b[0m');
    tx.inputs.forEach((input, index) => console.log('        ' + `${index + 1}.  Transaction ID: ${input.txId}, output index: ${input.outputId}.`));

    console.log('      ' + '\x1b[2m← Outputs:\x1b[0m');
    tx.outputs.forEach((output, index) => console.log('        ' + `${index + 1}.  Receiver: ${output.receiver}, amount: ${output.amount}.`));
}