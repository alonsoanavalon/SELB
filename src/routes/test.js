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
    
    data.forEach(n => {
        console.log(n)
    })

/*     mysqlConnection.query(`INSERT INTO usuario (id, email) VALUES (${req.body['id']}, '${req.body['email']}')`, (err, res) => {
        console.log(res)
        if (err) throw err; 
 
    }) */

    res.send({
        status:'ok'
    })

   
})

module.exports = router