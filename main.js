const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(index, timestamp, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = [];
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        let computedHash = this.calculateHash()
        while (!computedHash.startsWith('0'.repeat(difficulty))) {
            this.nonce++
            computedHash = this.calculateHash()
        }
        this.hash = computedHash
    }
}
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransaction = [];
        this.difficulty = 3;
    }

    createGenesisBlock() {
        return new Block(0, '22/05/2021 22:30', 'Genesis Block', null)
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addToPendingTransaction(transaction) {
        this.pendingTransaction.push(transaction)
    }

    isChainValid() {
        for (let i = 0; i < this.chain.length; i++) {
            if (this.chain[i].previousHash != this.chain[i - 1].hash) {
                return false;
            }
        }
        return true;
    }

    addBlock() {
        if (this.pendingTransaction.length > 0) {
            let block = new Block(this.getLatestBlock().index + 1, new Date(), this.getLatestBlock().hash)
            for (let i = 0; i < this.pendingTransaction.length; i++)
                block.transactions.push(this.pendingTransaction[i]);
            block.mineBlock(this.difficulty)
            this.chain.push(block);
            this.pendingTransaction = [];
        } else {
            console.log('No more transactions.');
        }
    }
}

class Transaction {
    constructor(sender, receiver, amount) {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
    }
}

let savjeeCoin = new Blockchain();

savjeeCoin.addToPendingTransaction(new Transaction('Piotrek', 'Konrad', 1900))
savjeeCoin.addToPendingTransaction(new Transaction('Piotrek', 'Konrad', 2000))
savjeeCoin.addToPendingTransaction(new Transaction('Piotrek', 'Konrad', 2100))

savjeeCoin.addBlock()

savjeeCoin.addToPendingTransaction(new Transaction('Adam', 'Miłosz', 1900))
savjeeCoin.addToPendingTransaction(new Transaction('Adam', 'Miłosz', 2000))
savjeeCoin.addToPendingTransaction(new Transaction('Adam', 'Miłosz', 2100))

savjeeCoin.addBlock()
console.log(JSON.stringify(savjeeCoin, null, 4));