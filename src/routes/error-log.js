const router = require('express').Router();
const fs = require('fs');

router.post('/', async (req, res) => {
    try {
        const errorLog = req.body
        const errorMessage = JSON.stringify(req.body.error);

        // Agregar el error al archivo de registro
        const timestamp = new Date().toISOString();
        const logEntry = `${timestamp}: ${errorMessage}: ${JSON.stringify(errorLog)}\n`;
        fs.appendFileSync('error.log', logEntry);
    
        res.status(200).send('Error registrado con éxito.');
      } catch (err) {
        console.error('Error al registrar el error:', err);
        res.status(500).send('Error al registrar el error.');
      }
})
module.exports = router