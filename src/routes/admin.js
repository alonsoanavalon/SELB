const router = require('express').Router()
const mysqlConnection = require('../database/database')
const authController = require('../controllers/authControllers')

router.get('/', authController.isAuthenticated, (req, res) => {
    console.log("usuario", req.user)
    res.render("admin", {user:req.user})
})



module.exports = router;