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
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        } catch (err) {
            reject(err);
            return(err);
        }
    })
}
exports.findActiveSessionIds = (exercises) => {
    const allSessions = exercises.map(exercise => exercise.session_id);
    return Array.from(new Set(allSessions));
}
exports.groupExercisesBySession = (activeSessions, parsedExercises) => {
    return activeSessions.map(sessionId => {
        return {
            sessionId,
            exercises: parsedExercises.filter(exercise => exercise.session_id === sessionId),
        }
    })
}
exports.formatExercisesBySession = (exercises) => {
    const activeSessions = findActiveSessionIds(exercises);
    return groupExercisesBySession(activeSessions, exercises);
}

exports.getExercisesByCourse = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT exercise.student_id, exercise.activity_id, exercise.item, exercise.result, exercise.date, exercise.response_time, activity.session_id, course.id as course from exercise inner join activity on exercise.activity_id = activity.id inner join session on activity.session_id = session.id inner join student on exercise.student_id = student.id inner join course on student.course_id = course.id WHERE course.id = ${id} ORDER BY session.id;`;
            await mysqlConnection.query(sql, (err, result) => {
                if (err) {
                    resolve(err)
                }
                if (result?.length > 0) {
                    resolve(result)
                } else {
                    resolve(result)
                }

            })
        } catch (err) {
            reject(err);
            return(err);
        }
    })

}

