const j = require('jscodeshift');
const path = require('path');
const fs = require('fs');
const numeral = require('numeral');
const {mixCode} = require('../src/index');
require('loglevel').setLevel('debug');


module.exports = function(fileInfo, api, options) {
    const source = mixCode(fileInfo.source);
    process.env.RUN_MODE === 'debug' && fs.writeFileSync(fileInfo.path.replace('input', 'output'), source)
    return source;
};
