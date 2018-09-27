const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, 'contracts', 'CryptoZombie.sol');
const source = fs.readFileSync(contractPath, 'utf8');
const output = solc.compile(source, 1).contracts;

if (!output) {
  abort('No output from compiler');
} else if (output['errors']) {
  function isWarning (message) {
    return message.match(/^(.*:[0-9]*:[0-9]* )?Warning: /)
  }

  for (var error in output['errors']) {
    var message = output['errors'][error]
    if (isWarning(message)) {
      console.log(message)
    } else {
      console.error(message)
    }
  }
}

fs.ensureDirSync(buildPath);

  for (let contract in output) {
    fs.outputJsonSync(
      path.resolve(buildPath, contract.replace(':', '') + '.json'),
      output[contract]
    );
  }
