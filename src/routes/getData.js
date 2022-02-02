const router = require('express').Router()
const mysqlConnection = require('../database/database')

router.get('/getstudents', (req, res) => {
    mysqlConnection.query(`
    SELECT student.id as studentId, student.name, student.surname, student.rut, student.genre, school.id as schoolId, school.name as school, school.number, course.level, course.letter
    FROM student
    INNER JOIN course ON student.course_id = course.id
    INNER JOIN school ON course.school_id = school.id;
    
    `, (err, results) => {
        res.send(results)
    })
})

router.get('/getschools', (req, res) => {
    mysqlConnection.query("SELECT * FROM school", (err, results) => {
        res.send(results)
    })
})

module.exports = router;