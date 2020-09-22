const UglifyJS = require('uglify-js');
const path = require('path');
const fs = require('fs');
const j = require('jscodeshift');
const { exec } = require('child_process');
const transformFilePath = path.resolve( '..', 'mix-code.js');
const targetFilePath = path.resolve('..', '__testfixtures__', 'variable-name.input.js');
// const targetFilePath = path.resolve('..', '..', 'dist', 'app.input.js');
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

// const target_path = path.resolve(__dirname, '..', 'dist');
// const app_code = fs.readFileSync(path.resolve(target_path, 'index.js'), {encoding: 'utf8'})
// var {error, code} = UglifyJS.minify(app_code);
// if (error){
//     console.log(error);
// } else {
//     fs.writeFile(path.resolve(target_path, 'index.min.js'), code, (err) => {
//         if (err) {
//             console.log(err)
//             throw err
//         }
//         console.log('The file has been saved!');
//     });
// }
