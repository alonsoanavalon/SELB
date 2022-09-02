const router = require('express').Router()
const authController = require('../controllers/authControllers')
const usersService = require('./users.service')

router.get('/', authController.isAuthenticated, async (req, res) => {
    const results = await usersService.getAllUsers()
    res.render("all-users", {
        results
    })
})



module.exports = router;