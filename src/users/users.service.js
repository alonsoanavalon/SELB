const mysqlConnection = require('../database/database')

exports.getAllUsers = () => {
    return new Promise( async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM user`
            await mysqlConnection.query(sql, async (err, results) => { 
                resolve(results)
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })
}