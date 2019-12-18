const j = require('jscodeshift');
const path = require('path');
const fs = require('fs');
const {transformHandler} = require('@olaf-mix/olaf-mix');

// const config_path = path.resolve(process.cwd(), '.olaf.config.js');
// let config = null;
// if (fs.existsSync(config_path)){
//     config = require(config_path);
// } else {
//     config = require(path.resolve(__dirname, './.default.olaf.config.js'));
// }

function OlafMixLoader(source) {
    // Custom loader logic
    const root = j(source);
    transformHandler(root);
    return root.toSource({quote: 'single'});
}


module.exports = OlafMixLoader;
