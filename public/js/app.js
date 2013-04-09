/**
 * アプリケーションルート
 *  
 */
requirejs.config({
    shim: {
        "vendor/jquery-1.9.0.min": {
            exports: "jQuery"
        },
        "vendor/underscore": {
            exports: "_"
        },
        "vendor/backbone": {
            deps: ["vendor/jquery-1.9.0.min", "vendor/underscore"],
            exports: "Backbone"
        }
    }
});

require(["router"], function(router) {

    window.App = new router.AppRouter();
    Backbone.history.start();
    

});