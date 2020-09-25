module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getAllGroups(res, mysql, context, complete, id){
        var sql = "SELECT groupName, groupID From Groups";
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


    router.get('/', function(req, res){
        var context = {};
        var callbackCount = 0;
        var mysql = req.app.get('mysql');

        getAllGroups(res, mysql, context, complete, 1);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('allGroups', context);
            }

        }

    });

    return router;
}();


//add event listeners to all group Names
