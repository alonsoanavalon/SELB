const router = require('express').Router()
const mysqlConnection = require('../database/database')

router.get('/', (req, res) => {
    mysqlConnection.query("SELECT * FROM usuario", (err, results) => {
        console.log(results)
        res.send(results)
    })
    
})

router.post('/', (req, res, next) => {
    console.log(req.body)
    res.send({
        status:'ok'
    })
   
})

module.exports = router