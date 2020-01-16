const j = require('jscodeshift');
const helpers = require('@babel/helpers');
const { createFilter } = require('@rollup/pluginutils');
const {mixCode, injectHelperCode, generateMixSet, chaosHelperCode} = require('@olaf-mix/olaf-mix');

module.exports = (options = {}) => {
    const filter = createFilter(options.include, options.exclude, {
    });
    const mixSet = generateMixSet(2);
    let hadInjectedHelper = false;
    const moduleInjectedHelpCode = true;
    return {
        name: 'rollup-plugin-olaf-mix',
        load(id){
            hadInjectedHelper = false;
        },
        transform(code, id) {
            if (!filter(id)) return null;
            let parser = /^.*\.tsx?$/.test(id) ? 'ts' : 'js';
            if (options.parser){
                parser = options.parser
            }
            console.log(id)
            const opt = {moduleInjectedHelpCode, parser, refreshHelpCode: true, isFlatInject: true};
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
                return injectHelperCode(code, {mode: options.format}).source;
            } else {
                return chaosHelperCode(code, {mode: options.format}).source
            }
            return null;
        },
        renderStart(code, chunk, options){
        }
    };
};