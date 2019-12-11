const j = require('jscodeshift');
const {transformHandler} = require('./main')
import * as log from 'loglevel';
log.setLevel(process.env.RUN_MODE === 'debug' ? 'debug' : 'warn')

module.exports = function(fileInfo, api, options){
    console.log('transforming', fileInfo.path);
    const root = api.jscodeshift(fileInfo.source);
    transformHandler(root);
    return root.toSource({quote: 'single'});
}
