const router = require('express').Router()
const mysqlConnection = require('../database/database')



router.get('/students', (req, res) => {
    mysqlConnection.query(`
    SELECT student.id as studentId, student.name, student.surname, student.rut, student.gender, school.id as schoolId, school.name as school, school.number, course.level, course.letter
    FROM student
    INNER JOIN course ON student.course_id = course.id
    INNER JOIN school ON course.school_id = school.id;
    `, (err, results) => {
        if (err) thw
        res.send(results)
    })
})

router.get('/schools', (req, res) => {
    mysqlConnection.query("SELECT * FROM school", (err, results) => {
        res.send(results)
    })
})

router.get('/instruments', (req, res) => {
    mysqlConnection.query("SELECT * FROM instrument", (err, results) => {
        res.send(results)
    })
})

router.get('/items', (req, res) => {
    mysqlConnection.query("SELECT * FROM item", (err, results) => {
        res.send(results)
    })
})

router.get('/instrument/:id', (req, res) => {
    let instrumentId = req.params.id
    mysqlConnection.query(`SELECT item.id as itemId, item_type.name as type, item.title, item.num, answer.alternative, answer.value as answer, picture.src as picture, picture.name as pictureName, audio.src as audio, audio.name as audioName, instrument.id as instrumentId, instrument.name as instrumentName FROM item_type LEFT OUTER JOIN item ON item_type.id = item.item_type_id LEFT OUTER JOIN answer ON answer.item_id = item.id LEFT OUTER JOIN picture ON picture.item_id = item.id LEFT OUTER JOIN audio ON audio.item_id = item.id LEFT OUTER JOIN instrument on item.instrument_id = instrument.id WHERE item.instrument_id = ${instrumentId} ORDER BY num ASC;`, (err, results) => {
        if (err) throw err;
        res.send(results)
    })
})

router.get('/instrumentlist/', (req, res) => {

    let instrumentListId = req.query.instrument
    let userId = req.query.user
    mysqlConnection.query(`SELECT COUNT(*) FROM instrument_list INNER JOIN evaluation ON evaluation.id = instrument_list.evaluation_id WHERE evaluation.user_id = ${userId} AND instrument_list.instrument_id = ${instrumentListId}`, (err, response) => {
        if (err) throw err;
        response = JSON.parse(JSON.stringify(response))
        res.send(response)
    })

})


module.exports = router;