const router = require('express').Router()
const authController = require('../auth/auth.controller')

router.get('/', authController.isAuthenticated, (req, res) => {
    res.render("admin", {user:req.user})
})


module.exports = router;