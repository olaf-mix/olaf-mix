'use strict';

jest.autoMockOff();
const defineTest = require('../testUtils').defineTest;
const defineInlineTest = require('../testUtils').defineInlineTest;
const transform = require('../mix-code');

defineTest(__dirname, 'mix-code');

// defineTest(__dirname, 'mix-code', null, 'typescript/mix-code', { parser: 'ts' });

describe('mix-code', () => {
    defineInlineTest(transform, {}, `
var firstWord = 'Hello ';
var secondWord = 'world';
var message = firstWord + secondWord;`,`
var droWtsrif = 'Hello ';
var droWdnoces = 'world';
var egassem = droWtsrif + droWdnoces;
  `);
    defineInlineTest(transform, {},
        'function aFunction() {};',
        'function noitcnuFa() {};',
        'Reverses function names'
    );
});