const mysqlConnection = require('../../database/database')



exports.getExercisesByStudentRut = (studentRut) => {
    return new Promise( async (resolve, reject) => {
        try {
            const sql = `SELECT exercise.id, exercise.item, exercise.result,  exercise.response_time, exercise.date as exercise_date, exercise.activity_id,session.date as session_date,  activity.session_id, activity.date as activity_date FROM activity INNER JOIN exercise ON activity.id = exercise.activity_id INNER JOIN session on activity.session_id = session.id INNER JOIN student on student.id = exercise.student_id where student.rut = '${studentRut}';`;
            await mysqlConnection.query(sql, async (err, results) => { 
                resolve(results)
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })
}


exports.getExercisesBySessionId = (sessionId) => {
    return new Promise( async (resolve, reject) => {
        try {
            const sql = `SELECT exercise.id, student.id as student_id, exercise.item, exercise.result,  exercise.response_time, exercise.date as exercise_date, exercise.activity_id,session.date as session_date,  activity.session_id, activity.date as activity_date FROM activity INNER JOIN exercise ON activity.id = exercise.activity_id INNER JOIN session on activity.session_id = session.id INNER JOIN student on student.id = exercise.student_id where activity.session_id = ${sessionId};`;
            await mysqlConnection.query(sql, async (err, results) => { 
                resolve(results)
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })
}

exports.getExercisesByActivityId = (activityId) => {
    return new Promise( async (resolve, reject) => {
        try {
            const sql = `SELECT exercise.id, student.id as student_id, exercise.item, exercise.result,  exercise.response_time, exercise.date as exercise_date, exercise.activity_id,session.date as session_date,  activity.session_id, activity.date as activity_date FROM activity INNER JOIN exercise ON activity.id = exercise.activity_id INNER JOIN session on activity.session_id = session.id INNER JOIN student on student.id = exercise.student_id where activity.id = ${activityId};`;
            await mysqlConnection.query(sql, async (err, results) => { 
                resolve(results)
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })
}

