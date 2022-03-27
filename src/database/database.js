const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

/* console.log(process.env.HOST)
console.log(process.env.USER)
console.log(process.env.PASS)
console.log(process.env.DATABASE)
console.log("***") */

let host = process.env.HOST
let user = process.env.USER
let password = process.env.PASSWORD

let envProduction = false;

const mysql = require('mysql');

<<<<<<< HEAD
    mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:"root",
    password:'$Selb2022',
    database:"selb",
    multipleStatements: true,
    port:'/var/run/mysqld/mysqld.sock'
    })
=======
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
>>>>>>> 0c420d0e896be9579e2eb75740a3817eccea5449



    mysqlConnection.connect((err) => {
        if (err) throw err;
<<<<<<< HEAD
        console.log(err);
	console.log(process.env.PASS, " jeje")
=======
        (envProduction) ? console.log("PRODUCTION MODE") : console.log("DEV MODE")
>>>>>>> 0c420d0e896be9579e2eb75740a3817eccea5449
        console.log("Conectado a la base de datos ", process.env.DATABASE)
    })


module.exports = mysqlConnection;
