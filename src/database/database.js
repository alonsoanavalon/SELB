const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

/* console.log(process.env.HOST)
console.log(process.env.USER)
console.log(process.env.PASS)
console.log(process.env.DATABASE)
console.log("***") */

const mysql = require('mysql');

    mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:"root",
    password:'$Selb2022',
    database:"selb",
    multipleStatements: true,
    port:'/var/run/mysqld/mysqld.sock'
    })



    mysqlConnection.connect((err) => {
        if (err) throw err;
        console.log(err);
	console.log(process.env.PASS, " jeje")
        console.log("Conectado a la base de datos ", process.env.DATABASE)
    })


module.exports = mysqlConnection;
