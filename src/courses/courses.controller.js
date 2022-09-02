const router = require('express').Router()
const authController = require('../controllers/authControllers')
const coursesService = require('./courses.service')

router.get('/', authController.isAuthenticated, async (req, res) => {
    const results = await coursesService.getAllInstruments();
    res.render("all-courses", {results})
})



module.exports = router;