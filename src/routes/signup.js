const router = require('express').Router()
const authControllers = require('../controllers/authControllers')

/* Vistas */

router.get('/', (req, res) => {

    res.render("signup")

})

router.post('/', authControllers.register)



/* Rutas para controller */


module.exports = router;