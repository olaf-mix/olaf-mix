'use strict';
// import './tmp.ts';

const a = {
    /* @olaf-mix*/
    viewFillData() {
        console.log('aaa')
    },
};

a.viewFillData()

/**
 * @olaf-mix asd
 */
function base64FromLetter(letter) {
    const a: any = {};
    return a.b.c.d.e.f('account');
}

/**
 * 数字工具类
 */
class Bar{

    /**
     * @olaf-mix
     */
    static test(){
        const a = {
            k: 'asd'
        };
        const b = 'k';
        console.log(a[b]);
    }

    /**
     * 整数补0
     * @param number 整数
     * @param length 最终的长度
     * @returns 整数字符串
     */
    static makeNumber(number: number, length: number): string {
        return String(number).padStart(length, String(0));
    }

    /**
     * @olaf-mix
     */
    static getAccount(){
        const a: any = {};
        return a.b.c.d.e.f('account');
    }


    static makeProperty(){
        console.log('I want jump')
        const a = {
            whatTypeDoing: null
        }
        /**
         * @ola1f-mix
         */
        a.whatTypeDoing = function (_, dateDoing, strDoing, numDoing, otherDoing) {
            if (typeof (_) === 'string') {
                strDoing();
            }
            if (typeof (_) === 'number') {
                numDoing();
            }
            if (_ instanceof Date) {
                dateDoing();
            }
            if (otherDoing) {
                otherDoing();
            }
        };
    }
}
export default Bar;
