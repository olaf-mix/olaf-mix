const j = require('jscodeshift');
const {transformHandler} = require('./main')
const log = require('loglevel');
log.setLevel(process.env.RUN_MODE === 'debug' ? 'debug' : 'warn')

module.exports = function(fileInfo, api, options){
    const root = api.jscodeshift(fileInfo.source);
    transformHandler(root);
    return root.toSource({quote: 'single'});
}
