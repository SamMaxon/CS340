module.exports = function(){ 
    var express = require('express');
    var router = express.Router();
    
    function validate__noEmpty(req, res, mysql, error, context, complete){
        var name = req.body.name
        name = name.trim();
        var email = req.body.email
        email = email.trim();
        var company = req.body.company
        company = company.trim();
        var username = req.body.username
        username = username.trim();
        var password = req.body.password
        password = password.trim();
        if (company == ""){
            company = null;
        }

        if (name == "" || email == "" || username == "" || password == "" ){
            console.log("empty input");
            error.counter ++;
        }

        complete();
        
    }

    function validate__unique(req, res, mysql, e, context, complete){
        var name = req.body.name
        name = name.trim();
        var email = req.body.email
        email = email.trim();
        var company = req.body.company
        company = company.trim();
        var username = req.body.username
        username = username.trim();
        var password = req.body.password
        password = password.trim();
        if (company == ""){
            company = null;
        }

        var sql = "SELECT * From Account INNER JOIN Member on Account.account_ID = Member.account_ID";
        var accounts;
        var i;
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            for (i=0; i < results.length ; i++){
                if (username == results[i].username){
                    console.log("username already taken");
                    context.error.push({msg:"**USERNAME already taken**"});
                    e.counter ++;
                }
                if (email == results[i].email){
                    console.log("**EMAIL already taken**");
                    context.error.push({msg:"**EMAIL already taken**"});
                    e.counter ++;
                }
            }

            complete();
        }); 

        
    }

    function validate__complete(req, res, mysql, error, context, complete){
        var name = req.body.name
        name = name.trim();
        var email = req.body.email
        email = email.trim();
        var company = req.body.company
        company = company.trim();
        var username = req.body.username
        username = username.trim();
        var password = req.body.password
        password = password.trim();
        if (company == ""){
            company = null;
        }
                if (error.counter > 0){
                    console.log("found error: " + error.counter);
                    return res.render('signup', context);
                }     
                else{
                    var sql = "CALL createAccount (?, ?, ?, ?, ?)";
                    var inserts = [email, name , company , username, password];
                    sql = mysql.pool.query(sql,inserts, function(error, results, fields){
                        if(error){
                            console.log("*****ERROR in creating account******")
                            console.log(JSON.stringify(error))
                            res.write(JSON.stringify(error));
                            res.end();
                        }
                        else{
                            res.redirect('/login');
                        }
                    });
                }
    }

    router.get('/', function(req, res){
        currAccount = req.session.username
        if (req.session.loggedin == true){
            res.redirect("profile")
        }
        else{
            var mysql = req.app.get('mysql');
            res.render('signup');
        }
        
    });

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');

        var error = {counter:0};

        var callbackCount = 0;
        var context = {};
        context.error = [];
        validate__noEmpty(req,res,mysql, error , context, complete);
        validate__unique(req, res, mysql, error , context, complete);


        function complete(){
            callbackCount++;
            if (callbackCount >= 2){
                validate__complete(req, res, mysql, error , context, complete);
            }
            
        }

    });

    return router;
}();








