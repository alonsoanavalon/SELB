const router = require('express').Router();
const mysqlConnection = require('../database/database')
const excelControllers = require('../controllers/excelControllers')
const createCsvWriter = require('csv-writer').createArrayCsvWriter;

router.post('/', async (req, res) => {

    let instrument = req.body['instrument']
    let moment = req.body['moment']
    let schools = req.body['schools']
    let sql = `SELECT student.rut as rut, concat(student.name , " ", student.surname) as alumno, concat(course.level , " ", course.letter) as curso,concat(user.name, " ", user.surname) as profesor, school.name as colegio, instrument_list.date as fecha, choice.value,  item.num, choice.id FROM choice  INNER JOIN instrument_list ON choice.instrument_list_id = instrument_list.id INNER JOIN instrument ON instrument.id = instrument_list.instrument_id INNER JOIN evaluation ON instrument_list.evaluation_id = evaluation.id INNER JOIN user ON user.id = evaluation.user_id INNER JOIN student ON evaluation.student_id = student.id INNER JOIN moment ON moment.id = evaluation.moment_id INNER JOIN study_list ON instrument.id = study_list.instrument_id INNER JOIN course ON student.course_id = course.id INNER JOIN school ON course.school_id = school.id INNER JOIN item ON choice.item_id = item.id WHERE instrument.id = ${instrument} AND evaluation.moment_id = ${moment} AND school.id IN (${schools}); `
    
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
    let infoHeaders = ['rut', 'alumno', 'curso', 'profesor', 'colegio', 'fecha'];
    let filteredRows = rows.filter(row => row.rut == rows[0]['rut'])
    let infoChoices = [] 
    
    filteredRows.map(row => {
        infoRow = `pregunta_${row.num}`
        infoChoices.push(infoRow)
    })

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
                studentRow.push(currentStudent['value'])
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

    getStudentInfo(rows)

    const csvWriter = createCsvWriter({
        header: info,
        path: 'file.csv'
    });
     
    const records = allStudentsRows;
     
    csvWriter.writeRecords(records)      
        .then(() => {
            console.log('...Done');
        });

})


module.exports = router;