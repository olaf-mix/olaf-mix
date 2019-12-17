import { createFilter } from '@rollup/pluginutils';
import j from 'jscodeshift';
const {transformHandler} = require('../src/main');

export default function olafMix (options = {}) {
    const filter = createFilter(options.include, options.exclude, {
    });
    let forceInjected = false;
    return {
        name: 'olaf-mix',
        load(id){
            forceInjected = true;
        },
        transform(code, id) {
            if (!filter(id)) return null;
            const root = j(code);
            transformHandler(root, {forceInjected});
            code = root.toSource({quote: 'single'});
            const result = { code: code };
            return result;
        }
    };
}