const router = require('express').Router()
const authController = require('../../auth/auth.controller')
const coursesService = require('./courses.service')

router.get('/', authController.isAuthenticated, async (req, res) => {
    const results = await coursesService.getAllCourses();
    res.render("all-courses", {results})
})



module.exports = router;