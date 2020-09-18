const fs = require('fs');
const path = require('path');
const log = require('loglevel');
const j = require('jscodeshift');
const {flatMixSet, generateMixSet, mixCode, randomBarbList} = require('../src/index');
// console.log(randomBarbList([1, 2, 3, 0, 5, 0, 7, 8]));

log.setLevel(process.env.RUN_MODE === 'debug' ? 'debug' : 'warn');

const inputFile = path.resolve(__dirname, 'input.ts');
const outputFile = inputFile.replace('input', 'output');
log.debug(`${inputFile} -> ${outputFile}`);
const input = fs.readFileSync(inputFile,{encoding: 'utf8'});
const output = mixCode(input, {parser: 'ts'}).source;
fs.writeFileSync(outputFile, output);
