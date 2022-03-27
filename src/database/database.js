const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

/* console.log(process.env.HOST)
console.log(process.env.USER)
console.log(process.env.PASS)
console.log(process.env.DATABASE)
console.log("***") */

let host = '164.92.71.11'
let user = "keyzen2022"
let password = "$Selb2022"

let envProduction = false;

const mysql = require('mysql');

    if (envProduction) {
        mysqlConnection = mysql.createConnection({
        host:'localhost',
        user:"root",
        password:process.env.PASS || "elmasmejor",
        database:"selb",
        multipleStatements: true
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