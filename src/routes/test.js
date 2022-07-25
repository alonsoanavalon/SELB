const router = require('express').Router()
const mysqlConnection = require('../database/database')

router.get('/', (req, res) => {
    mysqlConnection.query("SELECT id, email FROM user", (err, results) => {
        res.send({
            results
        })
    })
    
})

router.post('/', (req, res, next) => {

    let data = req.body

    if (data[0] == undefined) {
        mysqlConnection.query(`INSERT INTO user (id, email) VALUES (${data['id']}, '${data['email']}')`, (err, res) => {

            if (err) throw err; 
        })
    } else {
        data.forEach(element => {
            
            mysqlConnection.query(`INSERT INTO user (id, email) VALUES (${element['id']}, '${element['email']}')`, (err, res) => {
                if (err) throw err; 
            })
        })
    }

    res.send({
        status:'ok'
    })

   
})

module.exports = router