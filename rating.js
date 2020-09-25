module.exports = function(){ 
    var express = require('express');
    var router = express.Router();
    
    function getRating(res, mysql, context, id){
        var sql = "SELECT title, score, explanation, ratingID From Rating_Entry Inner Join Movie on Rating_Entry.movieID=Movie.movieID Where ratingID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rating = results[0];
            console.log(context.rating);
            res.render("update_rating", context);
        });
    }

    router.get('/:ratingID', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updaterating.js"];
        var mysql = req.app.get('mysql');

        getRating(res, mysql, context, req.params.ratingID);
    });


    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body);
        console.log(req.params.id);
        var context = {};
        context.error = [];

        if (req.body.score > 100 || req.body.score < 0 || req.body.score == "" || req.body.explanation == ""){
            console.log("invalid update");
            return res.redirect('rating/' + req.params.id);
        }

        var sql = "UPDATE Rating_Entry SET score=?, explanation = ? WHERE ratingID=?";
        var inserts = [req.body.score, req.body.explanation, req.params.id];
        
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });


    router.delete('/:ratingID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Rating_Entry WHERE ratingID = ?";
        var inserts = [req.params.ratingID];

        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })


    return router;
}();