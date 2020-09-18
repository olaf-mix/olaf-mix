const fs = require('fs');
const path = require('path');
const log = require('loglevel');
const j = require('jscodeshift');
const argv = process.argv.splice(2);
const src = path.resolve(__dirname, '..', 'example')


const {flatMixSet, generateMixSet, mixCode, randomBarbList} = require('../src/index');
log.setLevel(argv.some(_ => _ === '--debug') ? 'debug' : 'warn');

const inputFile = path.resolve(src, 'input.js');
const outputFile = inputFile.replace('input', 'output');
log.debug(`${inputFile} -> ${outputFile}`);
const input = fs.readFileSync(inputFile,{encoding: 'utf8'});
const output = mixCode(input, {parser: 'js'}).source;
fs.writeFileSync(outputFile, output);
