/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , glob = require('glob');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8888);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

/**
 * mongoDB
 * db objectの作成する
 */
// mongoDBのコネクション取得
var mongoose = require("mongoose");
var con = mongoose.connect('mongodb:/**************');
// スキーマを定義
var messagesSchema = new mongoose.Schema({
     id : {type:String},
	 message : {type:String}
});
var inoutSchema = new mongoose.Schema({
	 id : {type:String},
	 ip : {type:String},
     top : {type:String},
     left : {type:String},
	 date : {type:Date, default : Date.now}
});
// モデルの取得
var Messages = con.model('messages', messagesSchema);
var InOut = con.model('in_out_logs', inoutSchema);
// DBオブジェクトの作成
var db = {'model' :
            {'messages' : Messages,
			 'inout' : InOut
			},
         };

app.configure('development', function(){
  app.use(express.errorHandler());
});

/**
 * リクエストハンドラの設定
 * handle設定後
 * モデル,サーバ,socket.ioの準備・実行を行う
 */
glob('routes/**/*.js', null, function(err, files) {
	for (var i = 0,max = files.length; i < max; i++) {
		var pathList = files[i].split('/')
		var handlePath = '';
		// indexの場合だけ特別
		if (pathList[1] === 'index') {
			handlePath = '/'	
		} else {
			handlePath = files[i].replace(/post__|get__|.js|routes/g, '');
		}

		var fileName = pathList[pathList.length - 1];
		var type = fileName.match(/(^.+__)/)[0].replace(/__/, ''); 
		fileName = fileName.replace(/^.+__|.js/g, '');
		console.log('handlePath : ' + handlePath);
		console.log('fileName : ' + fileName);
		console.log('type : ' + type);
		var handle = require('./' + files[i].replace(/.js/, ''));
		app[type](handlePath, handle['h_' + fileName](db));
	}
	
	/**
	 * server
	 */
	var server = http.createServer(app);
	
	/**
	 *socket.io
	 */
	var io = require('socket.io');
	io = io.listen(server);
	io.sockets.on('connection', function(socket) {
		// 入退室ロジック
		var InOut = require('./logic/inout');
		var inout = InOut.inout(db, socket);
		// 発言ロジック
		var messageLogic = require('./logic/message').getMessageLogic(db, socket);
		
    	socket.on('user in', function() {
			console.log('user in ');
			var address = socket.handshake.address;
			console.log('ip', address.address);
			var date = new Date().toString();
			console.log('date', date);
			// 入室処理
			inout.fin({'ip' : address});
    	});

        socket.on('user logout', function(data) {
            console.log('logout');
            console.log(data);
            // 退室処理
            inout.out(data);
        });
		
		// なめこの移動
		socket.on('user position', function(data) {
			console.log('data : ', data);
			socket.broadcast.emit('user move', data);
		});
		
		// 発言
		socket.on('send msg', function(data) {
			console.log('data : ', data);
			messageLogic.send(data);
			socket.broadcast.emit('send msg all', data);
		});

        socket.on('find all position', function() {
            console.log('find all position');
            socket.emit('get all position');
            socket.broadcast.emit('get all position');
        });

        socket.on('send position', function(data) {
            console.log('send position');
            console.log(data);
            inout.updatePosition(data);
        });

        socket.on('change img', function(data) {
            console.log(data);
            socket.broadcast.emit('change user img', data);             
        });
		
	});
	
	// サーバの起動
	server.listen(8888);
	
});

