module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getGroup(res, mysql, context, complete, id){
        var sql = "SELECT groupName From Groups AS g INNER JOIN Apart_Of AS a ON g.groupID = a.groupID LEFT JOIN Member AS m ON a.email = m.email WHERE m.account_ID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }

            context.groupName = results;
            complete();
        });
    }

    router.get('/', function(req, res){
        var context = {};
        var callbackCount = 0;
        var mysql = req.app.get('mysql');

        getGroup(res, mysql, context, complete, req.session.username);

        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('yourGroups', context);
            }

        }

    });

    return router;
}();
