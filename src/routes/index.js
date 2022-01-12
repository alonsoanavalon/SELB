const router = require('express').Router()

router.get("/", (req, res) => {
    res.render('index', {
        user:"Alonso"
    })
})

module.exports = router;