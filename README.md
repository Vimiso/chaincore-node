# Chaincore Node
Chaincore, the NodeJS package that enables effective APIs among cryptocurrency blockchains.

### Contents

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
        * [Socket JSON Response Structure](#socket-json-response-structure)
        * [NodeJS Code Example](#nodejs-code-example)

### Supported Chains
* `bch`
* `btc`
* `ltc`

### Prerequisites
* `npm` >= 6.0.0
* `node` >= 8.0.0
* `libzmq3-dev`

##### Ubuntu Quickstart:
```
sudo apt install npm
sudo apt install nodejs
sudo apt install libzmq3-dev
```

### Installation
```
npm install chaincore-node
```

### Configuration
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
Chaincore provides REST + Websocket APIs for: Bitcoin, Bitcoin Cash and Litecoin nodes.

## REST API
The Chaincore REST API allows for simplistic blockchain interaction via HTTP endpoints.

##### Serving the API
```
node node_modules/chaincore-node/serve-api.js
```

##### Endpoints List
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/{chain}/peer` | Get peer info |
| GET | `/api/{chain}/network` | Get network info |
| GET | `/api/{chain}/mining` | Get mining info |
| GET | `/api/{chain}/blocks` | Get latest blocks |
| GET | `/api/{chain}/blocks/tip` | Get best block |
| GET | `/api/{chain}/block/{hash}` | Get block details given the `hash` |
| GET | `/api/{chain}/mempool` | Get mempool transactions |
| GET | `/api/{chain}/tx/{txId}` | Get transaction details given the `txId` |
| GET | `/api/{chain}/sendrawtx/{hex}` | Broadcast a transaction given the `hex` |

##### HTTP JSON Response Structure
```
{
    "success": <bool>,
    "message": <string>,
    "results": <object|array>
}
```

## Websockets
The Chaincore websockets stream allows for real-time blockchain event subscriptions.

##### Serving the Stream
```
node node_modules/chaincore-node/serve-stream.js
```

##### Channels List
| Channel | Description |
|---|---|
| `{chain}:block` | Subscribe to blocks |
| `{chain}:tx` | Subscribe to transactions |
| `{chain}:utxo` | Subscribe to UTXOs |

##### Socket JSON Response Structure
```
{
    "success": <bool,
    "message": <null|string>,
    "channel": <string>,
    "method": <string>,
    "results": <object>
}
```

#### NodeJS Code Example
Example using: `ws` as a client on the server.

First, install `ws` via the following command: `npm install ws` - then, subscribe to channels like so:
```javascript
const WebSocket = require('ws')
const ws = new WebSocket('ws://127.0.0.1:8080')

ws.on('open', () => {
  console.log('Connected')

  let request = {method: 'subscribe', channel: 'btc:utxo', params: []}

  ws.send(JSON.stringify(request))
})

ws.on('message', message => {
  let response = JSON.parse(message)

  console.log(response)
})
```


@TODO: finish docs...
