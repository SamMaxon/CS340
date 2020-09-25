module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getGroups(res, mysql, context, complete, id){
        var sql = "SELECT groupID as id, groupName From Groups NATURAL JOIN Apart_Of NATURAL JOIN Member WHERE account_ID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.group = results;
            complete();
        });
    }

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
        getGroups(res, mysql, context, complete, req.session.username);
        getEmail(res, mysql, context, complete, req.session.username);

        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('leaveGroup', context);
            }

        }

    });

    router.post('/', function(req, res){
        console.log(req.body);
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Apart_Of WHERE groupID = ? and email = ?";
        var inserts = [req.body.id, req.body.email];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log("*****ERROR******")
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.redirect('/leaveGroup');
            }else{
                res.redirect('/leaveGroup');
            }
        });
    });

    return router;
}();
