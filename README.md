# Chaincore Node
Chaincore, the NodeJS package that enables effective interaction between multiple cryptocurrency blockchains.

Chaincore provides REST + Websocket APIs for: Bitcoin, Bitcoin Cash and Litecoin nodes.

### Supported Chains
* `bch`
* `btc`
* `ltc`

### Prerequisites
* `npm` >= 6.0.0
* `node` >= 8.0.0
* `libzmq3-dev`

Ubuntu Quickstart:
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

### REST API
You can interact with blockchains via REST API endpoints. Serve the API by running:
```
node node_modules/chaincore-node/serve-api.js
```

### Endpoints
* [GET] `/api/{chain}/peer`
* [GET] `/api/{chain}/network`
* [GET] `/api/{chain}/mining`
* [GET] `/api/{chain}/blocks`
* [GET] `/api/{chain}/blocks/tip`
* [GET] `/api/{chain}/block/{hash}`
* [GET] `/api/{chain}/mempool`
* [GET] `/api/{chain}/tx/{txId}`
* [GET] `/api/{chain}/sendrawtx/{hex}`

### JSON Response Structure
```
{
    success: <bool>,
    message: <string>,
    results: <object>
}
```

### Websockets
You can subscribe to blockchains events via a websocket stream. Serve the websockets by running:
```
node node_modules/chaincore-node/serve-stream.js
```

@TODO: finish docs...
