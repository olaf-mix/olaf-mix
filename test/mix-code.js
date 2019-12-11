const j = require('jscodeshift');
const path = require('path');
const fs = require('fs');
const numeral = require('numeral');
const {transformHandler} = require('../src/main');
require('loglevel').setLevel('debug');


module.exports = function(fileInfo, api, options) {
    const root = j(fileInfo.source);
    transformHandler(root);
    const source = root.toSource({quote: 'single'});
    process.env.RUN_MODE === 'debug' && fs.writeFileSync(fileInfo.path.replace('input', 'output'), source)
    return source;
};
