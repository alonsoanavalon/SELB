const router = require('express').Router()
const authControllers = require('../auth/auth.controller')
router.get('/', (req, res) => {
    res.render("index", {alert:false})
})

router.post('/', authControllers.login)

module.exports = router