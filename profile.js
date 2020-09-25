module.exports = function(){ 
    var express = require('express');
    var router = express.Router();



    function getRatingEntries(res, mysql, context, complete, id){
        var sql = "SELECT title, score, explanation, ratingID From Rating_Entry Inner Join Movie on Rating_Entry.movieID=Movie.movieID WHERE account_ID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.rating_entry = results;
            complete();
        });
    }

    function getRating(res, mysql, context, id){
            var sql = "SELECT title, score, explanation, ratingID From Rating_Entry Inner Join Movie on Rating_Entry.movieID=Movie.movieID Where ratingID = ?";
            var inserts = [id];
            mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rating = results[0];
            console.log("got rating: " + context.rating);
            res.render("update_rating", context);
        });
    }

    function getUsername(res,mysql,context, complete , id){
        var sql = "SELECT username, company From Account a INNER JOIN Member m on a.account_ID=m.account_ID Where a.account_ID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
            
            context.username = results[0];
            if (results[0].company == null){
                console.log("IS MEMBER");
                context.status = "Member";
            }
            else{
                console.log("IS Critics");
                context.status = "Critic";
            }

            complete();
        });
    }

    router.get('/', function(req, res){
        currAccount = req.session.username;
        console.log("profile: " + req.session.loggedin);

        if (req.session.loggedin != true){
            res.redirect('/login');
        }
        else{
            var context = {};
            var callbackCount = 0;
            context.jsscripts = ["delete_rating.js", "updaterating.js"];
            var mysql = req.app.get('mysql');

            getUsername(res, mysql, context, complete, currAccount);
            getRatingEntries(res, mysql, context, complete, currAccount);
            function complete(){
                callbackCount++;
                if(callbackCount >= 2){
                    console.log(context.username);
                    res.render('profile', context);
                }

            }
        }
        

    });


    


    return router;
}();