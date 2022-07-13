const mysqlConnection = require('../database/database')
const mysql = require('mysql')

exports.getMoments = () => {
    const sql = `SELECT * FROM moment`;
    return new Promise((resolve, reject) => {
        mysqlConnection.query(sql, (err, res) => {
            const data = JSON.stringify(res)
            resolve (data);
        })
    })

}