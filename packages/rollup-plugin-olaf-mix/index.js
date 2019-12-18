const j = require('jscodeshift');
const { createFilter } = require('@rollup/pluginutils');
const {mixCode} = require('@olaf-mix/olaf-mix');

module.exports = (options = {}) => {
    const filter = createFilter(options.include, options.exclude, {
    });
    let forceInjected = false;
    return {
        name: 'rollup-plugin-olaf-mix',
        load(id){
            forceInjected = true;
        },
        transform(code, id) {
            if (!filter(id)) return null;
            return {
                code: mixCode(code, {forceInjected})
            };
        }
    };
};