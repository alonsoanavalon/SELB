const router = require('express').Router()
const authController = require('../../auth/auth.controller')
const studentsService = require('./students.service')
const coursesService = require('../courses/courses.service')

router.get('/', authController.isAuthenticated, async (req, res) => {
    const results = await studentsService.getAllStudents()
    res.render("all-students", {
        results
    })
})

router.get('/add', authController.isAuthenticated, async (req, res) => {
    const courses = await coursesService.getAllCourses();
    res.render("create-student", {
        courses
    })
})

router.get('/:id', authController.isAuthenticated, async (req, res) => {
    const id = req.params.id;
    const student = await studentsService.getStudentById(id);
    const courses = await coursesService.getAllCourses();
    const gendersArray = ["M", "F"];
    let selectedCourse = null; // esta logica debería estar en una funcion
    const allCourses = courses.filter(course => 
        { if (course.id !== student[0].course_id) { 
            return true
        } else {
             selectedCourse = course 
             return false
        } 
    })
    let genders = null;
    const selectedGender = gendersArray.filter(gender => {
        if (student[0].gender == gender) {
            return true
        } else {
            genders = gender;
            return false
        }
        
    })
    res.render("edit-student", {
        student: student[0],
        courses: allCourses,
        selectedCourse,
        selectedGender: selectedGender[0],
        genders
    })
})

router.put('/:id', authController.isAuthenticated, async (req, res) => {

    const updatedStudent = await studentsService.updateStudentById(req.params.id, req.body);
    res.send(updatedStudent)
})





router.post('/', authController.isAuthenticated, async (req, res) => {
    const response = await studentsService.createStudent(req.body);
    res.send(response)
})





module.exports = router;