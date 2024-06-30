const mysqlConnection = require('../../database/database.js')

exports.getAllInstruments = () => {
    return new Promise( async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM instrument`
            await mysqlConnection.query(sql, async (err, results) => { 
                resolve(results)
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })
}