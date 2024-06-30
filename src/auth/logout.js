const router = require('express').Router()
const authController = require('./auth.controller')

router.get('/', authController.logout)

module.exports = router