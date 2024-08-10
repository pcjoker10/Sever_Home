var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'pcjoker.duckdns.org',
  user     : 'joker',
  password : '4113',
  database : 'joker'
});
 
connection.connect();
 
connection.query('SELECT * FROM topic', function (error, results, fields) {
  if (error) {
    console.log(error);
  }
  console.log(results);
});
 
connection.end();