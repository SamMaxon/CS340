module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getGroups(res, mysql, context, complete){
        mysql.pool.query("SELECT groupID as id, groupName From Groups", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.group = results;
            complete();
        });
    }

    router.get('/', function(req, res){
        var context = {};
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        getGroups(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('updateGroup', context);
            }

        }
    });

    function updateName(req, res, mysql){ 
        var sql = "UPDATE Groups SET groupName = ? WHERE groupID = ?";
        var inserts = [req.body.newGroupName, req.body.id];
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
        if (req.body.password != 'Password21'){
            console.log("invalid password");
            return res.redirect('/updateGroup');
        }else{
        updateName(req, res, mysql);
        res.redirect(('/updateGroup'))
        }
    });

    return router;
}();
