// import MixManager from './MixManager';
class Bar{
    /* @olaf-mix */
    static mix(){
        console.log('*******-*******');
        const string = '张';
        // console.log('标准: ' + btoa(string));
        // console.log(Bar.btoaUTF16(string));
        // console.log();
        const b = Bar.base64FromString(string);
        // console.log(b)
        // console.log(Bar.b64EncodeUnicode(string));
    }


    static btoaUTF16(sString) {
        var aUTF16CodeUnits = new Uint16Array(sString.length);
        Array.prototype.forEach.call(aUTF16CodeUnits, function (el, idx, arr) { arr[idx] = sString.charCodeAt(idx); });
        return btoa(String.fromCharCode.apply(null, new Uint8Array(aUTF16CodeUnits.buffer)));
        // let bufView = new Uint16Array(str.length);
        // bufView.forEach((_, index, arr) => {
        //     arr[index] = str.charCodeAt(index);
        // });
        // return btoa(String.fromCharCode(new Uint8Array(bufView.buffer)));
    }

    static atobUTF16 (sBase64) {
        var sBinaryString = atob(sBase64), aBinaryView = new Uint8Array(sBinaryString.length);
        Array.prototype.forEach.call(aBinaryView, function (el, idx, arr) { arr[idx] = sBinaryString.charCodeAt(idx); });
        return String.fromCharCode.apply(null, new Uint16Array(aBinaryView.buffer));
    }

    static base64FromString(str) {
        const stringByteLength = str.length;
        let inputBuffer = new ArrayBuffer(stringByteLength);
        let inputBuffer16View = new Uint8Array(inputBuffer);
        for (let i = 0; i < str.length; i++) {
            inputBuffer16View[i] = str.charCodeAt(i);
            // inputBuffer16View[i] = 0x5261;
        }
        console.log(inputBuffer);
        const log = (_) => {
            const r = [];
            for (let i = 0; i < Math.floor(_.length/8); i++){
                let m = '';
                for (let j = 0; j < 8; j++){
                    m += _[i*8+j];
                }
                r.unshift(`${m}`)
            }
            console.log(r.join(' '));
        }

        const reversalByBytes = (input, bytesCount=4) => {
            let output = 0;
            // 字节单位翻转
            for (let j = 0; j < bytesCount; j++){
                const bound = 256 - 1;
                const offset = j*8;
                output = output|(((input&(bound<<offset))>>offset));
                if (j !== bytesCount - 1){
                    output = output << 8;
                }
            }
            return output
        }

        let inputBuffer8View = new Uint8Array(inputBuffer);
        let cacheBuffer = new ArrayBuffer(Math.ceil(inputBuffer.byteLength / 3) * 4);
        let cache32View = new Uint32Array(cacheBuffer);
        let dengyuCount = 3-inputBuffer.byteLength%3;
        console.log(inputBuffer.byteLength)
        for (let i = 0, k = 0; i < inputBuffer8View.byteLength; i += 3, k++) {
            let _buffer = new ArrayBuffer(4);
            let _int8View = new Uint8Array(_buffer);
            for (let j = 0; j < 3; j++) {
                if (i + j < inputBuffer8View.byteLength) {
                    _int8View[j + 1] = inputBuffer8View[i + j];
                } else {
                    _int8View[j + 1] = 0;
                }
            }

            const _int32View = new Uint32Array(_buffer);
            // _int32View[0] = 0x0103070F;
            // _int32View[0] = 97
            _int8View[0] = (_int8View[1]&0xFC)>>2;
            _int8View[1] = ((_int8View[1]&0x03)<<4)^(_int8View[2]>>4);
            _int8View[2] = ((_int8View[2]&0x0F)<<2)^(_int8View[3]>>6);
            _int8View[3] = (_int8View[3]&0x3F);
            // const result = reversalByBytes(p);

            // const t = reversalByBytes(r)

            // console.log(dengyuCount);
            // log(t.toString(2).padStart(32, '0'))
            // console.log(t.toString(2).padStart(32, '0'))
            // 4字节 => 3字节
            // let p = 0;
            // for (let j = 0; j < 4; j++){
            //     if (dengyuCount + j < 4){
            //         const bound = 64 - 1;
            //         const offset = (6*(3-j));
            //         p = p | (((t&(bound<<offset))>>offset));
            //     } else {
            //         p = p | 64
            //     }
            //     if (j !== 4 - 1){
            //         p = p << 8
            //     }
            // }
            // console.log(p.toString(2).padStart(32, '0'))
            // cache32View[k] = reversalByBytes(p);
            cache32View[k] = _int32View[0];
        }

        const base64Map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var outputString = '';
        var outputBuffer8View = new Uint8Array( cacheBuffer );
        for (let i = 0; i < outputBuffer8View.length; i++) {
            if (i < outputBuffer8View.length - dengyuCount){
                outputString += base64Map[outputBuffer8View[i]];
            } else {
                outputString += '='
            }
        }
        console.log(outputString);
        return outputString
        // return Bar.arrayBufferToBase64(arrayBuffer)
    }

    static arrayBufferToBase64( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }

    static b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode(parseInt(p1, 16))
        }))
    }


    static b64DecodeUnicode(str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
    }
}

// function getErrorObject(){
//     try { throw Error('') } catch(err) { return err; }
// }
//
// var err = getErrorObject();
// var caller_line = err.stack.split("\n")[4];
// var index = caller_line.indexOf("at ");
// var clean = caller_line.slice(index+2, caller_line.length);
// console.log(clean)

export {
    Bar,
    // MixManager
};
