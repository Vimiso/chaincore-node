process.env.root = __dirname

const Server = require(`${process.env.root}/src/Apis/Server`)
const Chaincore = require(`${process.env.root}/src/Apis/Chaincore`)

const chains = {}
const config = require(`${process.env.root}/config`)
const supported = require(`${process.env.root}/supported`)

Object.keys(config.chains).forEach((chain) => {
  if (!Object.keys(supported).includes(chain)) {
    throw new Error(`Unsupported chain [${chain}]`)
  }

  chains[chain] = {
    rpc: new supported[chain].rpc(config.chains[chain].rpc),
    tsf: new supported[chain].tsf(config.network),
  }
})

const Api = new Chaincore(chains, new Server(config.api))
