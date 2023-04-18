const mysqlConnection = require('../../database/database')

exports.getAllSession = () => {
    return new Promise( async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM session`
            await mysqlConnection.query(sql, async (err, results) => { 
                resolve(results)
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })
}

exports.getSessionById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * from session where id = ${id}`;
            await mysqlConnection.query(sql, (err, result) => {
                resolve(result)
            })
        } catch (err) {
            reject(err);
            throw err;
        }
    })
}

exports.createSession = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `INSERT INTO session (date) VALUES (current_timestamp());`;
            await mysqlConnection.query(sql, (err, result) => {
                resolve(result)
            })
        } catch (err) {
            reject(err);
            console.log(err);
        }
    })
}

