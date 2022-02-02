const router = require('express').Router();
const mysqlConnection = require('../database/database')
const fs = require('fs')
const path = require('path')

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




    /*  */

/*     if (req.file.fieldname == "image") {
        const name = req.file.originalname
        const type = req.file.mimetype
        const data = fs.readFileSync(path.join(__dirname, '../public/uploads/images/'+ req.file.filename))
        
        console.log(req.file.fieldname)
    
        mysqlConnection.query("INSERT INTO picture SET ?", [{type, name, data}], (err, result) => {
            if (err) return res.status(500).send("Server error")
        })
        res.send("ok")
    } */


})


module.exports = router;