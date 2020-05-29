const lib = require('bitcore-lib')
const BaseTransformer = require(`${process.env.root}/src/Transformers/BaseTransformer`)

module.exports = class Transformer extends BaseTransformer
{
  constructor(network)
  {
    super(network || 'mainnet', lib)
  }
}
