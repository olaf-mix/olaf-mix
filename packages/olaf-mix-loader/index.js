const j = require('jscodeshift');
const path = require('path');
const fs = require('fs');
const {mixCode} = require('@olaf-mix/olaf-mix');
const {getOptions} = require('loader-utils');

// const config_path = path.resolve(process.cwd(), '.olaf.config.js');
// let config = null;
// if (fs.existsSync(config_path)){
//     config = require(config_path);
// } else {
//     config = require(path.resolve(__dirname, './.default.olaf.config.js'));
// }

function OlafMixLoader(source) {
    const options = getOptions(this) || {};
    let parser = /^.*\.tsx?$/.test(this.resourcePath) ? 'ts' : 'js';
    if (options.parser){
        parser = options.parser
    }
    return mixCode(source, {forceInjected: true, parser});
}


module.exports = OlafMixLoader;
