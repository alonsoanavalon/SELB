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

    const getStudentId = (studentRut) => {
        return new Promise((resolve, reject) => {
            let sql = `SELECT id FROM student WHERE rut = '${studentRut}'`
            try {
                mysqlConnection.query(sql, (err, results) => {
                    if (err) throw err;
                    results = JSON.parse(JSON.stringify(results))
                    resolve({
                        id: results[0].id,
                        rut: studentRut
                    })
                })
            } catch (err) {
                if (err) throw err;
            }
        })
    }

    const getStudentIds = async (studentRuts) => {
        if (studentRuts.length > 0) {
            const promisesArray = [];
            studentRuts.forEach((studentRut) => {
                promisesArray.push(getStudentId(studentRut))
            })
            const results = await Promise.all(promisesArray)
            return results;
        } else {
            return [];
        }
    }

router.get('/listparents/:email', (req, res) => {



    const email = req.params.email;

    let sql = `SELECT student_rut
    FROM user_assignation
    INNER JOIN user ON user.id = user_assignation.user_id
    WHERE user.email = '${email}' AND user_assignation.assignation_type_id = 1`

    try {       
        mysqlConnection.query(sql, async (err, results) => {
            if (err) throw err;
            let studentRuts = JSON.parse(JSON.stringify(results))
            studentRuts = studentRuts.map((studentRut) => {
                return studentRut.student_rut
            })
            const studentIdsAndRuts = await getStudentIds(studentRuts);
            res.send(studentIdsAndRuts)
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

router.get('/studies/active', (req, res) => {
    let sql = `SELECT * FROM study where study.active = '1';`
    mysqlConnection.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results)
    })
})

router.get('/instrumentlist/', async (req, res) => {

    let instrumentListId = req.query.instrument 
    let userId = req.query.user

    
    
    /* Por lo que creo el tema del conteo se puede solucionar si tiro 2 querys. 
    la primera query es la que esta aca, pero buscaremos solo en momentos 1 y 2 
    la segunda query será una query que traera el conteo pero haciendo el match con Instrument_list y no evaluation con el USER.

    Luego sumamos ambos count y los devolvemos.



    */  
    let sql;
    const getEvaluatorFromEvaluation = () => {
        return new Promise ((resolve, reject) => {
            try {
                sql = `SELECT COUNT(*) FROM instrument_list INNER JOIN evaluation ON evaluation.id = instrument_list.evaluation_id WHERE evaluation.user_id = ${userId} AND instrument_list.instrument_id = ${instrumentListId} AND evaluation.moment_id IN (1,2)`;
                mysqlConnection.query(sql, (err, response) => {
                    if (err) throw err;
                    response = JSON.parse(JSON.stringify(response))
                    resolve(response[0]['COUNT(*)'])
                })
            } catch (err) {
                if (err) throw err;
            }
        

        })
    }

    const getEvaluatorFromInstrument = () => {
        return new Promise((resolve, reject) => {
            try {
                sql = `SELECT COUNT(*) FROM instrument_list INNER JOIN evaluation ON evaluation.id = instrument_list.evaluation_id WHERE instrument_list.evaluator_id = ${userId} AND instrument_list.instrument_id = ${instrumentListId} AND evaluation.moment_id NOT IN (1,2)`
                mysqlConnection.query(sql, (err, response) => {
                    if (err) throw err;
                    response = JSON.parse(JSON.stringify(response))
                    resolve(response[0]['COUNT(*)'])
                })
            } catch (err) {
                if (err) throw err;
            }
        })
    }
 
    let evaluationCount = await getEvaluatorFromEvaluation()
    let instrumentCount = await getEvaluatorFromInstrument()
    let totalCount = evaluationCount + instrumentCount

    res.send(
        [{"COUNT(*)":totalCount}]
    )



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