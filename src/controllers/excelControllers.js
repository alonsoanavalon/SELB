const mysqlConnection = require('../database/database')


exports.getChoices = (instrument, study, schools) => {
    new Promise((resolve, reject) => {
    
        let sql = `SELECT student.rut, concat(student.name , " ", student.surname) as Student, concat(course.level , " ", course.letter) as course, concat(user.name, " ", user.surname) as Profe, school.name as Colegio, instrument_list.date as Fecha, choice.value, choice.id FROM choice INNER JOIN instrument_list ON choice.instrument_list_id = instrument_list.id INNER JOIN instrument ON instrument.id = instrument_list.instrument_id INNER JOIN evaluation ON instrument_list.evaluation_id = evaluation.id INNER JOIN user ON user.id = evaluation.user_id INNER JOIN student ON evaluation.student_id = student.id INNER JOIN moment ON moment.id = evaluation.moment_id INNER JOIN study_list ON instrument.id = study_list.instrument_id INNER JOIN course ON student.course_id = course.id INNER JOIN school ON course.school_id = school.id WHERE instrument.id = ${instrument} AND study_list.study_id = ${study} AND school.id IN (${schools}); `

        mysqlConnection.query(sql, (err, response) => {
            if (err) throw err;
            response = JSON.parse(JSON.stringify(response))
            resolve (response)
        })
        
    })
}