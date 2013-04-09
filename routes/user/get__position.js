module.exports.h_position = 
    function(db) {
        return function(req, res){
            var inout = db.model.inout;
            inout.find({}, function(err, docs) {
                res.contentType('application/json');
                if (!docs) {
                    res.send({});
                }
                var json = JSON.stringify(docs);
                res.send(json);
            });
        }
    }
