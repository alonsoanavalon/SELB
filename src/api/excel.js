const router = require('express').Router();
const mysqlConnection = require('../database/database')
const studentsService = require('../admin/students/students.service')
const createCsvWriter = require('csv-writer').createArrayCsvWriter;

function getAllMissingStudentsData(allStudentsRows, allStudentsInfo, headers) {
    const records = allStudentsRows;
    const completedStudents = allStudentsRows.map((studentRow) => studentRow[0])
    const allStudents = allStudentsInfo.map((student) => student.rut)
    const missingStudents = allStudents.filter((element) => !completedStudents.includes(element));
    const missingStudentsData = missingStudents.map((missingStudent) => {
        const missingData = allStudentsInfo.find((element) => element.rut == missingStudent);
        const completedStudentData = [missingData.rut, missingData.alumno, missingData.gender, `${missingData.level} ${missingData.course}`, "", missingData.escuela, ""]
        let testLengthData ;
        if (allStudentsRows[0]) {
            testLengthData = allStudentsRows[0].length - completedStudentData.length;
        } else {}
        testLengthData = completedStudentData.length;
        for (var i = 0; i < testLengthData; i++) {
            completedStudentData.push('')
        }
        return completedStudentData
    })
    const allRecords = [...allStudentsRows, ...missingStudentsData];
    let sortedRecords = allRecords.sort((a, b) => {
        const firstA = a[0];
        const firstB = b[0];
        if (typeof firstA === 'string' && typeof firstB === 'string') {
            return firstA.localeCompare(firstB);
        }
        return firstA - firstB;
    });

    const orderedRecords = sortedRecords.reverse();
    orderedRecords.unshift(headers)
    return orderedRecords;
}

//1. DATA: Basicamente esta cosa lo que hace es primero traerse toda la data dependiendo el momento
//2. HEADERS: Luego lo que hace es dado el primer elemento, saca todos los HEADERS
//3. ROWS: luego dependiendo del instrumento, hay una forma para calcular puntajes y setear la row

