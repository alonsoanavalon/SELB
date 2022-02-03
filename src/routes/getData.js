const router = require('express').Router()
const mysqlConnection = require('../database/database')


const getAllData = (data) => {
    mysqlConnection.query(`SELECT * FROM ${data}`, (err, results) => {
        res.send(results)
    })
}

router.get('/students', (req, res) => {
    mysqlConnection.query(`
    SELECT student.id as studentId, student.name, student.surname, student.rut, student.genre, school.id as schoolId, school.name as school, school.number, course.level, course.letter
    FROM student
    INNER JOIN course ON student.course_id = course.id
    INNER JOIN school ON course.school_id = school.id;
    `, (err, results) => {
        res.send(results)
    })
})

router.get('/schools', (req, res) => {
    getAllData('school')
/*     mysqlConnection.query("SELECT * FROM school", (err, results) => {
        res.send(results)
    }) */
})

router.get('/instruments', (req, res) => {
    getAllData('instruments')
/*     mysqlConnection.query("SELECT * FROM instrument", (err, results) => {
        res.send(results)
    }) */
})

router.get('/items', (req, res) => {
    getAllData('item')
/*     mysqlConnection.query("SELECT * FROM item", (err, results) => {
        res.send(results)
    }) */
})

module.exports = router;