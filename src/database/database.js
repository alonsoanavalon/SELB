const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const mysql = require('mysql');

mysqlConnection = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.DB_USERNAME,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
    multipleStatements: true,
    port:process.env.DATABASE_PORT
})

mysqlConnection.connect((err) => {
    if (err) throw err;
    (!process.env.PRODUCTION) ? console.log("PRODUCTION MODE") : console.log("DEV MODE")
    console.log("Conectado a la base de datos ", process.env.DATABASE)
})

module.exports = mysqlConnection;
