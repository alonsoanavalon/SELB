const mysqlConnection = require('../database/database')

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
            const sql = `SELECT * from student where ID = ${id}`;
            await mysqlConnection.query(sql, (err, result) => {
                resolve(result)
            })
        } catch (err) {
            reject(err);
            throw err;
        }
    })
}

exports.createStudent = (student) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `INSERT INTO student (course_id, name, surname, rut, age, gender) VALUES (${student.course_id}, '${student.name}', '${student.surname}', '${student.rut}', ${student.age}, '${student.gender}')`
            await mysqlConnection.query(sql, (err, results) => {
                if (err) {
                    if (err.errno == 1062) {
                        resolve({
                            type:'duplicate',
                            message:`El rut ${student.rut} no está disponible`
                        })
                    }
                    resolve({
                        type:'unknow',
                        message:'Error desconocido'
                    });
                }
                resolve(results)
            })
        } catch (err) {
            reject({
                type:'unknow',
                message:'Error desconocido'
            });
            throw err;
        }
    })
}

exports.getAllStudentsInfo = () => {
    return new Promise( async (resolve, reject) => {
        try {
            const sql = `SELECT
            student.id,
            concat(student.name , " ", student.surname) as alumno, 
            course.level as level,
            course.letter as course,
            student.rut,
            student.gender,
            school.name as escuela
            FROM student 
            INNER JOIN course on course.id = student.course_id
            INNER JOIN school on school.id = course.school_id
            order by id;`
            await mysqlConnection.query(sql, async (err, results) => { 
                resolve(results)
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })
}