$(function() {
    // Ajaxで位置情報を最新にする                                               
         $.getJSON('/user/position', function(json){                          
         for (var i = 0,max = json.length; i < max; i++) {
             $('.user[data-id="'+json[i].id+'"]').css({top:parseInt(json[i].top),left:parseInt(json[i].left)});                                                                      
         }                                
    });

});
