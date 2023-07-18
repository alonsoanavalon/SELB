const mysqlConnection = require('../../database/database')
const sessionService = require('../session/session.service')

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
    try {
        if (exercises) {
            const allSessions = exercises.map(exercise => exercise.session_id);
            return Array.from(new Set(allSessions));
        } else {
            console.error("Hubo un problema en la conexión")
        }
    } catch (err) {
        console.error(err);
    }

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
            const sql = `SELECT exercise.student_id, concat(student.name , " ", student.surname) as student_name, exercise.activity_id, exercise.item, exercise.result, exercise.date, exercise.response_time, activity.session_id, course.id as course from exercise inner join activity on exercise.activity_id = activity.id inner join session on activity.session_id = session.id inner join student on exercise.student_id = student.id inner join course on student.course_id = course.id WHERE course.id = ${id} ORDER BY session.id;`;
            await mysqlConnection.query(sql, (err, result) => {
                if (err) {
                    resolve(err)
                }
                if (result?.length > 0) {
                    resolve(result)
                } else {
                    reject(`Ha ocurrido un error ${result}`)
                }

            })
        } catch (err) {
            reject(err);
            return(err);
        }
    })

}

exports.getExercisesBySessionAndCourseData = (courseId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT exercise.student_id, exercise.activity_id, exercise.item, exercise.result, exercise.date, exercise.response_time, activity.session_id, course.id as course from exercise inner join activity on exercise.activity_id = activity.id inner join session on activity.session_id = session.id inner join student on exercise.student_id = student.id inner join course on student.course_id = course.id WHERE course.id = ${courseId} ORDER BY session.id;`;
            await mysqlConnection.query(sql, (err, result) => {
                if (err) {
                    resolve(err)
                }
                if (result?.length > 0) {
                    resolve(result)
                } else {
                    reject(`Ha ocurrido un error ${result}`)
                }

            })
        } catch (err) {
            reject(err);
            return(err);
        }
    })

}

exports.getExercisesBySessionAndCourse = async (courseId, sessionId) => {
    const exercises = await this.getExercisesBySessionsAndCourse(courseId);
    const exercisesBySession = exercises.filter((exercise) => exercise.sessionId == sessionId);
    return exercisesBySession;
}

exports.getFullExercisesBySessionsAndCourse = async (courseId) => {
    const data = await sessionService.getExercisesByCourse(courseId);
    const fullExercises = [];

    data.forEach((session) => {
        const sessionId = session.sessionId;
        const students = [];
        session.students.forEach(student => {
            const studentId = student.studentId;
            const exercises = [];
            student.activities.forEach(activity => {
                activity.exercises.forEach((exercise) => {
                    exercises.push(exercise);
                })
            })
            students.push({
                studentId,
                exercises
            })
        })
        fullExercises.push({
            sessionId,
            students
        })
    })

    return fullExercises;
}

exports.getExercisesBySessionsAndCourse = async (courseId) => {
    const data = await sessionService.getExercisesByCourse(courseId);

    const exercisesBySessionAndStudent = [];

    data.forEach((session) => {
        const sessionId = session.sessionId;
        const students = []
        const correctExercises = []
        const failedExercises = []
        session.students.forEach(student => {
            const studentId = student.studentId;
            let successCounter = 0;
            let failCounter = 0;

            student.activities.forEach(activity => {
                activity.exercises.forEach((exercise) => {
                    if (exercise.result == 0 || exercise.result == null) failCounter++
                    if (exercise.result == 1) successCounter++
                })
            })
            students.push(studentId);
            correctExercises.push(successCounter)
            failedExercises.push(failCounter);
        })

        exercisesBySessionAndStudent.push({
            sessionId,
            students,
            correctExercises,
            failedExercises
        })
    })

    return exercisesBySessionAndStudent;
}

exports.getExercisesBySessionAndStudent = async (courseId, studentId) => {
    const exercisesBySession = await this.getFullExercisesBySessionsAndCourse(courseId);
    const exercisesBySessionAndStudent = [];
    
    exercisesBySession.forEach((session) => {
        const exercises = []
        
        session.students.forEach((student) => {
            if (student.studentId == studentId) {
                exercises.push(student.exercises); 
            }
        })

        if (exercises.length > 0) {
            exercisesBySessionAndStudent.push({
                sessionId: session.sessionId,
                exercises
            })
        }
   
    })

    return exercisesBySessionAndStudent;
}

exports.evaluateExercisesBySessionAndStudent = async (courseId, studentId) => {
    const data = await this.getExercisesBySessionAndStudent(courseId, studentId)
    const results = data.map((session) => {
        const sessionId = session.sessionId
        let successCounter = 0;
        let failCounter = 0;
        let totalCount = session.exercises[0].length;
        let studentId;
        let studentName;
        session.exercises[0].forEach((exercise, key) => {
            if (key == 0) {
                studentId = exercise.student_id;
                studentName = exercise.student_name
            }
            if (exercise.result == 0 || exercise.result == null) failCounter++
            if (exercise.result == 1) successCounter++
        })

        return {
            sessionId,
            totalCount,
            students: [{studentId, studentName}],
            successCounter: [successCounter],
            failCounter: [failCounter]
        }
    })

    return results;
}