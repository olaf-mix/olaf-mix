import md5 from 'MD5';
import ChaosManager from './ChaosManager';

class MixManager{
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
}

export default MixManager;
