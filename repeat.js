function print(c) {
    return function () {
        console.log(c)
    }
}

let space=print('*')

function repeat(f) {
    return function () {
        f()
        return repeat(f)
    }
}

function take(n,f) {
    if(n==0)
        return
    take(n-1,f())
}

take(7,repeat(space))
