const router = require('express').Router()
const authControllers = require('../controllers/authControllers')
router.get('/', (req, res) => {
    res.render("signin.hbs", {alert:false})
})

router.post('/', authControllers.login)

module.exports = router