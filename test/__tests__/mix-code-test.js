'use strict';
const fs = require('fs'), path = require('path');
const {mixCode} = require('../../src/index');

// 示例： https://github.com/facebook/jscodeshift/tree/master/sample
// jest.autoMockOff();
// const defineTest = require('../testUtils').defineTest;
// defineTest(__dirname, 'mix-code');

const test_dir_path = path.resolve(__dirname, '..', '__testfixtures__');
const file_list = fs.readdirSync(test_dir_path);
for (let file_name of file_list){
    if (/.input/.test(file_name)) {
        let output_path = path.resolve(test_dir_path, file_name.replace('input', 'output'))
        fs.writeFileSync(
            path.resolve(output_path),
            mixCode(fs.readFileSync(path.resolve(test_dir_path, file_name), 'utf8')).source
        );
        const relative_path = path.relative(__dirname, output_path);
        const output_module = require(relative_path)
        if (output_module.TEST){
            test(`${file_name.replace(/.input.js/)}`, () => {
                expect(output_module.TEST()).toBe(true);
            })
        }
    }
}

