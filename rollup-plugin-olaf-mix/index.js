import { createFilter } from '@rollup/pluginutils';
import j from 'jscodeshift';
const {transformHandler} = require('../src/main');

export default function olafMix (options = {}) {
    const filter = createFilter(options.include, options.exclude, {
    });
    return {
        name: 'olaf-mix',
        transform(code, id) {
            if (!filter(id)) return null;
            console.log(id)
            const root = j(code);
            transformHandler(root);
            code = root.toSource();
            const result = { code: code };
            return result;
        }
    };
}