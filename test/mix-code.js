const j = require('jscodeshift');
const path = require('path');
const fs = require('fs');
const numeral = require('numeral');
const {transformHandler} = require('../src/main');

const TEMP = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_#.*-+';
module.exports = function(fileInfo, api, options) {
    const root = j(fileInfo.source);
    transformHandler(root);
    process.env.RUN_MODE === 'debug' && fs.writeFileSync(fileInfo.path.replace('input', 'output'), root.toSource())
    return root.toSource();
};
