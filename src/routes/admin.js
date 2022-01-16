const router = require('express').Router()
const mysqlConnection = require('../database/database')
const authController = require('../controllers/authControllers')
const instrumentControllers = require('../controllers/instrumentControllers')

router.get('/', authController.isAuthenticated, (req, res) => {
    console.log("usuario", req.user)
    res.render("admin", {user:req.user})
})

router.get('/firstInstrument', (req, res) => {
    res.render("firstInstrument")
})

router.post('/firstInstrument', authController.isAuthenticated, instrumentControllers.saveDataFromInstrument)



module.exports = router;