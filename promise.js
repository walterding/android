/**
 * Created by hinotohui on 18/10/31.
 */
const request=require('request')

class Promise2{
    constructor(f){
        this.status=0

        f((...a)=>{
            this.status=1
            setTimeout(()=>{
                if(!this.resolve){
                    this.resoleWrapper=(f)=>{
                        f&&f(...a)
                    }
                }else{
                    this.resolve(...a)
                }
            },0)
        },(...a)=>{
            this.status=2
            setTimeout(()=>{
                if(!this.reject){
                    this.rejectWrapper=(f)=>{
                        f&&f(...a)
                    }
                }else{
                    this.reject(...a)
                }
            },0)
        })
    }

    then(resolve,reject){
        if(this.status==0){
            this.resolve=resolve
            this.reject=reject
        }else if (this.status==1){
            this.resoleWrapper(resolve)
        }else {
            this.rejectWrapper(reject)
        }
    }
}

/*
new Promise2((resolve,reject)=>{
    setTimeout(()=>{
        console.log(1)
        resolve()
        console.log(2)
    },0)
}).then(()=>{setTimeout(()=>{console.log(3)},1000)},()=>{console.log(-3)})
*/


new Promise2((resolve,reject)=>{
    request('http://www.baidu.com', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            resolve(body)
        }else{
            reject()
        }
    })
}).then((body)=>{console.log(body)},()=>{})
