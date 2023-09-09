const mysqlConnection = require('../../database/database');
const exerciseService = require('../exercise/exercise.service');

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

function getAllStudents (exercises) {

    const allStudents = exercises.map(exercise => {
        return { 
            studentId: exercise.student_id,
            studentName: exercise.student_name
        }
    });


    const studentIds = exercises.map(exercise => exercise.student_id);
    const filteredStudentIds = Array.from(new Set(studentIds));

    const final = filteredStudentIds.map((studentId) => {
        let data = {}
        allStudents.forEach((studentData) => {
            if (studentData.studentId == studentId){
                data.studentId = studentId,
                data.studentName = studentData.studentName
            }
        })
        return data;
    })

    return final
}

function getActivitiesByStudent (exercisesBySession){
    return exercisesBySession.map(session => {
        return {
            sessionId: session.sessionId,
            students: getAllStudents(session.activities)
        }
    })
}

function generateSessionObjects (sessionIds) {
    return sessionIds.map(session => {
        return {
            sessionId: session
        }
    })
}

function getExercisesBySession(exercises, sessions) {
    const exercisesBySession = sessions.map((session) => {
        const filteredExercises = exercises.filter(exercise => exercise.session_id == session.sessionId);
        session.exercises = filteredExercises;
        return session;

    })
    return exercisesBySession;
}

function getExercisesBySessionAndActivity(exercisesBySession, activitiesBySession, {spread = false}){
    const exercisesByActivities = activitiesBySession.map(sessionActivities => {
        const activitiesBySession = sessionActivities.activities.map((activityId) => {
            const filteredExercises = exercisesBySession.filter(element => element.sessionId == sessionActivities.sessionId);
            const exercisesByActivity = filteredExercises[0]?.exercises.filter(element => element.activity_id == activityId) 
            return {
                activityId,
                exercises: exercisesByActivity,
            }
        })

        return {
            sessionId: sessionActivities.sessionId,
            activities: activitiesBySession
        }
        
    })

    const spreadExercisesByActivities = exercisesByActivities.map(session => {
        const allActivities = [];
        session.activities.forEach(activity => {
            activity.exercises.forEach(exercise => allActivities.push(exercise))
        })
        return {
            sessionId: session.sessionId,
            activities: allActivities
        }

    })

    //Aca obtengo session y activities con ejercicios separados o todos los ejercicios desplegados
    if ({spread}) {
        return spreadExercisesByActivities;
    } else {
        return exercisesByActivities;
    }
    
}

function getActivitiesBySession(exercisesBySession){
    const allActivitiesBySession = exercisesBySession.map(session => {
        const activitiesIds = session.exercises.map((exercise) => exercise.activity_id);
        return {
            sessionId: session.sessionId,
            activities: Array.from(new Set(activitiesIds))
        }
    });
    return allActivitiesBySession;

}

function formatExercisesByStudent(activitiesByStudent, exercisesBySessionAndActivity) {

    return activitiesByStudent.map((session) => {
        const exercisesByStudent = session.students.map((student) => {
            const filteredExercises = exercisesBySessionAndActivity.filter((sess) => sess.sessionId == session.sessionId)
            return {
                studentId: student.studentId,
                studentName: student.studentName,
                exercises: filteredExercises[0]?.activities?.filter(exercise => exercise.student_id == student.studentId)

            }
        })
        return {
            sessionId: session.sessionId,
            students: exercisesByStudent,
        }
    })
}

function formatExercisesByActivity(activitiesBySession, spreadFormattedExercisesByStudent) {
    let formattedExercises = [];

    activitiesBySession.forEach((session) => {
        session.activities.forEach(_ => {
            const response = spreadFormattedExercisesByStudent.map((sess => {
                const formattedExercisesByStudent = sess.students.map(exercisesByStudent => {
                    const allActivities = exercisesByStudent.exercises.map((exercise) => exercise.activity_id);
                    const activitiesByStudent = Array.from(new Set(allActivities));
                    const formattedActivitiesByStudent = activitiesByStudent.map((activityId) => {
                        const exercises = exercisesByStudent.exercises.filter((exercise) => exercise.activity_id == activityId)
                        return {
                            activityId,
                            exercises
                        }
                    })
                    return {
                        studentId: exercisesByStudent.studentId,
                        studentName: exercisesByStudent.studentName,
                        activities: formattedActivitiesByStudent
                    }
                })
                return {
                    sessionId: sess.sessionId,
                    students: formattedExercisesByStudent
                }
            }))
            formattedExercises = response;
        })
    })

    return formattedExercises;
}