router.post('/', async (req, res) => {
    let instrument = req.body['instrument']
    let moment = req.body['moment']
    let schools = req.body['schools']
    let studyId = req.body['studyId']
    let countExamples = req.body['countExamples'];

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
            choice.value,  item.num, item.title, choice.id, 
            choice.alternative as alternative, 
            choice.text as text, choice.time as time,
            choice.options as options,
            study.id as study   
            FROM choice  
            INNER JOIN instrument_list ON choice.instrument_list_id = instrument_list.id 
            INNER JOIN instrument ON instrument.id = instrument_list.instrument_id 
            INNER JOIN evaluation ON instrument_list.evaluation_id = evaluation.id
            INNER JOIN user ON instrument_list.evaluator_id = user.id
            INNER JOIN student ON evaluation.student_id = student.id 
            INNER JOIN moment ON moment.id = evaluation.moment_id 
            INNER JOIN study on study.id = moment.study_id
            INNER JOIN course ON student.course_id = course.id 
            INNER JOIN school ON course.school_id = school.id 
            INNER JOIN item ON choice.item_id = item.id 
            WHERE instrument.id = ${instrument} 
            AND evaluation.moment_id = ${moment} 
            AND study.id = ${studyId}
            AND school.id 
            IN (${schools});`
        }


    function getDataRows() {
        return new Promise((resolve, reject) => {
            mysqlConnection.query(sql, (err, response) => {
                if (err) throw err;
                response = JSON.parse(JSON.stringify(response))
                resolve(response)
            })
        })

    }

    let rows = await getDataRows()

    let infoHeaders = ['rut', 'alumno', 'genero', 'curso', 'evaluador', 'colegio', 'fecha'];
    let filteredRows = rows.filter(row => row.rut == rows[0]['rut'])
    let infoChoices = []
    let correctAnswers = { // Respuestas correctas
        1: 1,
        2: 2,
        3: 0,
        4: 3,
        5: 4,
        6: 0,
        7: 0,
        8: 2,
        9: 3,
        10: 4,
        11: 1,
        12: 0,
        13: 0,
        14: 3,
        15: 0,
        16: 0,
        17: 2,
        18: 0,
        19: 1,
        20: 4,
        21: 0,
        22: 1,
        23: 3,
        24: 4,
        25: 2,
        26: 0
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
    } else if (instrument == 5) {
        let index = 1;
        filteredRows.map(row => {
            if (index % 2 == !0) {
                infoRow = `emocion_${row.num}`
                infoChoices.push(infoRow)
            } else {
                infoRow = `conducta_${row.num}`
                infoChoices.push(infoRow)
            }
            index++

        })
        infoChoices.push('puntaje_total')
    } else if (instrument == 1) {
        filteredRows.map(row => {
            infoRow = `pregunta_${row.num}`;
            infoChoices.push(infoRow);
        })
        infoChoices.push('puntaje_total')
    } else if (instrument == 6) {
        infoChoices.push('puntaje_total');
        infoChoices.push('intentos_ordenado');
        infoChoices.push('intentos_desordenado');

        filteredRows.map((row) => {
            if (row.num === 1 || row.num === 2 || row.num === 13 || row.num === 14) {
                infoRow = `ordenado_${row.num}_ejemplo`;
                infoChoices.push(infoRow);
                infoRow = `respuesta`;
                infoChoices.push(infoRow);
            } else {
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
            }
        })

    } else if (instrument == 7) {
        infoRow = `hnf_total`;
        infoChoices.push(infoRow)
        infoRow = `score_hearts`;
        infoChoices.push(infoRow)
        infoRow = `time_seconds_hearts`;
        infoChoices.push(infoRow)
        infoRow = `score_flowers`;
        infoChoices.push(infoRow)
        infoRow = `time_seconds_flowers`;
        infoChoices.push(infoRow)
        infoRow = `score_heart_flowers`;
        infoChoices.push(infoRow)
        infoRow = `time_seconds_heart_flowers`;
        infoChoices.push(infoRow)
        infoRow = `total_time`;
        infoChoices.push(infoRow)
    } else if (instrument == 8) {
        filteredRows.map(row => {
            infoRow = `${row.title}_score`
            infoChoices.push(infoRow)
            infoRow = `${row.title}_answer`
            infoChoices.push(infoRow)
        })

        infoRow = `total_points`
        infoChoices.push(infoRow)
    } else if (instrument == 9) {
        for (let i = 1; i < 13; i++) {
            infoRow = `first_touch_timer_item_${i}`;
            infoChoices.push(infoRow)
            infoRow = `play_time_item_${i}`;
            infoChoices.push(infoRow)
            infoRow = `total_time_item_${i}`;
            infoChoices.push(infoRow)
            infoRow = `movements_item_${i}`;
            infoChoices.push(infoRow)
            infoRow = `resets_item_${i}`;
            infoChoices.push(infoRow)
            infoRow = `time_penalization_item_${i}`;
            infoChoices.push(infoRow)
            infoRow = `correct_order_item_${i}`;
            infoChoices.push(infoRow)
        }

    }else {
        filteredRows.map(row => {
            infoRow = `pregunta_${row.num}`
            infoChoices.push(infoRow)
        })
    }

    //esta info es realmente los headers de toda la weaita
    let info = [...infoHeaders, ...infoChoices]
    let allStudentsRows = []

    async function getStudentInfoTejas(rows) {

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
                    const fechaTest = new Date(currentStudent['fecha']);
                    const fechaParseada = `${fechaTest.getDate()}/${fechaTest.getMonth() + 1}/${fechaTest.getFullYear()}`
                    studentRow.push(currentStudent['rut'])
                    studentRow.push(currentStudent['alumno'])
                    studentRow.push(currentStudent['genero'])
                    studentRow.push(currentStudent['curso'])
                    studentRow.push(currentStudent['profesor'])
                    studentRow.push(currentStudent['colegio'])
                    studentRow.push(fechaParseada)

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
            const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
            const parsedData = getAllMissingStudentsData(allStudentsRows, allStudentsInfo, [...info])
            res.send(parsedData)

        } catch (error) {
            throw error.message;
        }
    }

    async function getStudentInfoFono(rows) {
        let studentRow = []
        let studentCounter = 0
        let previousStudent = undefined;
        let totalPoints = 0;
        let index = 0
        rows.forEach((row, key) => {
            currentStudentRut = rows[studentCounter]['rut']
            currentStudent = rows[studentCounter]
            if (previousStudent !== currentStudentRut) {
                studentRow = []
                totalPoints = 0;
                index = 0;
                const fechaTest = new Date(currentStudent['fecha']);
                const fechaParseada = `${fechaTest.getDate()}/${fechaTest.getMonth() + 1}/${fechaTest.getFullYear()}`
                studentRow.push(currentStudent['rut'])
                studentRow.push(currentStudent['alumno'])
                studentRow.push(currentStudent['genero'])
                studentRow.push(currentStudent['curso'])
                studentRow.push(currentStudent['profesor'])
                studentRow.push(currentStudent['colegio'])
                studentRow.push(fechaParseada)

                if (currentStudent['value'].length == 0) {
                    studentRow.push('0')
                    studentRow.push('')
                } else {
                    studentRow.push(currentStudent['value'])
                    studentRow.push(currentStudent['text'])
                }
                allStudentsRows.push(studentRow)
            } else {
                if (currentStudent['value'].length == 0) {
                    studentRow.push('0')
                    studentRow.push('')
                } else {
                    studentRow.push(currentStudent['value'])
                    studentRow.push(currentStudent['text'])
                }
            }
            if (currentStudent['value'] > 0) {
                totalPoints = parseInt(totalPoints) + parseInt(currentStudent['value']);
            }
            if (index === 23) {
                studentRow.push(totalPoints)
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
        const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
        const parsedData = getAllMissingStudentsData(allStudentsRows, allStudentsInfo, [...info])
        res.send(parsedData)

    }

    async function getStudentInfoCalculo(rows) {
        let studentRow = []
        let studentCounter = 0
        let previousStudent = undefined;
        rows.forEach(row => {
            currentStudentRut = rows[studentCounter]['rut']
            currentStudent = rows[studentCounter]
            if (previousStudent !== currentStudentRut) {
                studentRow = []
                const fechaTest = new Date(currentStudent['fecha']);
                const fechaParseada = `${fechaTest.getDate()}/${fechaTest.getMonth() + 1}/${fechaTest.getFullYear()}`
                studentRow.push(currentStudent['rut'])
                studentRow.push(currentStudent['alumno'])
                studentRow.push(currentStudent['genero'])
                studentRow.push(currentStudent['curso'])
                studentRow.push(currentStudent['profesor'])
                studentRow.push(currentStudent['colegio'])
                studentRow.push(fechaParseada)

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
                } else if (currentStudent['num'] == 21) {
                    if (currentStudent['value'] == 8) {
                        studentRow.push('1')
                    } else {
                        studentRow.push('0')
                    }
                } else if (currentStudent['num'] == 22) {
                    if (currentStudent['value'] == 10) {
                        studentRow.push('1')
                    } else {
                        studentRow.push('0')
                    }
                } else if (currentStudent['num'] == 23) {
                    if (currentStudent['value'] == 11) {
                        studentRow.push('1')
                    } else {
                        studentRow.push('0')
                    }
                } else if (currentStudent['num'] == 24) {
                    if (currentStudent['value'] == 16) {
                        studentRow.push('1')
                    } else {
                        studentRow.push('0')
                    }
                } else {
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
        const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
        const parsedData = getAllMissingStudentsData(allStudentsRows, allStudentsInfo, [...info])
        res.send(parsedData)
    }

    async function getStudentInfoAces(rows) {
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
                    const fechaTest = new Date(currentStudent['fecha']);
                    const fechaParseada = `${fechaTest.getDate()}/${fechaTest.getMonth() + 1}/${fechaTest.getFullYear()}`
                    studentRow.push(currentStudent['rut'])
                    studentRow.push(currentStudent['alumno'])
                    studentRow.push(currentStudent['genero'])
                    studentRow.push(currentStudent['curso'])
                    studentRow.push(currentStudent['profesor'])
                    studentRow.push(currentStudent['colegio'])
                    studentRow.push(fechaParseada)

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
            const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
            const parsedData = getAllMissingStudentsData(allStudentsRows, allStudentsInfo, [...info])
            res.send(parsedData)
        } catch (error) {
            throw error.message;
        }
    }

    async function getStudentInfoTorre(rows) {
        try {
            let studentRow = [];
            let studentCounter = 0;
            let previousStudent = undefined;
            let index = 0;
            
            rows.forEach((row) => {
                const results = row.options ? JSON.parse(row.options) : {};
                const currentStudentRut = row['rut'];
                
                if (previousStudent !== currentStudentRut) {
                    if (studentRow.length > 0) {
                        // Adding the previous student's row if it exists
                        allStudentsRows.push(studentRow);
                    }
                    studentRow = [];
                    const fechaTest = new Date(row['fecha']);
                    const fechaParseada = `${fechaTest.getDate()}/${fechaTest.getMonth() + 1}/${fechaTest.getFullYear()}`;
                    studentRow.push(row['rut']);
                    studentRow.push(row['alumno']);
                    studentRow.push(row['genero']);
                    studentRow.push(row['curso']);
                    studentRow.push(row['profesor']);
                    studentRow.push(row['colegio']);
                    studentRow.push(fechaParseada);
                }
                
                studentRow.push(results['firstTouchTimer'] || 0);
                studentRow.push(results['playTime'] || 0);
                studentRow.push(results['time'] || 0);
                studentRow.push(results['tries'] || 0);
                studentRow.push(results['resets'] || 0);
                studentRow.push(results['timePenalization'] || 0);
                studentRow.push(results['correctOrder'] ? 1 : 0);
                
                previousStudent = currentStudentRut;
                studentCounter++;
            });
    
            // Add the last student's row
            if (studentRow.length > 0) {
                allStudentsRows.push(studentRow);
            }
    
            let csvData = [];
            csvData.push([...info]);
    
            allStudentsRows.forEach(row => {
                csvData.push(row);
            });
    
            const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
            const parsedData = getAllMissingStudentsData(allStudentsRows, allStudentsInfo, [...info]);
            res.send(parsedData);
        } catch (error) {
            throw error.message;
        }
    }
    
    
    
    


    async function getStudentInfoCorsi(rows, inputCountExamples = true) {
        let studentRow = []
        let studentCounter = 0
        let previousStudent = undefined;
        let puntaje_total = 0;
        rows.forEach(row => {
            currentStudentRut = rows[studentCounter]['rut']
            currentStudent = rows[studentCounter]
            if (previousStudent !== currentStudentRut) {
                studentRow = []
                const fechaTest = new Date(currentStudent['fecha']);
                const fechaParseada = `${fechaTest.getDate()}/${fechaTest.getMonth() + 1}/${fechaTest.getFullYear()}`
                studentRow.push(currentStudent['rut'])
                studentRow.push(currentStudent['alumno'])
                studentRow.push(currentStudent['genero'])
                studentRow.push(currentStudent['curso'])
                studentRow.push(currentStudent['profesor'])
                studentRow.push(currentStudent['colegio'])
                studentRow.push(fechaParseada)
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
                    if (row.num === 14 || row.num === 15 || row.num === 2 || row.num === 3) {
                        if (corsiAnswers[row.num] === row.value) {
                            studentRow.push(currentStudent['value'])
                            studentRow.push('1')
                            if (inputCountExamples) {
                                puntaje_total++
                            }
                        } else {
                            studentRow.push(currentStudent['value'])
                            studentRow.push('0')
                        }
                    } else {
                        if (corsiAnswers[row.num] === row.value) {
                            studentRow.push(currentStudent['value'])
                            studentRow.push('1')
                            puntaje_total++
                        } else {
                            studentRow.push(currentStudent['value'])
                            studentRow.push('0')
                        }
                    }

                }
            }

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

        const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
        const parsedData = getAllMissingStudentsData(allStudentsRows, allStudentsInfo, [...info])
        res.send(parsedData)


    }


    async function getStudentInfo(rows) {
        debugger;
        let studentRow = []
        let studentCounter = 0
        let previousStudent = undefined;
        rows.forEach(row => {
            if (row.rut =='20728918-3') {
                if (row.options) {
                    //de aca sacare todo lo ultimo que me pidieron y debo mostrarlo, resets, penalizacion, etc. pero solo para el id 9 que es torre de londres
                    console.log(JSON.parse(row.options))
                }
            }
     
            currentStudentRut = rows[studentCounter]['rut']
            currentStudent = rows[studentCounter]
            if (previousStudent !== currentStudentRut) {
                studentRow = []
                const fechaTest = new Date(currentStudent['fecha']);
                const fechaParseada = `${fechaTest.getDate()}/${fechaTest.getMonth() + 1}/${fechaTest.getFullYear()}`
                studentRow.push(currentStudent['rut'])
                studentRow.push(currentStudent['alumno'])
                studentRow.push(currentStudent['genero'])
                studentRow.push(currentStudent['curso'])
                studentRow.push(currentStudent['profesor'])
                studentRow.push(currentStudent['colegio'])
                studentRow.push(fechaParseada)

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

        const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
        const parsedData = getAllMissingStudentsData(allStudentsRows, allStudentsInfo, [...info])
        res.send(parsedData)


    }

    async function getStudentInfoWally(rows) {
        debugger;
        let studentRow = []
        let studentCounter = 0
        let previousStudent = undefined;
        rows.forEach(row => {
            if (row.rut =='20728918-3') {
                if (row.options) {
                    //de aca sacare todo lo ultimo que me pidieron y debo mostrarlo, resets, penalizacion, etc. pero solo para el id 9 que es torre de londres
                    console.log(JSON.parse(row.options))
                }
            }
     
            currentStudentRut = rows[studentCounter]['rut']
            currentStudent = rows[studentCounter]
            if (previousStudent !== currentStudentRut) {
                studentRow = []
                const fechaTest = new Date(currentStudent['fecha']);
                const fechaParseada = `${fechaTest.getDate()}/${fechaTest.getMonth() + 1}/${fechaTest.getFullYear()}`
                studentRow.push(currentStudent['rut'])
                studentRow.push(currentStudent['alumno'])
                studentRow.push(currentStudent['genero'])
                studentRow.push(currentStudent['curso'])
                studentRow.push(currentStudent['profesor'])
                studentRow.push(currentStudent['colegio'])
                studentRow.push(fechaParseada)

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

        const allStudentsClone = JSON.parse(JSON.stringify(allStudentsRows));

        const allStudentsRowsWithTotalPoints = allStudentsClone.map((row) => {
            const points = row.slice(7);
            let totalPoints = 0;
            points.forEach((point, key) => {
                position = key + 1;
                if (position % 2 == 0) {   
                    if (point == 1){
                        totalPoints = totalPoints + parseInt(point);

                    } 
                }
            })

            row.push(totalPoints);
            return row;
        })

        allStudentsRowsWithTotalPoints.forEach(
            row => {
                csvData.push(row);
            }
        )

        const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
        const parsedData = getAllMissingStudentsData(allStudentsRowsWithTotalPoints, allStudentsInfo, [...info])
        res.send(parsedData)


    }

    async function getStudentInfoHNF(rows) {
        let studentRow = []
        let studentAnswers = [];
        let studentCounter = 0
        let previousStudent = undefined;
        let heartTotal = 0;
        let flowerTotal = 0;
        let HNFTotal = 0;
        rows.forEach(row => {
            currentStudentRut = rows[studentCounter]['rut']
            currentStudent = rows[studentCounter]
            if (previousStudent !== currentStudentRut) {

                exampleHeartTotal = 0;
                exampleFlowersTotal = 0;
                heartTotal = 0;
                flowerTotal = 0;
                HNFTotal = 0;

                if (studentAnswers.length > 0) {

                    let score_hearts = 0;
                    let time_seconds_hearts = 0;
                    let score_flowers = 0;
                    let time_seconds_flowers = 0;
                    let score_hearts_flowers = 0;
                    let time_seconds_hearts_flowers = 0;


                    studentAnswers.forEach((answer) => {

                        if (answer.item > 6 && answer.item < 19) {
                            score_hearts = score_hearts + parseFloat(answer.value)
                            time_seconds_hearts = time_seconds_hearts + parseFloat(answer.time)
                            heartTotal++
                        } else if (answer.item >= 25 && answer.item <= 36) {
                            score_flowers = score_flowers + parseFloat(answer.value)
                            time_seconds_flowers = time_seconds_hearts + parseFloat(answer.time)
                            flowerTotal++
                        } else if (answer.item >= 37) {
                            score_hearts_flowers = score_hearts_flowers + parseInt(answer.value);
                            time_seconds_hearts_flowers = time_seconds_hearts_flowers + parseFloat(answer.time)
                            HNFTotal++
                        }
                    })

                    //Calculamos cuandtos items le falto contestar y por cada item multiplicamos por 2, es decir que si le faltan 2 respuestas son 4 segundos, si le faltan 7 respuestas son 14 segundos.
                    const notSelectedHeartTime = (12 - heartTotal) * 2;
                    const notSelectedFlowerTime = (12 - flowerTotal) * 2;
                    const notSelectedHNFTime = (33 - HNFTotal) * 2;

                    time_seconds_hearts = time_seconds_hearts + notSelectedHeartTime;
                    time_seconds_flowers = time_seconds_flowers + notSelectedFlowerTime;
                    time_seconds_hearts_flowers = time_seconds_hearts_flowers + notSelectedHNFTime;

                    let hnfTotal = score_hearts + score_flowers + score_hearts_flowers;
                    let total_time = time_seconds_hearts + time_seconds_flowers + time_seconds_hearts_flowers;

                    studentRow.push(hnfTotal)
                    studentRow.push(score_hearts)
                    studentRow.push(time_seconds_hearts)
                    studentRow.push(score_flowers)
                    studentRow.push(time_seconds_flowers)
                    studentRow.push(score_hearts_flowers)
                    studentRow.push(time_seconds_hearts_flowers)
                    studentRow.push(total_time)

                    allStudentsRows.push(studentRow)

                }

                studentRow = []
                studentAnswers = []
                const fechaTest = new Date(currentStudent['fecha']);
                const fechaParseada = `${fechaTest.getDate()}/${fechaTest.getMonth() + 1}/${fechaTest.getFullYear()}`
                studentRow.push(currentStudent['rut'])
                studentRow.push(currentStudent['alumno'])
                studentRow.push(currentStudent['genero'])
                studentRow.push(currentStudent['curso'])
                studentRow.push(currentStudent['profesor'])
                studentRow.push(currentStudent['colegio'])
                studentRow.push(fechaParseada)


                studentAnswers.push({
                    item: row.num,
                    value: row.value,
                    time: row.time
                })


            } else {

                studentAnswers.push({
                    item: row.num,
                    value: row.value,
                    time: row.time
                })
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

        const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
        const parsedData = getAllMissingStudentsData(allStudentsRows, allStudentsInfo, [...info])
        res.send(parsedData)


    }

    if (instrument == 4) {
        getStudentInfoAces(rows);
    } else if (instrument == 1) {
        getStudentInfoTejas(rows);
    } else if (instrument == 2) {
        getStudentInfoCalculo(rows);
    } else if (instrument == 6) {
            getStudentInfoCorsi(rows, countExamples);
    } else if (instrument == 7) {
        //Solo este test necesita 1 valor mas para iterar... se me complica en la logica interna de la funcion asi que SE que es horrible solucion, pero le añadire una fila mas para q pueda sacarlas todas y esta fila sea la afectada q no salga.
        rows.push({ rut: '', alumno: '', curso: '', profesor: '', genero: '', "id": '', "num": '', "value": '' }
        )
        getStudentInfoHNF(rows);
    } else if (instrument == 8) {
        getStudentInfoFono(rows);
    }  else if (instrument == 5) {
        getStudentInfoWally(rows);
    } else if (instrument == 9) {
        getStudentInfoTorre(rows)
    }else {
        getStudentInfo(rows);
    }

    const csvWriter = createCsvWriter({
        header: info,
        path: 'file.csv'
    });


    const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
    const records = allStudentsRows;
    const completedStudents = records.map((studentRow) => studentRow[0])
    const allStudents = allStudentsInfo.map((student) => student.rut)
    const missingStudents = allStudents.filter((element) => !completedStudents.includes(element));

    const missingStudentsData = missingStudents.map((missingStudent) => {
        const missingData = allStudentsInfo.find((element) => element.rut == missingStudent);
        const completedStudentData = [missingData.rut, missingData.alumno, missingData.gender, `${missingData.level} ${missingData.course}`, "", missingData.escuela, ""]
        let testLengthData ;
        if (allStudentsRows[0]) {
            testLengthData = allStudentsRows[0].length - completedStudentData.length;
        } else {}
        testLengthData = completedStudentData.length;
        for (var i = 0; i < testLengthData; i++) {
            completedStudentData.push('')
        }
        return completedStudentData
    })

    const allRecords = [...records, ...missingStudentsData];
    let sortedRecords = allRecords.sort((a, b) => {
        const firstA = a[0];
        const firstB = b[0];
        if (typeof firstA === 'string' && typeof firstB === 'string') {
            return firstA.localeCompare(firstB);
        }
        return firstA - firstB;
    });

    const orderedRecords = sortedRecords.reverse();



    csvWriter.writeRecords(orderedRecords)
        .then(() => {
            console.log('....Done');
        });

})


module.exports = router;