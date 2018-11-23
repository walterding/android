
/**
 * Created by hinotohui on 18/10/31.
 */
const request=require('request')

class Promise2{
    constructor(f){
        this.status=0
        f((...a)=>{
            this.status=1
            process.nextTick(()=>{
                if(a[0]&&a[0].then){
                    a[0].then((...b)=>{
                        if(!this.resolve){
                            this.resoleWrapper=(f)=>{
                                return f&&f(...b)
                            }
                        }else{
                            return this.resolve(...b)
                        }
                    })
                }else{
                    if(!this.resolve){
                        this.resoleWrapper=(f)=>{
                            return f&&f(...a)
                        }
                    }else{
                        return this.resolve(...a)
                    }
                }

            })
        },(...a)=>{
            this.status=2
            process.nextTick(()=>{
                if(a[0].then){
                    a[0].then(null,(...a)=>{
                        if(!this.reject){
                            this.rejectWrapper=(f)=>{
                                return f&&f(...a)
                            }
                        }else{
                            return this.reject(...a)
                        }
                    })
                }else{
                    if(!this.reject){
                        this.rejectWrapper=(f)=>{
                            return f&&f(...a)
                        }
                    }else{
                        return this.reject(...a)
                    }
                }
            })
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
                res(this.resoleWrapper(resolve))
            }else {
                rej(this.rejectWrapper(reject))
            }
        })
    }
}

new Promise2((resolve,reject)=>{
    request('http://www.baidu.com', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            resolve(body)
        }else{
            reject()
        }
    })
}).then((body)=>{return body},()=>{}).then((body)=>{return new Promise2(
    (res)=>{
        setTimeout(()=>{
            res(body)
        },1000)
    }
)}).then((body)=>{
    return new Promise2((resolve,reject)=>{
        request('http://www.sogou.com', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body)
            }else{

            }
        })
    })
}).then((body)=>{
    console.log(body)
})

