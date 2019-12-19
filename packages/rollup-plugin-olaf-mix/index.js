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
            let parser = /^.*\.tsx?$/.test(id) ? 'ts' : 'js';
            if (options.parser){
                parser = options.parser
            }
            return {
                code: mixCode(code, {forceInjected, parser})
            };
        }
    };
};