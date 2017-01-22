function SyncList() {
    // this.sync = [];
    // this._args = [];
    // this._scope = [];
    this.queue = [];
    this._start = false;
    this._length = 0;
    this._alreadyLength = 0;
}

SyncList.prototype.push = function (sync,scope,args) {
    //将cb推入队列
    if (sync instanceof Array) {
        //数组形式
        this._length += sync.length;

        sync.forEach(function (val, i) {
            this.queue.push({
                sync: sync[i],
                args: args[i],
                scope: scope[i]
            });
        },this);
    } else {
        //普通参数形式
        var _args = [].slice.call(arguments);
        _args.shift();
        _args.shift();

        this._length++;

        _args = _args || [];
        scope = scope || null;

        this.queue.push({
            sync: sync,
            args: _args,
            scope: scope
        });
    }

    var len = sync instanceof Array ? sync.length : 1;

    if (this.queue.length === len //在加入前所有队列cb已执行完毕或是第一次加入
        && this._start //判断是否在执行
        && this._length === this._alreadyLength + len//判断前一个函数是否执行完毕
    ) {
        //执行队列的第一个cb
        var obj = this.queue.shift();
        var cb = obj.sync;

        var arg = [].concat(obj.args.shift());
        cb.apply(obj.scope,arg);
    }
    return this;
};

SyncList.prototype.start = function () {
    this._start = true;
    if (this.queue.length > 0) {
        //执行队列的第一个cb
        var obj = this.queue.shift(),
            cb = obj.sync,
            scope = obj.scope,
            args = obj.args;

        cb.apply(scope,args);
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
    if (this.queue.length > 0 && this._start) {
        var obj = this.queue.shift(),
            cb = obj.sync,
            scope = obj.scope,
            args = obj.args;

        cb.apply(scope,args);
    }
    return this;
};

exports.SyncList = SyncList;