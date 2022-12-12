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
        student.gender as genero,
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
        student.gender as genero,
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
    let infoHeaders = ['rut', 'alumno','genero','curso', 'evaluador', 'colegio', 'fecha'];
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

    let corsiAnswers = {
        2: '6-9',
        3: '3-8',
        4: '2-7-6',
        5: '5-4-3',
        6: '8-2-7-1',
        7: '9-1-4-3',
        8: '1-10-2-8-5',
        9: '10-3-7-5-4',
        10: '8-2-7-6-5-9',
        11: '7-4-1-3-6-10',
        12: '9-2-1-8-5-10-3',
        14: '8-3',
        15: '9-6',
        16: '3-4-5',
        17: '6-7-2',
        18: '3-4-1-9',
        19: '1-7-2-8',
        20: '4-5-7-3-10',
        21: '5-8-2-10-1',
        22: '10-6-3-1-4-7',
        23: '9-5-6-7-2-8',
        24: '4-1-6-5-4-9-2'
    }
        

    
    // ACA añadimos los headers personalizados
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
                infoRow = `conducta_${row.num}`
                infoChoices.push(infoRow)
            }
            index++

        })
    } else if (instrument == 1){
        filteredRows.map(row => {
            infoRow = `pregunta_${row.num}`;
            infoChoices.push(infoRow);
        })
        infoChoices.push('puntaje_total')
    } else if (instrument == 6){
        infoChoices.push('puntaje_total');
        infoChoices.push('intentos_ordenado');
        infoChoices.push('intentos_desordenado');

        filteredRows.map((row)=> {
            if (row.num <= 11) {
                infoRow = `ordenado_${row.num}`;
                infoChoices.push(infoRow);
                infoRow = `respuesta`;
                infoChoices.push(infoRow);
            } else if (row.num <= 22) {
                infoRow = `reversa_${row.num}`;
                infoChoices.push(infoRow);
                infoRow = `respuesta`;
                infoChoices.push(infoRow);
            }

        })
    
    } else {
        filteredRows.map(row => {
            infoRow = `pregunta_${row.num}`
            infoChoices.push(infoRow)
        })
    }
    
    let info = [...infoHeaders, ...infoChoices]
    let allStudentsRows = []

    function getStudentInfoTejas(rows) {

        try {
            let studentRow = []
            let studentCounter = 0
            let previousStudent = undefined;
            let totalPoints = 0
            let choicesLength = 71
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
                    studentRow.push(currentStudent['genero'])
                    studentRow.push(currentStudent['curso'])
                    studentRow.push(currentStudent['profesor'])
                    studentRow.push(currentStudent['colegio'])
                    studentRow.push(currentStudent['fecha'])
    
                    if (currentStudent['value'].length == 0) {
                        studentRow.push('0')
                    } else {
                        if (row['value'] == 1) {
                            studentRow.push(currentStudent['value'])
                            totalPoints++
                        } else {
                            studentRow.push(currentStudent['value'])
                        }
    
                    }
                                        
                } else {
                    if (currentStudent['value'].length == 0) {
                        studentRow.push('0')
                    } else {
                        if (row['value'] == 1) {
                            studentRow.push(currentStudent['value'])
                            totalPoints++
                        } else {
                            studentRow.push(currentStudent['value'])
                        }
                    } 
                }

                if (index > 71) {
                    console.log(index)
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
                studentRow.push(currentStudent['genero'])
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

    function getStudentInfoCalculo(rows) {
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
                studentRow.push(currentStudent['genero'])
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
                
                if (currentStudent['num'] == 18) {
                    if (currentStudent['value'] == 3) {
                        studentRow.push('1') 
                    } else {
                        studentRow.push('0') 
                    }
                } else if (currentStudent['num'] == 19) {
                    if (currentStudent['value'] == 4) {
                        studentRow.push('1') 
                    } else {
                        studentRow.push('0') 
                    }
                } else if (currentStudent['num'] == 20) {
                    if (currentStudent['value'] == 6) {
                        studentRow.push('1') 
                    } else {
                        studentRow.push('0') 
                    }
                }else if (currentStudent['num'] == 21) {
                    if (currentStudent['value'] == 8) {
                        studentRow.push('1') 
                    } else {
                        studentRow.push('0') 
                    }
                }else if (currentStudent['num'] == 22) {
                    if (currentStudent['value'] == 10) {
                        studentRow.push('1') 
                    } else {
                        studentRow.push('0') 
                    }
                }else if (currentStudent['num'] == 23) {
                    if (currentStudent['value'] == 11) {
                        studentRow.push('1') 
                    } else {
                        studentRow.push('0') 
                    }
                }else if (currentStudent['num'] == 24) {
                    if (currentStudent['value'] == 16) {
                        studentRow.push('1') 
                    } else {
                        studentRow.push('0') 
                    }
                }else {
                    if (currentStudent['value'].length == 0) {
                        studentRow.push('0') 
                    } else {
                        studentRow.push(currentStudent['value'])
                    } 
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
                    studentRow.push(currentStudent['genero'])
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


    function getStudentInfoCorsi(rows) {
        let studentRow = []
        let studentCounter = 0
        let previousStudent = undefined;
        let puntaje_total = 0;
        rows.forEach(row => {
            currentStudentRut = rows[studentCounter]['rut']
            currentStudent = rows[studentCounter]
            if (previousStudent !== currentStudentRut) {
                studentRow = []
                studentRow.push(currentStudent['rut'])
                studentRow.push(currentStudent['alumno'])
                studentRow.push(currentStudent['genero'])
                studentRow.push(currentStudent['curso'])
                studentRow.push(currentStudent['profesor'])
                studentRow.push(currentStudent['colegio'])
                studentRow.push(currentStudent['fecha'])
                //agregar intentos
                puntaje_total = 0;

                if (currentStudent['value'].length == 0) {
                    studentRow.push('0') 
                } else {
                    if (row.num === 1) {
                        studentRow.push(currentStudent['value']);
                    } else if (row.num === 13) {
                        //cambiar lugar en el studentRow
                        studentRow.push(currentStudent['value'])
                    } else {
                    //aca tengo que pushear resultado y respuesta
                    if (corsiAnswers[row.num] === row.value) {
                        studentRow.push('1')
                        studentRow.push(currentStudent['value'])
                        puntaje_total++
                    } else {
                        studentRow.push('0')
                        studentRow.push(currentStudent['value'])
                    }
                    }

                } 
                allStudentsRows.push(studentRow)
                
            } else {
                if (row.num === 1) {
                    studentRow.push(currentStudent['value']);
                } else if (row.num === 13) {
                    //cambiar lugar en el studentRow
                    studentRow.splice(8, 0, row.value);
                } else {
                //aca tengo que pushear resultado y respuesta
                if (corsiAnswers[row.num] === row.value) {
                    studentRow.push(currentStudent['value'])
                    studentRow.push('1')
                    puntaje_total++
                } else {
                    studentRow.push(currentStudent['value'])
                    studentRow.push('0')
                }
            }}

            if (row.num === 24) { // cada vez que terminamos de recorrerlos, sumamos los puntos totales al array de respuestas
                studentRow.splice(7, 0, puntaje_total);
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

    if (instrument == 4) {
        getStudentInfoAces(rows);
    } else if (instrument == 1) {
        getStudentInfoTejas(rows);
    }else if (instrument == 2) {
        getStudentInfoCalculo(rows);
    } else if (instrument == 6) {
        getStudentInfoCorsi(rows);
    } else {
        getStudentInfo(rows);
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