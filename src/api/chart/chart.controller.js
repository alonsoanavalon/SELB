const router = require('express').Router()
const chartService = require('./chart.service')

router.get('/', (req, res) => {
    res.send("hello world")
})

router.get('/student/:studentRut', async (req, res) => {
    const data = await chartService.getExercisesByStudentRut(req.params.studentRut);
    res.send(data)
})

router.get('/session/:sessionId', async (req, res) => {
    const data = await chartService.getExercisesBySessionId(req.params.sessionId);
    res.send(data)
})

router.get('/activity/:activityId', async (req, res) => {
    const data = await chartService.getExercisesByActivityId(req.params.activityId);
    res.send(data)
})

module.exports = router;