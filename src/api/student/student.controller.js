const router = require('express').Router()
const studentsService = require('./student.service')


router.get('/', async (req, res) => {
    const results = await studentsService.getAllStudents()
    res.send(results)
})
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const student = await studentsService.getStudentById(id);
    res.send(student)
   
})


module.exports = router;