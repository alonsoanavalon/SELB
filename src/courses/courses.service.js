const mysqlConnection = require('../database/database')

exports.getAllInstruments = () => {
    return new Promise( async (resolve, reject) => {
        try {
            const sql = `SELECT  course.id, school.id as school_id, school.name, course.level, course.letter FROM course INNER JOIN school ON school.id = course.school_id order by id;`
            await mysqlConnection.query(sql, async (err, results) => { 
                resolve(results)
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })
}