function SyncList() {
    this.sync = [];
    this._args = [];
    this._start = false;
    this._length = 0;
    this._alreadyLength = 0;
}

SyncList.prototype.push = function (sync,args) {
    //将cb推入队列
    if (sync instanceof Array) {
        //数组形式
        this._length += sync.length;

        this.sync = this.sync.concat([].slice.call(sync));
        this._args = this._args.concat([].slice.call(args));
    } else {
        //普通参数形式
        let args = [].slice.call(arguments);
        args.shift();

        this._length++;

        this.sync.push(sync);
        this._args.push(args);
    }

    var len = sync instanceof Array ? sync.length : 1;

    if (this.sync.length === len //在加入前所有队列cb已执行完毕或是第一次加入
        && this._start //判断是否在执行
        && this._length === this._alreadyLength + len//判断前一个函数是否执行完毕
    ) {
        //执行队列的第一个cb
        var cb = this.sync.shift();

        var arg = [].concat(this._args.shift());
        cb.apply(this,arg);
    }
    return this;
};

SyncList.prototype.start = function () {
    this._start = true;
    if (this.sync.length > 0) {
        //执行队列的第一个cb
        var sync = this.sync.shift();

        var arg = [].concat(this._args.shift());
        sync.apply(this,arg);
    }
    return this;
};

SyncList.prototype.end = function () {
    this._start = false;
    return this;
};

SyncList.prototype.next = function () {
    this._alreadyLength++;
    if (this._alreadyLength > this._length) throw new Error('在一个异步函数中调用了多次next');
    if (this.sync.length > 0 && this._start) {
        var sync = this.sync.shift();

        var arg = [].concat(this._args.shift());
        sync.apply(this,arg);
    }
    return this;
};

exports.SyncList = SyncList;