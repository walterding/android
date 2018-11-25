
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

    then(resolve){
        return new Promise2((res)=>{
            if(this.status==0){
                this.resolve=(...a)=>{
                    res(resolve(...a))
                }
            }else{
                res(this.resolveWrapper(resolve))
            }
        })
    }
}

new Promise2((resolve)=>{
    resolve(100)
}).then((body)=>{return body}).then((body)=>{
    return new Promise2((resolve)=>{
        setTimeout(()=>{
           resolve(body+200)
        },500)

    }).then((body)=>{console.log(body)})
})
