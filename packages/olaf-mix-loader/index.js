const j = require('jscodeshift');
const path = require('path');
const fs = require('fs');
const {mixCode} = require('@olaf-mix/olaf-mix');
const {getOptions} = require('loader-utils');

function OlafMixLoader(source) {
    const options = getOptions(this) || {};
    let parser = /^.*\.tsx?$/.test(this.resourcePath) ? 'ts' : 'js';
    if (options.parser){
        parser = options.parser
    }
    return mixCode(source, {refreshHelpCode: true, parser}).source;
}

module.exports = OlafMixLoader;
