const router = require('express').Router();
const mysqlConnection = require('../database/database')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const csv = require('csv-parser');


var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, path.join(__dirname,'./uploads/'))    
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const csvFilter = (req, file, cb) => {
    if (file.mimetype.includes('csv')) {
        cb(null, true);
    } else {
        cb("Please upload only CSV files", false);
    }
}

const upload = multer({storage:storage, fileFilter:csvFilter})

router.get('/', (req, res) => {
    res.render("images")
})

router.post('/', (req, res) => {

    console.log(req.file.mimetype)

    if (req.file.mimetype == 'audio/mpeg') {
        const name = req.file.originalname
        const type = req.file.mimetype
        const data = fs.readFileSync(path.join(__dirname, '../public/uploads/'+ req.file.filename))
            
        mysqlConnection.query("INSERT INTO audio SET ?", [{type, name, data}], (err, result) => {
            if (err) return res.status(500).send("Server error")
        })

        res.send("Audio uploaded")
    } else if (req.file.mimetype == 'image/png' || req.file.mimetype == 'image/jpeg' ) {
        const name = req.file.originalname
        const type = req.file.mimetype
        const data = fs.readFileSync(path.join(__dirname, '../public/uploads/'+ req.file.filename))
            
        mysqlConnection.query("INSERT INTO picture SET ?", [{type, name, data}], (err, result) => {
            if (err) return res.status(500).send("Server error")
        })

        res.send("Image uploaded")
    } 

})

router.get('/students', (req, res) => {
    res.render("upload-students")
})

router.post('/students', (req, res) =>{

    let counter = 0;

    // Id necesario para students_courses;
    let studentId = 4500;

    fs.createReadStream(path.join('src', 'data.csv'))
        .pipe(csv())
        .on('data', (row) => {

            // SELB PWA
            
            /* console.log(`INSERT INTO student(course_id, name, surname, rut, gender) VALUES (${row['Curso']}, '${row['Nombre']}', '${row['Apellido']}', '${row['Rut']}', '${row['Sexo']}');`) */

            // SELB AÑEJO

            // Insertar alumnos (1)

            /* console.log(`insert into students (name, last_name, rut, created_at, updated_at, course_id) VALUES ('${row['Nombre']}', '${row['Apellido']}', '${row['Rut']}', current_timestamp, current_timestamp, ${row['Curso']} );`) */

            // Ligarnos a nivel de students_courses; (2)

            // Aca si lo quisiera hacer automático debería primero tener el ID del curso, luego preguntar por todos los estudiantes (una vez ya cargados) y obtener el ID del primero, en base a ese asignarlo a studentId y sumarle 1 hasta que se acaben.


            // Este es de test para ver si todo va bien.
            /* console.log(`insert into student_courses (student_id, course_id, created_at, updated_at, entry) VALUES (${studentId}, ${row['Curso']}, ${row['Nombre']}, current_timestamp, current_timestamp);`) */

            // ESTE ES

            console.log(`insert into student_courses (student_id, course_id, created_at, updated_at, entry) VALUES (${studentId}, ${row['Curso']}, current_timestamp, current_timestamp, current_timestamp);`)
            

    

            studentId++
            counter++
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
    });

    res.send("ok")

});









module.exports = router;