const router = require('express').Router()
const mysqlConnection = require('../database/database')

router.get('/', (req, res) => {
    mysqlConnection.query("SELECT * FROM usuario", (err, results) => {
        res.send({
            results
        })
    })
    
})

router.post('/', (req, res, next) => {

    let data = req.body

    data.forEach(e => {
        console.log(e)
    })
    
/*     data.forEach(element => {
        mysqlConnection.query(`INSERT INTO usuario (id, email) VALUES (${element['id']}, '${element['email']}')`, (err, res) => {
            if (err) throw err; 
        })
    }) */


    res.send({
        status:'ok'
    })


})


module.exports = router