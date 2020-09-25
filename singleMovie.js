module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getRatingEntries(res, mysql, context, complete, id){
        var sql = "SELECT score, explanation From Rating_Entry Inner Join Movie on Rating_Entry.movieID = ? WHERE Movie.movieID = ?";
        var inserts = [id, id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.rating_entry = results;
            complete();
        });
    }


    function getMovie(res, mysql, context, complete, id){
        var sql = "SELECT director, producer, gross, totalAudiScore, totalCriticScore From Movie WHERE movieID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }

            context.movie = results[0];
            complete();
        });
    }

    function getTitle(res, mysql, context, complete, id){
        var sql = "SELECT title From Movie WHERE movieID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }

            context.title = results[0];
            complete();
        });
    }

    function getCast(res, mysql, context, complete, id){
        var sql = "SELECT actorName From Cast WHERE movieID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }

            context.cast = results[0];
            console.log("results: ", results[0]);
            complete();
        });
    }

    router.get('/', function(req, res){
        var context = {};
        var callbackCount = 0;
        var mysql = req.app.get('mysql');

        getTitle(res, mysql, context, complete, 1);
        getCast(res, mysql, context, complete, 1);
        getMovie(res, mysql, context, complete, 1);
        getRatingEntries(res, mysql, context, complete, 1);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                console.log("context: ", context);
                res.render('singleMovie', context);
            }

        }

    });

    return router;
}();
