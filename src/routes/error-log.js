const router = require('express').Router();

router.post('/', async (req, res) => {
    const errorLog = req.body;
    console.log(errorLog);
    res.send(errorLog)
})
module.exports = router