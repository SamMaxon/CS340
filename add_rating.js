module.exports = function(){ 
    var express = require('express');
    var router = express.Router();
    
    function getMovies(res, mysql, context){
        mysql.pool.query("SELECT movieID as id, title From Movie", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.movie = results;
            console.log(context);
            res.render('add_rating', context);
        });
    }

    function addRating(req,res,mysql,id){
        var sql = "INSERT INTO Rating_Entry (movieID, account_ID, score, explanation) VALUES (?,?,?,?)";
                
        var inserts = [req.body.id, currAccount, req.body.score, req.body.explanation];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log("*****ERROR******")
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                return res.end();
            }else{
                if(error){
                    console.log("*****ERROR******")
                    console.log(JSON.stringify(error))
                    res.write(JSON.stringify(error));
                    return res.end();
                }
                else{
                    console.log("*****SUBMITTED RATING******")
                    return res.redirect('/profile');
                }
            }
        });
    }

    function checkValid(req,res,mysql, id){
        var sql = "SELECT * From Rating_Entry Where account_ID=?";
        var inserts = [id];

        var context = {};
        context.error = [];
        var i = 0;
        var found = 0;
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            for (i = 0; i < results.length; i++){
                if (req.body.id == results[i].movieID){
                    context.error.push({msg:"**You already have a rating entry for this movie**"});
                    found ++;
                }
            }

            if (req.body.score > 100 || req.body.score < 0){
                console.log("invalid score (0-100)");
                context.error.push({msg:"**Invalid Score. Must be 0-100**"});
                found ++;
                
            }

            if (found > 0){
                return getMovies(res, mysql, context);
            }
            else{
                return addRating(req,res,mysql,id);
            }
            

        });

        
        
        
    }

    router.get('/', function(req, res){
        currAccount = req.session.username;
        if (req.session.loggedin != true){
            return res.redirect('/login');
        }

        var context = {};
        var mysql = req.app.get('mysql');
        getMovies(res, mysql, context);
        
    });

    router.post('/', function(req, res){
        currAccount = req.session.username;
        if (req.session.loggedin != true){
            res.redirect('/login');
        }
        else{
            console.log(req.body)
            var mysql = req.app.get('mysql');

            return checkValid(req,res, mysql, currAccount);
                
        }
    });

    return router;
}();