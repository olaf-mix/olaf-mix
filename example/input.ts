'use strict';

/**
 * 数字工具类
 */
class Bar {
    /**
     * @olaf-mix
     * 整数补0
     * @param number 整数
     * @param length 最终的长度
     * @returns 整数字符串
     */
    static makeNumber(number: number, length: number): string {
        return String(number).padStart(length, String(0));
    }

    static makeProperty(){
        console.log('I want jump')
        const a = {
            whatTypeDoing: null
        }
        /**
         * @olaf-mix
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
