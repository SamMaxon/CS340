var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_lekevi',
  password        : 'Thienle09',
  database        : 'cs340_lekevi'
});
module.exports.pool = pool;
