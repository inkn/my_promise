const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise {
    constructor(executor) {
        this.init();
        try {
            executor(this.resolve,this.reject);
        }catch(err) {
            this.reject(err);
        }
    }

    init() {
        this.state = PENDING;
        this.value = null;
        this.reason = null;
        this.resolve = this.resolve.bind(this); 
        this.reject = this.reject.bind(this); 
        this.resolveCallbacks = [];
        this.rejectCallbacks = [];
    }
    resolve(value) {
        if(this.state !== PENDING) {
            return;
        }
        this.value = value;
        this.state = FULFILLED;
        this.resolveCallbacks.forEach(resolveCallback => resolveCallback(this.value));
    }
    reject(reason) {
        if(this.state !== PENDING) {
            return;
        }
        this.reason = reason;
        this.state = REJECTED;
        this.rejectCallbacks.forEach(rejectCallback => rejectCallback(this.reason));
    }
    then(onFulfilled,onRejected) {
        const resolveCallback = isFun(onFulfilled) ? onFulfilled : value => value;
        const rejectCallback = isFun(onRejected) ? onRejected : reason => {throw reason};
        switch(this.state) {
            case PENDING: {
                this.resolveCallbacks.push(resolveCallback);
                this.rejectCallbacks.push(rejectCallback);
                break;
            }
            case FULFILLED: {
                resolveCallback(this.value);
                break;
            }
            case REJECTED: {
                rejectCallback(this.reason);
                break;
            }
        }
    }
}

function isFun(fn) {
    return typeof fn === 'function';
}


new Promise((resolve, reject) => {
    setTimeout(() => {
        // resolve(111); 
        reject(222); 
    }, 1000);
}).then(value => {
    console.log('成功：' + value);
}, reason => {
    console.log('失败：' + reason);
})