const j = require('jscodeshift');
const path = require('path');
const fs = require('fs');
const {mixCode} = require('@olaf-mix/olaf-mix');

// const config_path = path.resolve(process.cwd(), '.olaf.config.js');
// let config = null;
// if (fs.existsSync(config_path)){
//     config = require(config_path);
// } else {
//     config = require(path.resolve(__dirname, './.default.olaf.config.js'));
// }

function OlafMixLoader(source) {
    return mixCode(source);
}


module.exports = OlafMixLoader;
