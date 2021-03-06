# Chaincore Node
Chaincore, the NodeJS package that enables simplistic APIs among cryptocurrency blockchains.

## Contents

* [Supported Chains](#supported-chains)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Configuration](#configuration)
* [Usage](#usage)
    * [REST API](#rest-api)
        * [Serving the API](#serving-the-api)
        * [Endpoints List](#endpoints-list)
        * [HTTP JSON Response Structure](#http-json-response-structure)
    * [Websockets](#websockets)
        * [Serving the Stream](#serving-the-stream)
        * [Socket JSON Request Structure](socket-json-request-structure)
        * [Socket JSON Response Structure](#socket-json-response-structure)
        * [NodeJS Code Example](#nodejs-code-example)
        * [Vanilla JS Code Example](#vanilla-js-code-example)
* [Ubuntu Setup Cheatsheet](#ubuntu-setup-cheatsheet)
* [License](#license)

## Supported Chains
* `bch`
* `btc`
* `ltc`

## Prerequisites
* `npm` >= 6.0.0
* `node` >= 10.0.0
* `libzmq3-dev`

## Installation
```
npm install chaincore-node
```

## Configuration
Create a `config.json` using `config.example.json`
<details>
<summary>See example</summary>

```
{
  "api": {
    "port": 7070
  },
  "stream": {
    "port": 8080
  },
  "network": "mainnet",
  "chains": {
    "bch": {
      "zmq": {
        "host": "127.0.0.1",
        "port": 20000
      },
      "rpc": {
        "user": "username",
        "pass": "password",
        "host": "127.0.0.1",
        "port": 30000
      }
    },
    "btc": {
      "zmq": {
        "host": "127.0.0.1",
        "port": 20001
      },
      "rpc": {
        "user": "username",
        "pass": "password",
        "host": "127.0.0.1",
        "port": 30001
      }
    },
    "ltc": {
      "zmq": {
        "host": "127.0.0.1",
        "port": 20002
      },
      "rpc": {
        "user": "username",
        "pass": "password",
        "host": "127.0.0.1",
        "port": 30002
      }
    }
  }
}
```
</details>

# Usage
Chaincore provides REST and Websocket APIs for: Bitcoin, Bitcoin Cash and Litecoin nodes.

## REST API
The Chaincore REST API allows for effective blockchain interaction via HTTP endpoints.

#### Serving the API
```
node node_modules/chaincore-node/serve-api.js /path/to/config.json
```

#### Endpoints List
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/:chain/peer` | Get peer info |
| GET | `/api/:chain/network` | Get network info |
| GET | `/api/:chain/mining` | Get mining info |
| GET | `/api/:chain/blocks` | Get latest blocks |
| GET | `/api/:chain/blocks/tip` | Get best block |
| GET | `/api/:chain/blocks/height` | Get blocks height |
| GET | `/api/:chain/block/:hash` | Get block details given the `hash` |
| POST | `/api/:chain/address/:address` | Import the given `address` without rescanning |
| GET | `/api/:chain/address/:address/utxos` | Get UTXOs belonging to the given `address` |
| GET | `/api/:chain/address/:address/balance` | Get unspent balance of the given `address` |
| GET | `/api/:chain/mempool` | Get mempool transactions |
| GET | `/api/:chain/tx/:txId` | Get transaction details given the `txId` |
| GET | `/api/:chain/tx/:txId/block` | Get transaction block details given the `txId` |
| POST | `/api/:chain/broadcast/:hex` | Broadcast a transaction given the `hex` |

**Please note:** endpoints that get address UTXOs or balance will only return data that occurred after the address was imported. Chaincore is designed to be watch-only, therefore no rescan happens following an address import.

#### HTTP JSON Response Structure
```
{
    "success": <bool>,
    "message": <null|string>,
    "results": <object|array>
}
```

## Websockets
The Chaincore websockets stream allows for real-time blockchain event subscriptions.

#### Serving the Stream
```
node node_modules/chaincore-node/serve-stream.js /path/to/config.json
```

#### Channels List
| Method | Channel | Description |
|---|---|---|
| `subscribe`/`unsubscribe` | `btc:block` | Stream new blocks |
| `subscribe`/`unsubscribe` | `btc:tx` | Stream new transactions |
| `subscribe`/`unsubscribe` | `btc:utxo` | Stream new UTXOs |

#### Socket JSON Request Structure
```
{
    "method": <string>,
    "channel": <string>,
    "params": <array>
}
```

#### Socket JSON Response Structure
```
{
    "success": <bool>,
    "message": <null|string>,
    "channel": <string>,
    "method": <string>,
    "results": <object>
}
```

#### NodeJS Code Example
Example using: `ws` as a client on the server.

First, install `ws` via the following command: `npm install ws` - then, subscribe to channels and receive events like so:
```javascript
const WebSocket = require('ws')
const ws = new WebSocket('ws://127.0.0.1:8080')

ws.on('open', () => {
  console.log('Connected')

  let request = {method: 'subscribe', channel: 'btc:utxo', params: []}

  ws.send(JSON.stringify(request))
})

ws.on('message', message => {
  let event = JSON.parse(message)

  console.log(event)
})
```

#### Vanilla JS Code Example
No need to install anything else, simply run the following code in any modern browser:
```javascript
const ws = new WebSocket('ws://127.0.0.1:8080')

ws.addEventListener('open', () => {
  console.log('Connected')

  let request = {method: 'subscribe', channel: 'btc:utxo', params: []}

  ws.send(JSON.stringify(request))
})

ws.addEventListener('message', message => {
  let event = JSON.parse(message.data)

  console.log(event)
})
```

## Ubuntu Setup Cheatsheet
Get Chaincore working on Ubuntu 18.04 (from-scratch) using the following instructions:

##### Prerequisites
```
sudo apt update
sudo apt install npm
sudo apt install nodejs
sudo apt install libzmq3-dev
```

##### Install (optional) `pm2` daemon manager
```
npm install pm2@latest -g
pm2 install pm2-logrotate
```

##### Setup the project
```
cd /var
git clone https://github.com/Vimiso/chaincore-node.git
cd /var/chaincore-node
npm install
```

##### Configure Chaincore
```
vi /var/chaincore-node/config.json
```

##### Install a Bitcoin full-node
```
mkdir /root/.bitcoin
cd /root/.bitcoin
wget https://bitcoin.org/bin/bitcoin-core-0.20.1/bitcoin-0.20.1-x86_64-linux-gnu.tar.gz
tar -xf bitcoin-0.20.1-x86_64-linux-gnu.tar.gz
```

##### Configure the full-node
```
vi /root/.bitcoin/bitcoin.conf
```

```
port=10001
whitelist=127.0.0.1
txindex=1
listen=1
server=1
upnp=1
dbcache=512

rpcport=30001
rpcallowip=127.0.0.1

rpcuser=username
rpcpassword=password

datadir=/mnt/bitcoin

zmqpubrawblock=tcp://127.0.0.1:20001
zmqpubrawtx=tcp://127.0.0.1:20001
zmqpubhashtx=tcp://127.0.0.1:20001
zmqpubhashblock=tcp://127.0.0.1:20001
```

*Important: a mounted disk (`/mnt/bitcoin`) with at-least 350GB is required to store the Bitcoin blockchain.*

##### Run `bitcoind` as a daemon:
```
/root/.bitcoin/bitcoin-0.20.1/bin/bitcoind -conf=/root/.bitcoin/bitcoin.conf -daemon
```

Now you must wait for Bitcoin to sync... you can find the sync progress and other useful logs in: `/mnt/bitcoin/debug.log`.

Once synced you're ready to run Chaincore as a daemon using `pm2`!

##### Run Chaincore
```
pm2 startup
pm2 start /var/chaincore-node/serve-api.js
pm2 start /var/chaincore-node/serve-stream.js
pm2 save
```

You can monitor `pm2` daemons by running: `pm2 monit`

##### You're done!

You can repeat these instructions with other supported blockchains, here's the list:
* Bitcoin: https://bitcoin.org/bin/bitcoin-core-0.20.1/bitcoin-0.20.1-x86_64-linux-gnu.tar.gz
* Bitcoin Cash: https://github.com/bitcoin-cash-node/bitcoin-cash-node/releases/download/v22.1.0/bitcoin-cash-node-22.1.0-x86_64-linux-gnu.tar.gz
* Litecoin: https://download.litecoin.org/litecoin-0.18.1/linux/litecoin-0.18.1-x86_64-linux-gnu.tar.gz

## License

Copyright 2020 Vimiso

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
