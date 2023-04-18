const mysqlConnection = require('../../database/database')

exports.getAllStudents = () => {
    return new Promise( async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM student order by id;`
            await mysqlConnection.query(sql, async (err, results) => { 
                resolve(results)
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })
}

exports.updateStudentById = (id, student) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `UPDATE student SET course_id = ${student.course_id}, name = '${student.name}', surname = '${student.surname}' , rut = '${student.rut}', age = ${student.age}, gender = '${student.gender}' WHERE id = ${id};`
            await mysqlConnection.query(sql, (err, result) => {
                if (err) throw err;
                console.log(result)
                resolve(result)
            })
        } catch (err) {
            reject(err);
            throw err;
        }
    })
}

exports.getStudentById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * from student where rut = '${id}'`;
            await mysqlConnection.query(sql, (err, result) => {
                resolve(result)
            })
        } catch (err) {
            reject(err);
            throw err;
        }
    })
}



