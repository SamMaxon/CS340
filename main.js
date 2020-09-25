/*
    Uses express, dbcon for database connection, body parser to parse form data
    handlebars for HTML templates
*/

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');

var app = express();
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.json());

var handlebars = require('express-handlebars').create({
        defaultLayout:'main',
        });

app.locals.currAccount = -1;

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);

app.use('/login', require("./login.js"));
app.use('/signup', require("./signup.js"));

app.use('/rating', require('./rating.js'));
app.use('/profile', require('./profile.js'));
app.use('/add_rating', require('./add_rating.js'));

app.use('/movies', require('./movies.js'));
app.use('/singleMovie', require('./singleMovie.js'));
app.use('/yourGroups', require('./yourGroups.js'));
app.use('/allGroups', require('./allGroups.js'));
app.use('/joinGroup', require('./joinGroup.js'));
app.use('/leaveGroup', require('./leaveGroup.js'));
app.use('/deleteGroup', require('./deleteGroup.js'));
app.use('/createGroup', require('./createGroup.js'));
app.use('/updateGroup', require('./updateGroup.js'));

app.use( "/logout" ,function(req,res){
  console.log("in logout function");
  req.session.loggedin = false;
  req.session.username = -1;
  res.redirect('/index.html');
});

app.use('/', express.static('public'));



app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
