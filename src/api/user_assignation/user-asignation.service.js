const mysqlConnection = require('../../database/database')
const schoolService = require('../school/school.service')

exports.getAll = () => {
    return new Promise( async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM user_assignation WHERE assignation_type_id = 3 order by id desc`
            await mysqlConnection.query(sql, async (err, results) => { 
                resolve(results)
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })
}

groupSchoolsByUser = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * from user_assignation where user_id = ${id} and assignation_type_id = 3`;
            await mysqlConnection.query(sql, (err, result) => {
                resolve(result)
            })
        } catch (err) {
            reject(err);
            throw err;
        }
    })
}



exports.getById = async (id) => {
    const results = await groupSchoolsByUser(id);
    if (results) {
        const associatedSchools = results.map(result => {
           return result.school_id;
        })

        const schools = await schoolService.getByIds(associatedSchools);
        return schools;
    } else {
        return [];
    }
}


exports.create = (userAssignation) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `INSERT INTO user_assignation (user_id, date, student_rut, assignation_type_id) VALUES(${userAssignation.userId}, current_timestamp(), '${userAssignation.studentRut}' , ${userAssignation.typeId});`;
            await mysqlConnection.query(sql, (err, result) => {
                resolve(result)
            })
        } catch (err) {
            reject(err);
            throw err;
        }
    })
}

