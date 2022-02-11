const router = require('express').Router()
const instrumentControllers = require('../controllers/instrumentControllers')

router.post('/newevaluation',  (req, res) => {
    
    let allInstruments = req.body

    allInstruments.forEach( instrument => {
        let [infoObject, choicesObject] = instrument
        instrumentControllers.saveInstrumentData(infoObject, choicesObject)
        
    })

})

module.exports = router;