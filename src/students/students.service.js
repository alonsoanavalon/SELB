const mysqlConnection = require('../database/database')

exports.getAllStudents = () => {
    return new Promise( async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM student order by id;`
            await mysqlConnection.query(sql, async (err, results) => { 
                resolve(results)
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })
}

exports.updateStudentById = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = ``
        } catch (err) {
            reject(err);
            throw err;
        }
    })
}

exports.getStudentById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * from student where ID = ${id}`;
            await mysqlConnection.query(sql, (err, result) => {
                resolve(result)
            })
        } catch (err) {
            throw err;
        }
    })
}