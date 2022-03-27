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

    fs.createReadStream(path.join('src', 'data.csv'))
        .pipe(csv())
        .on('data', (row) => {
            
            console.log(`INSERT INTO student(course_id, name, surname, rut, gender) VALUES (${row['Curso']}, '${row['Nombre']}', '${row['Apellido']}', '${row['Rut']}', '${row['Sexo']}');`)
            counter++
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
    });

    res.send("ok")

});









module.exports = router;