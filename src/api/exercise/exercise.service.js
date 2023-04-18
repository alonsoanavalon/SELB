const mysqlConnection = require('../../database/database')

exports.getAllExercise = () => {
    return new Promise( async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM exercise order by id;`
            await mysqlConnection.query(sql, async (err, results) => { 
                resolve(results)
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })
}

exports.getExerciseById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * from exercise where id = ${id}`;
            await mysqlConnection.query(sql, (err, result) => {
                resolve(result)
            })
        } catch (err) {
            reject(err);
            throw err;
        }
    })
}


exports.createExercise = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `INSERT INTO exercise (student_id, activity_id, item, result, date, response_time) VALUES (${body.studentId}, ${body.activityId}, ${body.item}, ${body.result}, current_timestamp(), ${body.responseTime});`;
            await mysqlConnection.query(sql, (err, result) => {
                resolve(result)
            })
        } catch (err) {
            reject(err);
            return(err);
        }
    })
}

