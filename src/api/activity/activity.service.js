const mysqlConnection = require('../../database/database')

exports.getAllActivity = () => {
    return new Promise( async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM activity order by id;`
            await mysqlConnection.query(sql, async (err, results) => { 
                resolve(results)
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })
}

exports.getActivityById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * from activity where id = ${id}`;
            await mysqlConnection.query(sql, (err, result) => {
                resolve(result)
            })
        } catch (err) {
            reject(err);
            throw err;
        }
    })
}

exports.createActivity = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `INSERT INTO activity (session_id, date) VALUES (${body.sessionId}, current_timestamp());`;
            await mysqlConnection.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result)
            })
        } catch (err) {
            reject(err);
            console.log(err);
        }
    })
}

