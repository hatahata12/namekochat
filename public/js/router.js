/**
 * ルータ関数
 *  
 */
define(["vendor/underscore", "vendor/backbone","views"], function(_, Backbone, views) {

    var AppRouter = Backbone.Router.extend({
       routes : {
          "xxx" : "index"
       },
       index: function(){

       }
    });

    return {"AppRouter" : AppRouter};

});