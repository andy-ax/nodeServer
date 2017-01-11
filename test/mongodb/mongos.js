var init = function () {
    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost',27017,{auto_reconnect:true});
    var db = new mongodb.Db('mydb',server,{safe:true});
    db.open(function(err,db){
        if(!err)
        {
            db.createCollection('mycoll', {}, function (err, collection) {
                if (err) {
                    console.error(err);
                } else {
                    //新增数据
                    var tmp1 = {id:1,title:'hello',number:1};
                    collection.insert(tmp1,{}, function (err, result) {
                        console.log('end');
                    });
                    //更新数据
                    collection.update({title:'hello'},{$set: {number: 3}},{},function (err, result) {
                        console.log("update success");
                    });
                    //查询数据
                    collection.find().toArray(function (err, docs) {
                        console.log('find all');
                        console.log(docs);
                    });
                    collection.findOne(function (err, doc) {
                        console.log('find one');
                        console.log(doc);
                    });
                    //删除数据
                    collection.remove({title:'hello'},{},function (err, result) {
                        console.log('remove');
                        console.log(result);
                    });
                }
            });
            //删除 collection
            db.dropCollection('mycoll',{},function (err, result) {
                if (err) {
                    console.log('err');
                    console.log(err);
                } else {
                    console.log('result');
                    console.log(result);
                }
            })
        }else{
            console.error(err);
        }
    });
};

var init2 = function () {
    var mongoose = require('mongoose');

    //连接数据库
    var dbURL = 'mongodb://localhost/my_database';
    mongoose.connect(dbURL);

    //定义模式
    var UserSchema = new mongoose.Schema({
        username: String,
        friend: String,
        msg: String
    });

    //定义模型
    var User = mongoose.model('User', UserSchema);

    //使用用户模型加载用户路由中间件
    function loadUser(req, res, next) {
        User.findOne({username:req.params.name}, function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.send('Not found', 404);
            }
            req.user = user;
            next();
        })
    }
    /*
     * mongodb初始化数据
     * model = new Model({data});
     * 插入
     * model.save(callback);
     *
     * 另一种初始化与保存方式
     * Model.create({data},callback(err,small))
     */

    function save1() {
        var user = new User({
            username: 'andy',
            friend: 'andy mars',
            msg: '1234567'
        });
        user.save(function (err, data, raw) {

        });
    }
    function save2(data) {
        User.create(data,function (err, data) {

        });
    }
    // save2({
    //     username: 'andy',
    //     friend: 'mars',
    //     msg: '1'
    // });
    // save2({
    //     username: 'andy',
    //     friend: 'paul',
    //     msg: '2'
    // });
    // save2({
    //     username: 'andy',
    //     friend: 'joan',
    //     msg: '3'
    // });
    // save2({
    //     username: 'andy',
    //     friend: 'david',
    //     msg: '4'
    // });

    /*
     * mongodb数据查找
     * Model.find([查询索引], [回调])
     * Model.findOne([查询索引], [回调])
     */
    /*
     * 查询排序result.sort([排序索引]).exec([callback]);
     * 1->正序 -1->倒序
     */
    /*
     * 查询部分结果
     * .limit(number) 查询一部分数据
     */

    function find() {
        User.find({username:'andy'}).sort('msg').limit(2).exec(function (err, datas) {
            console.log(datas);
        })
    }

    /*
     * 移除数据
     * Model.remove({data},callback(err));
     */
    function remove() {
        User.remove({username:'andy'}).exec(function (err, user) {

        })
    }

    /*
     * 更新数据
     * Model.update(查询条件,更新对象{$set: {更新的部分}},option,callback(err,numberAffected,raw));
     * 更新对象是数据的全部，如果只更新部分，可以使用set更新部分\
     * numberAffected -> {n:number总数, nModified:number修改的数量, ok:number成功的数量}
     *
     * 更新并获取要更新的对象
     * findOneAndUpdate
     */
    function update() {
        User.update({friend:'mars'},{$set: {msg: 'hello!'}},function (err, numberAffected) {
            console.log(numberAffected);
        });
        User.find({friend:'mars'}).exec(function (err, datas) {
            console.log(arguments);
        })
    }
    update();
};

init2();