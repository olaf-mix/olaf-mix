// import MixManager from './MixManager';
class Bar{
    /* @olaf-mix */
    static mix(){
        console.log('*******-*******');
        const string = 'jsasa';
        console.log(Bar.base64FromLetter(string));
    }

    static base64FromLetter(letter) {
        const stringByteLength = letter.length;
        let inputBuffer = new ArrayBuffer(stringByteLength);
        let inputBuffer16View = new Uint8Array(inputBuffer);
        for (let i = 0; i < letter.length; i++) {
            inputBuffer16View[i] = letter.charCodeAt(i);
        }

        let inputBuffer8View = new Uint8Array(inputBuffer);
        let cacheBuffer = new ArrayBuffer(Math.ceil(inputBuffer.byteLength / 3) * 4);
        let cache32View = new Uint32Array(cacheBuffer);

        for (let i = 0, k = 0; i < inputBuffer8View.byteLength; i += 3, k++) {
            const buffer = new ArrayBuffer(4);
            const buffer8View = new Uint8Array(buffer);
            for (let j = 0; j < 3; j++) {
                if (i + j < inputBuffer8View.byteLength) {
                    buffer8View[j + 1] = inputBuffer8View[i + j];
                } else {
                    buffer8View[j + 1] = 0;
                }
            }
            const buffer32View = new Uint32Array(buffer);
            buffer8View[0] = (buffer8View[1]&0xFC)>>2;
            buffer8View[1] = ((buffer8View[1]&0x03)<<4)^(buffer8View[2]>>4);
            buffer8View[2] = ((buffer8View[2]&0x0F)<<2)^(buffer8View[3]>>6);
            buffer8View[3] = (buffer8View[3]&0x3F);
            cache32View[k] = buffer32View[0];
        }
        const base64Map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let outputString = '';
        let outputBuffer8View = new Uint8Array(cacheBuffer);
        const equalCount = inputBuffer.byteLength%3 === 0 ?0:3-(inputBuffer.byteLength%3);
        for (let i = 0; i < outputBuffer8View.length; i++) {
            if (i < outputBuffer8View.length - equalCount){
                outputString += base64Map[outputBuffer8View[i]];
            } else {
                outputString += '='
            }
        }

        return outputString
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

export {
    Bar,
    // MixManager
};
