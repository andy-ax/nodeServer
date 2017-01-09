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