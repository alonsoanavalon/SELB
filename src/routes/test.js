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

    console.log(data, " data")
    console.log(data[0], "data[0]")


    if (data[0] == undefined) {
        mysqlConnection.query(`INSERT INTO user (id, email) VALUES (${data['id']}, '${data['email']}')`, (err, res) => {
            console.log(res)
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