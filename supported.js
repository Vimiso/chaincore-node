module.exports = {
  bch: {
    rpc: require(`${process.env.root}/src/Rpcs/BitcoinCash/Client`),
    tsf: require(`${process.env.root}/src/Transformers/BitcoinCash/Transformer`),
  },
  btc: {
    rpc: require(`${process.env.root}/src/Rpcs/Bitcoin/Client`),
    tsf: require(`${process.env.root}/src/Transformers/Bitcoin/Transformer`),
  },
  ltc: {
    rpc: require(`${process.env.root}/src/Rpcs/Litecoin/Client`),
    tsf: require(`${process.env.root}/src/Transformers/Litecoin/Transformer`),
  },
}