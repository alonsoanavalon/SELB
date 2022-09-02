const router = require('express').Router()
const authController = require('../controllers/authControllers')
const schoolsService = require('./schools.service')

router.get('/', authController.isAuthenticated, async (req, res) => {
    const results = await schoolsService.getAllSchools()
    res.render("all-schools", {
        results
    })
})



module.exports = router;