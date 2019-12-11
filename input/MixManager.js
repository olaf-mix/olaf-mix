import md5 from 'MD5';
import ChaosManager from './ChaosManager';


class MixManager{
    /** @olaf-mix **/
    static getOlafCode(params, timestamp){
        return Promise.resolve(_ => new Promise((resolve) => {
            ChaosManager.chao();
            let olafCode = '';
            let paramList = [];
            for (let k in params){
                if (params.hasOwnProperty(k)){
                    paramList.push({
                        k,
                        v: params[k]
                    })
                }
            }
            paramList.sort((a, b) => a.k.localeCompare(b.k))
            const sign = md5(paramList.map(_ => `${_.k}=${String(_.v)}`).join('&'));
            olafCode = [...paramList, {k: 'sign', v: sign}].map(_ => `${_.k}=${String(_.v)}`).join('&');
            setTimeout(resolve(olafCode), 1)
        })).then(_ => _())
    }

    /** @olaf-mix 666 **/
    static mix(){
        const a = 50
        const b = this.jump(64);
        const d = console.log('aaaa');
        const c = b;

        this.jump(64)
        // window.location.href = 'asd'
        console.log('123')
    }

    /** @olaf-mix as **/
    static jump(){
        console.log(window.location.href);
    }

    /** @olaf-mix **/
    static feed(){
        console.log(window.location.href);
    }
}

export default MixManager;
