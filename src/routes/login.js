const router = require('express').Router();
const mysqlConnection = require('../database/database')

router.get('/', (req, res) => {

    console.log(req.query['email'])

    const user = {
        email : req.query['email'],
        clave : req.query['clave']
    }

    mysqlConnection.query(`SELECT id, email FROM usuario WHERE email = '${user.email}' AND clave = '${user.clave}'`, (err, results, query) => {
        if (err) throw err;
        
        if (results[0]) {
           
            res.send({
                status:true,
                id:results[0]['id'],
                email:results[0]['email']
            })

        } else {
            res.send({
                status:false
            })
        }


    })

})

module.exports = router;