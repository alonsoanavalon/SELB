const mysqlConnection = require('../../database/database')

exports.getAllSchools = () => {
    return new Promise( async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM school order by id`
            await mysqlConnection.query(sql, async (err, results) => { 
                resolve(results)
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })
}