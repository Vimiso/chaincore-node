module.exports = class BaseTransformer {
  constructor(network, lib) {
    this.network = network
    this.lib = lib
  }

  txToUtxos(message) {
    const utxos = []
    const tx = this.lib.Transaction(message).toObject()

    tx.outputs.forEach((output, index) => {
      const script = this.lib.Script(output.script)

      utxos.push({
        txId: tx.hash,
        outputIndex: index,
        address: script.toAddress(this.network).toString(),
        script: output.script,
        satoshis: output.satoshis,
      })
    })

    return utxos
  }
}
