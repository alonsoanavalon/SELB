
const mysqlConnection = require('../database/database')

exports.getAllData = (data) => {
    mysqlConnection.query(`SELECT * FROM ${data}`, (err, results) => {
        res.send(results)
    })
}