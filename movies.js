module.exports = function(){ 
    var express = require('express');
    var router = express.Router();

    function getMovies(res, mysql, context, complete)
    {    var sql = "SELECT title, movieID From Movie";
         mysql.pool.query(sql, function(error, results, fields)
         {
             if(error)
             {
                res.write(JSON.stringify(error));
                res.end();
             }
             context.movie = results;
             
             console.log("results: ", results[0]);
             console.log("results: ", results[1]);
             complete();
         });
    }

    router.get('/', function(req, res)
    {
        var context = {};
        var callbackCount = 0;
        var mysql = req.app.get('mysql');

        getMovies(res, mysql, context, complete);
        function complete()
        {
            callbackCount++;
            if(callbackCount >= 1)
            {
                console.log("context: ", context);
                res.render('movies', context);
            }

        }
    });

    return router;

}();