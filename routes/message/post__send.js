module.exports.h_send = 
    function(db){
        return function(req, res) {
                res.render('index', { title: 'Express' });
        };
    };
