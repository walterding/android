
/**
 * Created by hinotohui on 18/10/31.
 */
const request=require('request')

class Promise2{
    constructor(f){
        this.status=0
        f((...a)=>{
            this.status=1
            if(a[0]&&a[0].then){
                if(!this.resolve){
                    this.resolveWrapper=(f)=>{
                        return a[0].then(f)
                    }
                }else{
                   return a[0].then(this.resolve)
                }
            }else{
                if(!this.resolve){
                    this.resolveWrapper=(f)=>{
                        return f&&f(...a)
                    }
                }else{
                    return this.resolve(...a)
                }
            }
        })
    }

    then(resolve,reject){
        return new Promise2((res,rej)=>{
            if(this.status==0){
                this.resolve=(...a)=>{
                    res(resolve(...a))
                }
                this.reject=(...a)=>{
                    rej(reject(...a))
                }
            }else if (this.status==1){
                res(this.resolveWrapper(resolve))
            }else {
                rej(this.rejectWrapper(reject))
            }
        })
    }
}

let a=new Promise2((resolve,reject)=>{
    request('http://www.baidu.com', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            resolve(body)
        }else{
            reject()
        }
    })
}).then((body)=>{
    console.log(body.length)
    return new Promise2((resolve,reject)=>{
        request('http://www.sogou.com', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body)
            }else{
                reject()
            }
        })
    })
}).then((body)=>{
    return body
},()=>{}).then((body)=>{
    return new Promise2((resolve)=>{
        setTimeout(()=>{
            resolve(100)
        },0)
    })
}).then((body)=>{
    console.log(body)
})

setTimeout(()=>{
    a
},2000)

