module.exports.getMessageLogic = 
    function(db, socket) {
		
		function send(data) {
			console.log('data', data);
			// DBに保存
			var messages = new db.model.messages({'id' : data.id, 'message' : data.msg});
			messages.save(function(err){
				if (err) {
				}
				console.log('発言ログを登録しました');
			});
			
		}
		
        return {'send' : send}
    };
	

