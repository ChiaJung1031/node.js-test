var mysql = require("mysql2");
var conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database:'website'
});


conn.query('SELECT * FROM travel limit 10', function(err, rows, fields)
 {
    if (err) throw err;
    console.log('The result is: ', rows);
}); 