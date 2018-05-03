var mysql = require('mysql')
require('dotenv').config()

// configure database connection
var db_connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

// connect default database
function connectDatabase() {
  db_connection.connect()
}

// disconnect default database
function disconnectDatabase() {
  db_connection.end()
}

// query default database - takes in query parameter
function queryDatabase(query) {
  connection.query(query, function (error, results, fields) {
    if (error) throw error
  })
}