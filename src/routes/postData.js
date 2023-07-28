const router = require('express').Router()
const instrumentControllers = require('../controllers/instrumentControllers')

router.post('/newevaluation', async (req, res) => {
    let allInstruments = req.body.instruments
    let studyId = req.body.studyId
    let updatedCounter = 0;
    let createdCounter = 0;
    
/*     allInstruments.forEach( instrument => {
        let [infoObject, choicesObject] = instrument
        instrumentControllers.saveInstrumentData(infoObject, choicesObject)
        
    }) */

    let instrumentIndex = 1;
    for (const instrument of allInstruments) {

        let [infoObject, choicesObject] = instrument
        let response = await instrumentControllers.saveInstrumentData(infoObject, choicesObject, instrumentIndex, studyId)
        if (response === false) {
            updatedCounter++
        } else {
            createdCounter++
        }
        
        instrumentIndex++
 
    }
    console.log(`Ingresaron ${allInstruments.length} Test: [Actualizados: ${updatedCounter}] [Creados: ${createdCounter}] `)

    if (allInstruments.length !== updatedCounter + createdCounter) {
        res.send({
            instrumentsLength: `${allInstruments.length}`,
            statusText: 'Los test no se han guardado con éxito',
            htmlText: '<p>Intenta repetir este proceso o descargar tu <a href="/respaldo">respaldo</a> y comunicarte con el administrador</p>',
            updatedCounter,
            createdCounter,
        }) 
    } else {
        res.send( {
            instrumentsLength: `${allInstruments.length}`,
            statusText: `Todos los test se han guardado con éxito `,
            htmlText: '<p>Recuerda que la cantidad de test que se agregarán a tus "Test enviados" serán los <b>ingresados</b>, no aquellos <b>actualizados</b></p><br>En caso que existan inconsistencias, puedes descargar tu <a href="/respaldo">respaldo</a> y comunicarte con el administrador',
            updatedCounter,
            createdCounter,
        
        })
    }


})

module.exports = router;