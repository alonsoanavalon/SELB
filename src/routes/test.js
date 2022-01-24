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

    console.log(data, " data")
    console.log(data[0], "data[0]")



    
/*     mysqlConnection.query(`INSERT INTO usuario (id, email) VALUES (${req.body['id']}, '${req.body['email']}')`, (err, res) => {
        console.log(res)
        if (err) throw err; 
 
    }) */

/*     if (data.length !== undefined) {


        
    } else if (data.length >= 2) {
        data.forEach(element => {
            mysqlConnection.query(`INSERT INTO usuario (id, email) VALUES (${element['id']}, '${element['email']}')`, (err, res) => {
                if (err) throw err; 
            })
        })
    } */




    res.send({
        status:'ok'
    })

   
})

module.exports = router