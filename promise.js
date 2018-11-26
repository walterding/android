
/**
 * Created by hinotohui on 18/10/31.
 */
const request=require('request')

class Promise2{
    constructor(f){
        this.status=0

        f((...a)=>{
            this.status=1
            if(!this.resolve){
                this.resolveWrapper=(f)=>{
                    return f&&f(...a)
                }
            }else{
                return this.resolve(...a)
            }
        })
    }

    then(resolve){
        return new Promise2((res)=>{
            if(this.status==0){
                this.resolve=(...a)=>{
                    let result=resolve(...a)
                    if(result&&result.then){
                        result.then(res)
                    }else{
                        res(result)
                    }
                }
            }else{
                let result=this.resolveWrapper(resolve)
                if(result&&result.then){
                    result.then(res)
                }else{
                    res(result)
                }
            }
        })
    }
}

let a=new Promise2((resolve)=>{
    setTimeout(()=>{
        resolve(100)
    },1000)
}).then((body)=>{
    return body
})
a.then((body)=>{
    return new Promise2((resolve)=>{
        return request('http://www.baidu.com',(err,html)=>{
            resolve( html.body)
        })
    })
}).then((body)=>{
    console.log(body)
    return body.length+'aaa'
}).then((body)=>{
    return new Promise2((resolve)=>{
        console.log('123')
        setTimeout(()=>{
            resolve(body)
        },1500)
    })
}).then((body)=>{
    console.log(body)
})
