const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })


//local
// let host = process.env.HOST
// let user = process.env.USERNAME
// let password = process.env.PASSWORD

let host = process.env.HOST
let user = process.env.USER
let password = process.env.PASSWORD

let envProduction = false;

const mysql = require('mysql');

    if (envProduction) {
        mysqlConnection = mysql.createConnection({
        host:'localhost',
        user:"root",
        password:process.env.PASS || "elmasmejor",
        database:"selb",
        multipleStatements: true,
        port:'/var/run/mysqld/mysqld.sock'
        })
    } else {
        mysqlConnection = mysql.createConnection({
        host:host,
        user:user,
        password:password || "elmasmejor",
        database:"selb",
        multipleStatements: true,
        port:3306
        })
    }



    mysqlConnection.connect((err) => {
        if (err) throw err;
        (envProduction) ? console.log("PRODUCTION MODE") : console.log("DEV MODE")
        console.log("Conectado a la base de datos ", process.env.DATABASE)
    })


module.exports = mysqlConnection;
