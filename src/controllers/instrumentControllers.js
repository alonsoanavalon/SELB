const mysqlConnection = require('../database/database')


exports.saveDataFromInstrument = (req, res) => {
    const data = req.body
    console.log(data)
    mysqlConnection.query(`INSERT INTO test (test) VALUES ('${data.test}')`, (err, results, rows) => {
        if (err) throw err;
        console.log(results)
    })
}   