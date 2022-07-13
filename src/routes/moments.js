const router = require('express').Router();
const momentsService = require('../services/moment.service')

router.get('/', async (req, res) => {
    const moments = await momentsService.getMoments()
    res.send(moments);
})

module.exports = router;