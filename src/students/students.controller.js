const router = require('express').Router()
const authController = require('../controllers/authControllers')
const studentsService = require('./students.service')
const coursesService = require('../courses/courses.service')

router.get('/', authController.isAuthenticated, async (req, res) => {
    const results = await studentsService.getAllStudents()
    res.render("all-students", {
        results
    })
})

router.get('/:id', authController.isAuthenticated, async (req, res) => {
    const id = req.params.id;
    const student = await studentsService.getStudentById(id);
    const courses = await coursesService.getAllCourses()


    res.render("edit-student", {
        student: student[0],
        courses
    })
})



module.exports = router;