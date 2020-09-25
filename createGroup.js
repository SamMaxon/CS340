module.exports = function(){
    var express = require('express');
    var router = express.Router();
   
    function getEmail(res, mysql, context, complete, id){
        var sql = "SELECT email FROM Member INNER JOIN Account ON Member.account_ID WHERE Member.account_ID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }

            context.email = results[0];
            complete();
        });
    }

    router.get('/', function(req, res){
        var context = {};
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        getEmail(res, mysql, context, complete, req.session.username);

        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('createGroup', context);
            }

        }

    });

    function createG(req, res, mysql){ 
        var sql = "INSERT INTO Groups (groupName) VALUES (?)";
        var inserts = [req.body.groupName];
        mysql.pool.query(sql, inserts, function(error, results, fields){
          if(error){
            res.write(JSON.stringify(error));
            res.end();
          }
        });
    }

    function createJoin(req, res, mysql){ 
        var sql = "INSERT INTO Apart_Of (groupID, email) VALUES ((SELECT groupID FROM Groups WHERE groupName = ?),?)";
        var inserts = [req.body.groupName, req.body.email];
        mysql.pool.query(sql, inserts, function(error, results, fields){
          if(error){
            res.write(JSON.stringify(error));
            res.end();
          }
        });
    }

    router.post('/', function(req, res){
        console.log(req.body);
        var mysql = req.app.get('mysql');
        createG(req, res, mysql);
        createJoin(req, res, mysql);
        res.redirect(('/yourGroups'))
    });

    return router;
}();