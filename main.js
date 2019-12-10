const UglifyJS = require('uglify-js');
const path = require('path');
const fs = require('fs');
const j = require('jscodeshift');

const { exec } = require('child_process');
const transformFilePath = path.resolve( '..', 'mix-code.js');
const targetFilePath = path.resolve('..', '__testfixtures__', 'function-calle.input.js');
exec(`export RUN_MODE=debug && ${path.resolve('..', '..', 'node_modules', '.bin', 'jscodeshift')}  -t ${transformFilePath} ${targetFilePath} --dry`, (err, stdout, stderr) => {
    if (err) {
        // node couldn't execute the command
        console.log(err)
        return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    if(stderr) console.log(`stderr: ${stderr}`);
});
