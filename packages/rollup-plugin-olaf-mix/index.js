const j = require('jscodeshift');
const helpers = require('@babel/helpers');
const { createFilter } = require('@rollup/pluginutils');
const {mixCode, injectHelperCode, generateMixList} = require('@olaf-mix/olaf-mix');

module.exports = (options = {}) => {
    const filter = createFilter(options.include, options.exclude, {
    });
    const mixList = generateMixList();
    let hadInjectedHelper = false;
    const moduleInjectedHelpCode = false;
    return {
        name: 'rollup-plugin-olaf-mix',
        load(id){
        },
        transform(code, id) {
            if (!filter(id)) return null;
            let parser = /^.*\.tsx?$/.test(id) ? 'ts' : 'js';
            if (options.parser){
                parser = options.parser
            }
            console.log(id)
            const opt = {moduleInjectedHelpCode, parser, mixList, refreshHelpCode: hadInjectedHelper};
            const {source} = mixCode(code, opt);
            hadInjectedHelper = true;
            return {
                code: source
            };
        },
        generateBundle(options, bundle, isWrite){
        },
        renderChunk(code, chunk, options){
            if (!moduleInjectedHelpCode){
                return injectHelperCode(code, {mixList, mode: options.format}).source;
            }
            return null;
        },
        renderStart(code, chunk, options){
        }
    };
};