exports.getExercisesByCourse = async (id) => {
    try {
        const exercisesByCourse = await exerciseService.getExercisesByCourse(id);
        const activeSessions = exerciseService.findActiveSessionIds(exercisesByCourse);
        const sessions = generateSessionObjects(activeSessions);
        const exercisesBySession = getExercisesBySession(exercisesByCourse, sessions);
        const activitiesBySession = getActivitiesBySession(exercisesBySession);

        //este es clave, tiene las sesiones con actividades y ejercicios agrupados o sesiones con todos ejercicios
        const exercisesBySessionAndActivity = getExercisesBySessionAndActivity(exercisesBySession, activitiesBySession, {spread: false});
        
        const activitiesByStudent = getActivitiesByStudent(exercisesBySessionAndActivity);

        //sesiones con los ejercicios separados por estudiante
        const spreadFormattedExercisesByStudent = formatExercisesByStudent(activitiesByStudent, exercisesBySessionAndActivity);
        
        //orden por sesion -> estudiantes -> actividades -> ejercicios
        const formattedExercisesByStudent = formatExercisesByActivity(activitiesBySession, spreadFormattedExercisesByStudent);
        return formattedExercisesByStudent
    } catch (err) {
        console.error(err);
        return err;
    }


}

function filterActivitiesBySession(exercisesBySession) {
    const allActivities = [];
    exercisesBySession.forEach((session) => {
        session.students.forEach((student) => {
            student.activities.forEach((activity) => {
                allActivities.push(activity.activityId);
            });
        })
    })

    if(allActivities?.length > 0) {
        const filteredActivities = Array.from(new Set(allActivities));
        return filteredActivities;
    } else {
        return [];
    }
}


exports.getExercisesBySessionAndCourse = async (sessionId, courseId) => {
    const exercisesByCourse = await this.getExercisesByCourse(courseId);
    const exercisesBySession = exercisesByCourse.filter((exercises) => exercises.sessionId == sessionId);
    const activities = filterActivitiesBySession(exercisesBySession);
    const exercisesByActivities = activities.map((activityId) => {
        const exercisesByStudent = [];
        exercisesBySession[0].students.forEach((student) => {
            const exercisesByActivity = [];
            student.activities.forEach((activity) => {
                if (activity.activityId == activityId) {
                    exercisesByActivity.push(activity.exercises);
                }
            })
            exercisesByStudent.push({
                studentId: student.studentId,
                studentName: student.studentName,
                exercises: exercisesByActivity
            })
        })

        return {
            activityId,
            students: exercisesByStudent
        }
    })
    return exercisesByActivities;
}

exports.getExercisesBySessionActivityAndStudent = async (sessionId, courseId, activityId, studentId) => {
    const exercisesBySessionAndCourse = await this.getExercisesBySessionAndCourse(sessionId, courseId);
    const exercisesByActivity = exercisesBySessionAndCourse.filter((exercises) => exercises.activityId == activityId)[0];
    const exercisesByStudent = exercisesByActivity.students.filter((student) => student.studentId == studentId)[0];
    return exercisesByStudent;
}

exports.getActivitiesBySessionAndStudent = async (sessionId, courseId, studentId) =>  {
    const exercisesBySessionAndCourse = await this.getExercisesBySessionAndCourse(sessionId, courseId);
    const exercisesByStudent = [];
    
    exercisesBySessionAndCourse.forEach((exercises) => {
        const exercisesByActivity = [];
        exercises.students.forEach((student) => {
            if (student.studentId == studentId && student.exercises?.length > 0) {
                student.exercises.forEach(exercise => {
                    exercisesByActivity.push(exercise);
                })
            };
        } );
        
        if (exercisesByActivity?.length > 0) {
            exercisesByStudent.push({
                activityId: exercises.activityId,
                exercises: exercisesByActivity
            });
        }
    })

    return exercisesByStudent;
}
