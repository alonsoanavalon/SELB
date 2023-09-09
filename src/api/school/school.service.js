const mysqlConnection = require('../../database/database')

exports.getAll = () => {
    return new Promise( async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM school order by id;`
            await mysqlConnection.query(sql, async (err, results) => { 
                resolve(results)
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })
}

exports.getById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * from school where id = ${id}`;
            await mysqlConnection.query(sql, (err, result) => {
                resolve(result)
            })
        } catch (err) {
            reject(err);
            throw err;
        }
    })
}


