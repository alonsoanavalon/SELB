const router = require('express').Router()
const authController = require('../controllers/authControllers')


router.get('/', authController.logout)





module.exports = router