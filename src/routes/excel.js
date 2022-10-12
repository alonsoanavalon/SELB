const router = require('express').Router();
const mysqlConnection = require('../database/database')
const excelControllers = require('../controllers/excelControllers')
const createCsvWriter = require('csv-writer').createArrayCsvWriter;

router.post('/', async (req, res) => {

    let instrument = req.body['instrument']
    let moment = req.body['moment']
    let schools = req.body['schools']

    let sql;

    // Este if es porque los primeros 2 momentos sacamos el userId de Evaluation, y desde los otros desde instrument_list
    // Como el userId lo agregamos recientemente a instrument_list, tenemos que realizar queries distintas
    if (moment == 1 || moment == 2) {
        sql = `SELECT 
        student.rut as rut, 
        concat(student.name , " ", student.surname) as alumno, 
        concat(course.level , " ", course.letter) as curso,
        concat(user.name, " ", user.surname) as profesor, 
        school.name as colegio, instrument_list.date as fecha, 
        choice.value,  item.num, choice.id 
        FROM choice  
        INNER JOIN instrument_list ON choice.instrument_list_id = instrument_list.id 
        INNER JOIN instrument ON instrument.id = instrument_list.instrument_id 
        INNER JOIN evaluation ON instrument_list.evaluation_id = evaluation.id
        INNER JOIN user ON user.id = evaluation.user_id 
        INNER JOIN student ON evaluation.student_id = student.id 
        INNER JOIN moment ON moment.id = evaluation.moment_id 
        INNER JOIN study_list ON instrument.id = study_list.instrument_id 
        INNER JOIN course ON student.course_id = course.id 
        INNER JOIN school ON course.school_id = school.id 
        INNER JOIN item ON choice.item_id = item.id 
        WHERE instrument.id = ${instrument} 
        AND evaluation.moment_id = ${moment} 
        AND school.id 
        IN (${schools}); `
    } else {
        sql = `SELECT 
        student.rut as rut, 
        concat(student.name , " ", student.surname) as alumno, 
        concat(course.level , " ", course.letter) as curso,
        concat(user.name, " ", user.surname) as profesor, 
        school.name as colegio, instrument_list.date as fecha, 
        choice.value,  item.num, choice.id 
        FROM choice  
        INNER JOIN instrument_list ON choice.instrument_list_id = instrument_list.id 
        INNER JOIN instrument ON instrument.id = instrument_list.instrument_id 
        INNER JOIN evaluation ON instrument_list.evaluation_id = evaluation.id
        INNER JOIN user ON instrument_list.evaluator_id = user.id
        INNER JOIN student ON evaluation.student_id = student.id 
        INNER JOIN moment ON moment.id = evaluation.moment_id 
        INNER JOIN study_list ON instrument.id = study_list.instrument_id 
        INNER JOIN course ON student.course_id = course.id 
        INNER JOIN school ON course.school_id = school.id 
        INNER JOIN item ON choice.item_id = item.id 
        WHERE instrument.id = ${instrument} 
        AND evaluation.moment_id = ${moment} 
        AND school.id 
        IN (${schools});`
    }

    
    function getDataRows () {


        return new Promise((resolve, reject) => {
            mysqlConnection.query(sql, (err, response) => {
                if (err) throw err;
                response = JSON.parse(JSON.stringify(response))
                resolve (response)
            })
        })

    }

    let rows = await getDataRows()
    let infoHeaders = ['rut', 'alumno', 'curso', 'evaluador', 'colegio', 'fecha'];
    let filteredRows = rows.filter(row => row.rut == rows[0]['rut'])
    let infoChoices = []
    let correctAnswers = { // Respuestas correctas
        1:1,
        2:2,
        3:0,
        4:3,
        5:4,
        6:0,
        7:0,
        8:2,
        9:3,
        10:4,
        11:1,
        12:0,
        13:0,
        14:3,
        15:0,
        16:0,
        17:2,
        18:0,
        19:1,
        20:4,
        21:0,
        22:1,
        23:1,
        24:4,
        25:2,
        26:0
   }
        

    
    
    if (instrument == 4) {
        filteredRows.map(row => {
            infoAnswer = `puntaje_${row.num}`
            infoRow = `pregunta_${row.num}`
            infoChoices.push(infoAnswer)
            infoChoices.push(infoRow)
        })

        infoChoices.push('puntaje_total')
    } else if (instrument == 5){
        let index = 1;
        filteredRows.map(row => {
            if (index % 2 ==! 0) {
                infoRow = `emocion_${row.num}`
                infoChoices.push(infoRow)
            } else {
                infoRow = `reaccion_${row.num}`
                infoChoices.push(infoRow)
            }
            index++

        })
    } else {
        filteredRows.map(row => {
            infoRow = `pregunta_${row.num}`
            infoChoices.push(infoRow)
        })
    }
    

    let info = [...infoHeaders, ...infoChoices]

    let allStudentsRows = []

    function getStudentInfo(rows) {
        let studentRow = []
        let studentCounter = 0
        let previousStudent = undefined;
        rows.forEach(row => {
            currentStudentRut = rows[studentCounter]['rut']
            currentStudent = rows[studentCounter]
            if (previousStudent !== currentStudentRut) {
                studentRow = []
                studentRow.push(currentStudent['rut'])
                studentRow.push(currentStudent['alumno'])
                studentRow.push(currentStudent['curso'])
                studentRow.push(currentStudent['profesor'])
                studentRow.push(currentStudent['colegio'])
                studentRow.push(currentStudent['fecha'])

                if (currentStudent['value'].length == 0) {
                    studentRow.push('0') 
                } else {
                    studentRow.push(currentStudent['value'])
                } 
                allStudentsRows.push(studentRow)
                
            } else {
                if (currentStudent['value'].length == 0) {
                    studentRow.push('0') 
                } else {
                    studentRow.push(currentStudent['value'])
                } 
            }
            studentCounter++
            previousStudent = currentStudentRut;
        })

        let csvData = [];
        csvData.push([...info])
        
        allStudentsRows.forEach(
            row => {
                csvData.push(row);
            }
        )

        res.send(csvData)
        
    }


    function getStudentInfoAces(rows) {

        try {
            let studentRow = []
            let studentCounter = 0
            let previousStudent = undefined;
            let totalPoints = 0
            let choicesLength = 25
            let index = 0
       
            rows.forEach((row) => {
                currentStudentRut = rows[studentCounter]['rut']
                currentStudent = rows[studentCounter]
                if (previousStudent !== currentStudentRut) {
                    totalPoints = 0
                    index = 0
                    studentRow = []
                    studentRow.push(currentStudent['rut'])
                    studentRow.push(currentStudent['alumno'])
                    studentRow.push(currentStudent['curso'])
                    studentRow.push(currentStudent['profesor'])
                    studentRow.push(currentStudent['colegio'])
                    studentRow.push(currentStudent['fecha'])
    
                    if (currentStudent['value'].length == 0) {
                        studentRow.push('0')
                        studentRow.push('0') 
                    } else {
                        if (correctAnswers[row['num']] == row['value']) {
                            studentRow.push('1')
                            studentRow.push(currentStudent['value'])
                            totalPoints++
                        } else {
                            studentRow.push('0')
                            studentRow.push(currentStudent['value'])
                        }
    
                    }
                                        
                } else {
                    if (currentStudent['value'].length == 0) {
                        studentRow.push('0')
                        studentRow.push('0') 
                    } else {
                        if (correctAnswers[row['num']] == row['value']) {
                            studentRow.push('1')
                            studentRow.push(currentStudent['value'])
                            totalPoints++
                        } else {
                            studentRow.push('0')
                            studentRow.push(currentStudent['value'])
                        }
                    } 
                }

                if (index == choicesLength) { // cada vez que terminamos de recorrerlos, sumamos los puntos totales al array de respuestas
                    studentRow.push(JSON.stringify(totalPoints))
                    allStudentsRows.push(studentRow)
                } 
                index++
                studentCounter++
                previousStudent = currentStudentRut;
            })
    
            let csvData = [];
            csvData.push([...info])
            
            allStudentsRows.forEach(
                row => {
                    csvData.push(row);
                }
            )
            res.send(csvData)
            
        } catch (error) {
            throw error.message;
        }
        
    }

    if (instrument == 4) {
        getStudentInfoAces(rows)
    } else {
        getStudentInfo(rows)
    }

    const csvWriter = createCsvWriter({
        header: info,
        path: 'file.csv'
    });
     
    const records = allStudentsRows;
     
    csvWriter.writeRecords(records)      
        .then(() => {
            console.log('....Done');
        });

})


module.exports = router;