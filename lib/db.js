const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: '',
  password: '',
  database: 'QuHam',
  multipleStatements: true,
});

// db 연결
db.connect();

module.exports = db;
