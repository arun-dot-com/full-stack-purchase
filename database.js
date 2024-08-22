var mysql = require("mysql2");

var connection = mysql.createConnection({
    host: 'localhost',
    database : 'orders',
    user :'root',
    password : 'root'

});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the MySQL database:', err.stack);
        return;
    }
    console.log('Connected to the MySQL database as ID ' + connection.threadId);
});

module.exports = connection;