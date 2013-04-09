module.exports.h_index = 
    function(db) {
        return function(req, res){
            var inout = db.model.inout;
            // 自分自身がすでに入室しているか
            inout.find({ip : req.client.remoteAddress},
                    function(err, docs) {
                        console.log('ip' + req.client.remoteAddress);
                        console.log('data : ' + docs);
                        var param = {};
                        if (docs[0]) {
                            var myId = docs[0].id;
                            param = {id : {$ne : myId}};
                        }
                        // 他人の入室情報の取得1
                        inout.find(param, function(err, odocs) {
                            console.log(odocs);
                            var viewObj = [];
                            if (odocs) {
                                    if (myId) {
                                       viewObj.push({id : myId, ip : req.client.remoteAddress});
                                    }
                                    // view用のオブジェクトを作成
                                    odocs.forEach(function(data) {
                                        var obj = {};
                                        obj.id = data.id;
                                        viewObj.push(obj);
                                    });
                            }
                            console.log(viewObj);
			                res.render('index', {'viewObj' : viewObj});
                        });
                    });

        }

    };
