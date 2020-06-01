const args = process.argv.slice(2)
const file = args[0] !== undefined ? args[0] : `${process.env.root}/config.json`
const config = JSON.parse(require('fs').readFileSync(file))

console.log(`Loaded config for [${config.network}] network`)

module.exports = config