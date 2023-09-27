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

function getStudentIdByRut (rut) {
    return new Promise((resolve, reject) => {
        try {
            const sql = `SELECT id FROM student WHERE rut = '${rut}'`;
            mysqlConnection.query(sql, (err, result) => {
                if (result) {
                    resolve(result[0]?.id)
                } else {
                    resolve ('')
                }
            })
        } catch (err) {
            reject(err);
            throw err;
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

async function getSkillFromActivity (activityId) {
    return new Promise((resolve, reject) => {
        try {
            const sql = `SELECT skill.name, skill.description FROM skill INNER JOIN activity ON skill.id = activity.skill_id WHERE activity.id = '${activityId}'`;
            mysqlConnection.query(sql, (err, result) => {
                if (result) {
                    resolve(result[0])
                } else {
                    resolve ('')
                }
            })
        } catch (err) {
            reject(err);
            throw err;
        }
    })
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


function formatExercisesData(exercisesData) {
    const formattedSessions = {};

    for (const sessionId in exercisesData) {
        if (exercisesData.hasOwnProperty(sessionId)) {
            const session = exercisesData[sessionId];
            const totalCount = session.length;

            const successCounter = session.filter(exercise => exercise.result === 1).length;
            const failCounter = session.filter(exercise => exercise.result === 0).length;

            // Usamos un objeto para almacenar estudiantes únicos
            const uniqueStudents = {};

            session.forEach(exercise => {
                // Usamos el studentId como clave para asegurarnos de que cada estudiante sea único en la sesión
                uniqueStudents[exercise.student_id] = {
                    studentId: exercise.student_id,
                    studentName: exercise.student_name
                };
            });

            const students = Object.values(uniqueStudents); // Convertimos el objeto de estudiantes a un arreglo

            const sessionData = {
                sessionId: sessionId,
                totalCount: totalCount,
                students: students,
                successCounter: successCounter,
                failCounter: failCounter
            };

            formattedSessions[sessionId] = sessionData;
        }
    }

    return Object.values(formattedSessions); // Convertimos el objeto de sesiones a un arreglo
}

async function groupExercisesByActivityWithSkill(exercisesData) {
    const groupedData = {};

    for (const session in exercisesData) {
      for (const exercise of exercisesData[session]) {
        const activityId = exercise.activity_id;
        const skill = await getSkillFromActivity(activityId);

        const skillName = skill.name;
  
        if (!(skillName in groupedData)) {
          groupedData[skillName] = {
            skillName,
            skillDescription: skill.description.replace(/\n/g, ' '),
            activities: {},
            students: [],
            totalCount: 0,
            successCounter: 0,
            failCounter: 0,
          };
        }
  
        if (!(activityId in groupedData[skillName].activities)) {
          groupedData[skillName].activities[activityId] = {
            activityId: activityId,
            students: [],
            totalCount: 0,
            successCounter: 0,
            failCounter: 0,
          };
        }
  
        const studentInfo = {
          studentId: exercise.student_id,
          studentName: exercise.student_name,
        };
  
        if (
          !groupedData[skillName].students.some(
            (student) =>
              student.studentId === studentInfo.studentId &&
              student.studentName === studentInfo.studentName
          )
        ) {
          groupedData[skillName].students.push(studentInfo);
        }
  
        if (
          !groupedData[skillName].activities[activityId].students.some(
            (student) =>
              student.studentId === studentInfo.studentId &&
              student.studentName === studentInfo.studentName
          )
        ) {
          groupedData[skillName].activities[activityId].students.push(studentInfo);
        }
  
        groupedData[skillName].totalCount++;
        groupedData[skillName].successCounter += exercise.result === 1 ? 1 : 0;
        groupedData[skillName].failCounter += exercise.result === 0 ? 1 : 0;
  
        groupedData[skillName].activities[activityId].totalCount++;
        groupedData[skillName].activities[activityId].successCounter += exercise.result === 1 ? 1 : 0;
        groupedData[skillName].activities[activityId].failCounter += exercise.result === 0 ? 1 : 0;
      }
    }
  
    return Object.values(groupedData);
  }


  function groupExercisesByActivity(exercisesData) {
    const groupedData = {};
  
    for (const session in exercisesData) {
      for (const exercise of exercisesData[session]) {
        const activityId = exercise.activity_id;
  
        if (!(activityId in groupedData)) {
          groupedData[activityId] = {
            activityId: activityId,
            students: [],
            totalCount: 0,
            successCounter: 0,
            failCounter: 0,
          };
        }
  
        const studentInfo = {
          studentId: exercise.student_id,
          studentName: exercise.student_name,
        };
  
        if (
          !groupedData[activityId].students.some(
            (student) =>
              student.studentId === studentInfo.studentId &&
              student.studentName === studentInfo.studentName
          )
        ) {
          groupedData[activityId].students.push(studentInfo);
        }
  
        groupedData[activityId].totalCount++;
        if (exercise.result === 1) {
          groupedData[activityId].successCounter++;
        } else {
          groupedData[activityId].failCounter++;
        }
      }
    }
  
    return Object.values(groupedData);
  }


  function groupExercisesBySessionAndActivity(exercisesData) {
    const groupedData = {};
  
    for (const session in exercisesData) {
      for (const exercise of exercisesData[session]) {
        const sessionId = exercise.session_id;
        const activityId = exercise.activity_id;
  
        if (!(sessionId in groupedData)) {
          groupedData[sessionId] = {
            sessionId: sessionId,
            activities: {},
          };
        }
  
        if (!(activityId in groupedData[sessionId].activities)) {
          groupedData[sessionId].activities[activityId] = {
            activityId: activityId,
            students: [],
            totalCount: 0,
            successCounter: 0,
            failCounter: 0,
          };
        }
  
        const studentInfo = {
          studentId: exercise.student_id,
          studentName: exercise.student_name,
        };
  
        if (
          !groupedData[sessionId].activities[activityId].students.some(
            (student) =>
              student.studentId === studentInfo.studentId &&
              student.studentName === studentInfo.studentName
          )
        ) {
          groupedData[sessionId].activities[activityId].students.push(studentInfo);
        }
  
        groupedData[sessionId].activities[activityId].totalCount++;
        if (exercise.result === 1) {
          groupedData[sessionId].activities[activityId].successCounter++;
        } else {
          groupedData[sessionId].activities[activityId].failCounter++;
        }
      }
    }
  
    return Object.values(groupedData).map((session) => {
      return {
        sessionId: session.sessionId,
        activities: Object.values(session.activities),
      };
    });
  }
  

// Obtener todos los ejercicios del alumno agrupados por sesión y actividad
async function getExercisesByStudentAndSession(studentId, courseId) {
    const exercisesByCourse = await exerciseService.getExercisesByCourse(courseId);

    // Filtrar los ejercicios por el alumno
    const exercisesByStudent = exercisesByCourse.filter(exercise => exercise.student_id === studentId);

    // Agrupar los ejercicios por sesión
    const exercisesGroupedBySession = {};

    exercisesByStudent.forEach(exercise => {
        if (!exercisesGroupedBySession[exercise.session_id]) {
            exercisesGroupedBySession[exercise.session_id] = [];
        }
        exercisesGroupedBySession[exercise.session_id].push(exercise);
    });

    return exercisesGroupedBySession;
}

async function getStudentCourses(studentId) {



    return new Promise((resolve, reject) => {
        try {

            const sql = `SELECT course_id FROM student WHERE id = ${studentId}`;
            mysqlConnection.query(sql, (err, result) => {
                if (result){
                    resolve(result[0]?.course_id)
                }

            })
        } catch (err) {
            reject(err);
            throw err;
        }
    })
}





exports.getGroupExercisesBySessionAndActivity = async (studentRut) => {
    const studentId = await getStudentIdByRut(studentRut);
    const courseId = await getStudentCourses(studentId)
    const exercises = await getExercisesByStudentAndSession(+studentId, courseId);
    //const response = formatExercisesData(exercises);  //ejercicios por sesion con contador de ejercicios
    //const response = groupExercisesByActivity(exercises); //segun actividad, separadas sin agruparse, contadores de ejercicios
    const response = groupExercisesBySessionAndActivity(exercises) // segun sesión pero mostrando actividades con sus contadores de ejercicios
    //const response = groupExercisesByActivityWithSkill(exercises) //separado segun habilidad mostrando actividades con sus contadores de ejercicios
    return response;
}


exports.getGroupExercisesBySession = async (studentRut) => {
    const studentId = await getStudentIdByRut(studentRut);
    const courseId = await getStudentCourses(studentId)
    const exercises = await getExercisesByStudentAndSession(+studentId, courseId);
    const response = formatExercisesData(exercises);  //ejercicios por sesion con contador de ejercicios
    return response;
}

exports.getGroupExercisesBySkill= async (studentRut) => {
    const studentId = await getStudentIdByRut(studentRut);
    const courseId = await getStudentCourses(studentId)
    const exercises = await getExercisesByStudentAndSession(+studentId, courseId);
    const response = groupExercisesByActivityWithSkill(exercises) //separado segun habilidad mostrando actividades con sus contadores de ejercicios

    return response;
}



