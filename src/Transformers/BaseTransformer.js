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

  estimateFee(toAddress, changeAddress, utxos, feePerKb)
  {
    const tx = this.createTx(0, toAddress, changeAddress, utxos, feePerKb)

    return tx._estimateFee()
  }

  createTx(amount, toAddress, changeAddress, utxos, feePerKb)
  {
    const tx = new this.lib.Transaction()
      .feePerKb(feePerKb || this.lib.Transaction.FEE_PER_KB)
      .to(toAddress, amount)
      .change(toAddress)
      .from(utxos)

    return tx
  }

  signTx(amount, toAddress, changeAddress, utxos, privateKeys, feePerKb) {
    const dust = this.lib.Transaction.DUST_AMOUNT

    if (amount < dust) {
      const err = new Error('Amount below dust limit')

      err.sender = 'dust_limit'

      throw err
    }

    const strict = true
    const tx = this.createTx(amount, toAddress, changeAddress, utxos, feePerKb)
    const fee = tx._estimateFee()
    const total = amount + fee
    const balance = tx._getInputAmount()

    if (total > balance) {
      const err = new Error('Insufficient balance')

      err.sender = 'insufficient_balance'
      err.details = {
        // amount: amount,
        // fee: fee,
        required: total,
        balance: balance
      }

      throw err
    }

    const hex = tx.sign(privateKeys).serialize({disableDustOutputs: !strict})
    const change = balance - total

    return [hex, amount, balance, fee, change]
  }
}
