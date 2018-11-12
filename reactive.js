const request=require('request')

class ReactStream{
    constructor(async,call){
        this.async=async
        this.call=call
    }

    map(f,async=false){
        let s=new ReactStream(async)
        this.subscriber=s
        s.transform=f
        s.onSubscribe=this
        return s
    }

    onNext(data){
        if(this.subscriber){
            if(!this.subscriber.async)
                this.subscriber.onNext(this.subscriber.transform(data))
            else{
                this.subscriber.transform(data).then(this.subscriber
                .onNext.bind(this.subscriber))
            }
        }
    }

    execute(arg){
        if(this.onSubscribe){
            this.onSubscribe.execute(arg)
        }else{
            this.call&&this.call(arg)
        }
    }
}

new ReactStream(false,function(arg){
    let that=this
    request(arg,(err,result)=>{that.onNext(result.body)})
}).map((s)=>{return s.length}).map((s)=>{return new Promise((res)=>{setTimeout(()=>{res(s)},1000)})},true)
  .map((s)=>{console.log(s)}).execute('http://www.baidu.com')
