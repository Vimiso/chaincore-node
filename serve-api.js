process.env.root = __dirname;

const Server = require(`${process.env.root}/src/Apis/Server`)
const Chaincore = require(`${process.env.root}/src/Apis/Chaincore`)

const chains = {}
const config = JSON.parse(require('fs').readFileSync('./config.json'))
const supported = require(`${process.env.root}/supported`)

console.log(`Setting up chains on: [${config.network}] network...`)

Object.keys(config.chains).forEach(chain => {
  if (! Object.keys(supported).includes(chain)) {
    throw new Error(`Unsupported chain: ${chain}`)
  }

  chains[chain] = {
    rpc: new supported[chain].rpc(
      config.chains[chain].rpc.user,
      config.chains[chain].rpc.pass,
      config.chains[chain].rpc.host,
      config.chains[chain].rpc.port
    ),
    tsf: new supported[chain].tsf(config.network)
  }
})

const Stream = new Chaincore(chains, new Server(config.api))
