const router = require('express').Router();
const mysqlConnection = require('../database/database')

router.get('/', (req, res) => {

    console.log(req.query['email'])

    const user = {
        email : req.query['email'],
        clave : req.query['clave']
    }

    mysqlConnection.query(`SELECT * FROM usuario WHERE email = '${user.email}' AND clave = '${user.clave}'`, (err, results, query) => {
        if (err) throw err;
        console.log(results, " resultados")
        console.log("Dentro")
    })

    res.send({
        status:"ok"
    })
})

module.exports = router;