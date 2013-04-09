$(function() {

        var socket = io.connect('http://www15411ue.sakura.ne.jp:8888/');
        var myId;
        var clickFlag = false;

        $('.user[data-ip*="."]').draggable({'enable' : true, 'drag' : dragUser});
        var myId = $('.user[data-ip*="."]').attr('data-id');

        socket.on('get all position', function() {
            var id = $('.user[data-ip*="."]').attr('data-id');
            var position = $('.user[data-ip*="."]').position();
            socket.emit('send position', {id : id, position : position});
            });

        socket.emit('find all position');

        if (myId) {
            $('.user[data-id="'+myId+'"] h2').click(function() {
                if (!clickFlag) {
                $(this).css('background-image', 'url(../img/nameko03.gif)');
                socket.emit('change img', {id : myId, img : '../img/nameko03.gif'});
                clickFlag = true;
                } else {
                $(this).css('background-image', 'url(../img/nameko_02.png)');
                socket.emit('change img', {id : myId, img : '../img/nameko_02.png'});
                clickFlag = false;
                }
                
            });
        }

        // 入室
        $('#send_in').click(function() {
                socket.emit('user in', {});
                });

        $('#logout').click(function() {
                socket.emit('user logout', {id : myId});
                });

        // 発言
        $('#send_msg').click(function() {
                var msg = $('#msg').val();
                socket.emit('send msg', {'id' : myId, 'msg' : msg});
                $('.user[data-id="'+myId+'"] p').text(msg);
                $('#msg').val('');
                });


        /*
         * socket.ioのイベントハンドラ
         */

        // 入室OK 
        socket.on('user in ok', function (data) {
                $('#main_content').append('<div class="user" data-id="'+ data.id +'" data-ip="'+ data.ip +'"><h2><p>なめこ</p></h2><p></p></div>');
                $('.user[data-id="'+data.id+'"]').draggable({'enable' : true, 'drag' : dragUser, 'zIndex' : data.count});
                myId = data.id;
                $('#send_in').hide();
                $('#send').show();
                $('.user[data-id="'+data.id+'"] h2').click(function() {         
                    $(this).css('background-image', 'url(../img/nameko03.gif)');
                    socket.emit('change img', {id : myId, img : '../img/nameko03.gif'});
                    });

                $('.user[data-id="'+data.id+'"] h2').dblclick(function() {
                    $(this).css('background-image', 'url(../img/nameko_02.png)');
                    socket.emit('change img', {id : myId, img : '../img/nameko_02.png'});
                    });      
                });

        // 他人の入室
        socket.on('user in all', function (data) {
                $('#main_content').append('<div class="user" data-id="'+ data.id +'"><h2><p>なめこ</p></h2><p></p></div>');
                $('.user[data-id="'+data.id+'"]').css({top:'0px',left:'0px', zIndex : data.count});
                });

        socket.on('user logout ok', function(data) {
                $('.user[data-id="'+data.id+'"]').remove();
                $('#send_in').show();
                $('#send').hide();
                });

        socket.on('user logout all', function(data) {
                $('.user[data-id="'+data.id+'"]').remove();
                });

        // 他人のなめこの移動
        socket.on('user move', function (data) {
                var position = data.position;
                $('.user[data-id="'+data.id+'"]').css({top:position.top,left:position.left});
                });

        // 他人の発言
        socket.on('send msg all', function (data) {
                $('.user[data-id="'+data.id+'"] p').text(data.msg);
                });

        socket.on('change user img', function(data) {
                $('.user[data-id="'+data.id+'"] h2').css('background-image', 'url('+data.img+')');             
                    });

                // なめこを移動
                function dragUser(e, data) {
                var id = $(e.target).attr('data-id');
                socket.emit('user position', {'position' : data.position, 'id' : id});
                }

                });
