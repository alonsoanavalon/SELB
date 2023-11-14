const router = require('express').Router()
const schoolAsignationService = require('./school-asignation.service')

router.get('/', async (req, res) => {
    const assignation = await schoolAsignationService.getAll();
    res.send(assignation);
})

router.get('/:id', async (req, res) => {
  const assignation = await schoolAsignationService.getById(req.params.id);
  res.send(assignation);
})

module.exports = router;