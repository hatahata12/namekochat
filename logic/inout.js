module.exports.inout = 
    function(db, socket) {
		/**
		 * 入室ロジック
		 */
		function fin(data) {
			var crypt = require('crypto');
			var algorithm = 'sha256';  
   			var id = crypt.createHash(algorithm).update(String(new Date().getTime())).digest('hex');
			console.log('id', id);
			// DBに保存
			var inout = new db.model.inout({'id' : id, 'ip' : data.ip.address});
			inout.save(function(err){
				if (err) {
				}
                db.model.inout.count({}, function(err, count) {
				    console.log('入室ログに登録しました', count);
				    socket.emit('user in ok', {'id': id, count : count, ip : data.ip.address});
				    socket.broadcast.emit('user in all', {'id': id, count : count});
                });
			});
			
		}
		/**
		 * 退室ロジック
		 */
		function out(data) {
            var inout = db.model.inout;
            inout.remove({'id' : data.id}, function(err){
                console.log('退室しました');
                socket.emit('user logout ok', {id : data.id});
                socket.broadcast.emit('user logout all', {id : data.id});               
            });
		}

        function updatePosition(data) {
            console.log('update position');
            console.log(data);
            var inout = db.model.inout;
            if (!data.position) {
                    return;
            }
            inout.update({id : data.id},{$set : {'top' : data.position.top, 'left' : data.position.left}}, false, true, function(err){
                            
                            });
        }
		
        return {'fin' : fin,'out' : out, updatePosition : updatePosition}
    };
	

