const router = require('express').Router()
const mysqlConnection = require('../database/database')



router.get('/students', (req, res) => {
    mysqlConnection.query(`
    SELECT student.id as studentId, student.name, student.surname, student.rut, student.gender, school.id as schoolId, school.name as school, school.number, course.level, course.letter, course.id as courseId
    FROM student
    INNER JOIN course ON student.course_id = course.id
    INNER JOIN school ON course.school_id = school.id;
    `, (err, results) => {
        if (err) throw err;
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

router.get('/sdq', (req, res) => {

    let sql = `SELECT item.id as itemId, item.title, item.num, instrument.id as instrumentId, instrument.name as instrumentName FROM item INNER JOIN instrument ON instrument.id = item.instrument_id WHERE instrument.id = 3`

    try {       
        mysqlConnection.query(sql, (err, results) => {
            if (err) throw err;
            results = JSON.parse(JSON.stringify(results))
            res.send(results)
        })
    } catch (err) {
        if (err) throw err;
    }

})

router.get('/studies', (req, res) => {
    let sql = `SELECT * FROM study`
    mysqlConnection.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results)
    })
})

router.get('/instrumentlist/', (req, res) => {

    let instrumentListId = req.query.instrument 
    let userId = req.query.user

    try {
        mysqlConnection.query(`SELECT COUNT(*) FROM instrument_list INNER JOIN evaluation ON evaluation.id = instrument_list.evaluation_id WHERE evaluation.user_id = ${userId} AND instrument_list.instrument_id = ${instrumentListId}`, (err, response) => {
            if (err) throw err;
            response = JSON.parse(JSON.stringify(response))
            res.send(response)
        })
    } catch (err) {
        if (err) throw err;
    }


})

router.get('/courses', (req, res) => {

    let sql = `SELECT school.id as school, school.name as schoolName, course.id as course, CONCAT(course.level, " ", course.letter) as courseName FROM course INNER JOIN school ON course.school_id = school.id;`

    try {
        mysqlConnection.query(sql, (err, results) => {
            if (err) throw err;
            response = JSON.parse(JSON.stringify(results))
            res.send(response)
        })
    } catch (err) {
        if (err) throw err;
    }
})


module.exports = router;