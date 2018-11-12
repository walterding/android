const request=require('request')

class ReactStream{
    constructor(call){
        this.call=call
    }

    map(f){
        let s=new ReactStream()
        
        this.subscriber=s

        s.transform=f
        s.onSubscribe=this
        return s
    }

    asyncMap(f){
        let s=new ReactStream()
        
        this.subscriber=s
        this.transform=data=>data
        this.onNext=f

        s.onSubscribe=this
        return s
    }

    onNext(data){
        if(this.subscriber)
            this.subscriber.onNext(this.subscriber.transform(data))
    }

    execute(arg){
        if(this.onSubscribe){
            this.onSubscribe.execute(arg)
        }else{
            this.call(arg)
        }
    }
}

new ReactStream(function(arg){
    let that=this
    setTimeout(()=>{
        console.log(arg)
        that.onNext(arg)
    },1000)
}).map((s)=>{return s.length}).asyncMap(function(s){
    let that=this
    setTimeout(()=>{
        that.subscriber.onNext(s+'\tlength')
    },1000)
}).map((s)=>{console.log(s)}).execute('http')
