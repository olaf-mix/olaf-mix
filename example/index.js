const fs = require('fs');
const path = require('path');
const log = require('loglevel');
const j = require('jscodeshift');
const {mixCode} = require('../src/index');
log.setLevel(process.env.RUN_MODE === 'debug' ? 'debug' : 'warn');

const inputFile = path.resolve(__dirname, 'input.js');
const input = fs.readFileSync(inputFile,{encoding: 'utf8'});
const output = mixCode(input);
fs.writeFileSync(inputFile.replace('input', 'output'), output)
