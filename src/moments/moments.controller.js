const router = require('express').Router();
const momentsService = require('./moments.service');

router.get('/', async (_req, res) => {
    const moments = await momentsService.getMoments();
    res.render("all-moments", {
        results: moments
    });
})

router.get('/:id', async(req, res)=> {
    const moment = await momentsService.getMoment(req.params.id);
    res.send(moment);
})

router.post('/', async (req, res) => {
    const newMoment = await momentsService.createMoment(req.body.study_id, req.body.begin, req.body.until)
    res.send(newMoment);
})

router.put('/:id', async (req, res) => {
    const updatedMoment = await momentsService.updateMoment(req.params.id, req.body.begin, req.body.until)
    res.send(updatedMoment)
})

router.delete('/:id', async (req, res) => {
    const deletedMoment = await momentsService.deleteMoment(req.params.id);
    res.send(deletedMoment);
})
module.exports = router;