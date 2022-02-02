const router = require('express').Router();
const mysqlConnection = require('../database/database')

router.get('/', (req, res) => {

    console.log(req.query['email'], "QUERY")

    const user = {
        email : req.query['email'],
        password : req.query['password']
    }

    mysqlConnection.query(`SELECT id, email, name, surname FROM user WHERE email = '${user.email}' AND password = '${user.password}'`, (err, results, query) => {
        if (err) throw err;

        
        console.log(results, "ACAAAAAA")
        console.log(query, " QUERY")
        
        if (results[0]) {

            res.send({
                status:true,
                id:results[0]['id'],
                email:results[0]['email'],
                name:results[0]['name'],
                surname:results[0]['surname']
            
            })

        } else {
            res.send({
                status:false
            })
        }


    })

})

module.exports = router;