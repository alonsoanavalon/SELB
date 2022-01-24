const router = require('express').Router()
const mysqlConnection = require('../database/database')

router.get('/', (req, res) => {
    mysqlConnection.query("SELECT * FROM usuario", (err, results) => {
        console.log(results)
        res.send({
            results
        })
    })
    
})

router.post('/', (req, res, next) => {

    let data = req.body

    console.log(data, " DATAAAAAAAAA")

    if (data.length !== undefined) {

        mysqlConnection.query(`INSERT INTO usuario (id, email) VALUES (${req.body['id']}, '${req.body['email']}')`, (err, res) => {
            console.log(res)
            if (err) throw err; 
     
        })
        
    } else if (data.length >= 2) {
        data.forEach(element => {
            mysqlConnection.query(`INSERT INTO usuario (id, email) VALUES (${element['id']}, '${element['email']}')`, (err, res) => {
                if (err) throw err; 
            })
        })
    }




    res.send({
        status:'ok'
    })

   
})

module.exports = router