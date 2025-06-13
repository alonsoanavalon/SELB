const mysqlConnection = require('../../database/database');
const exerciseService = require('../exercise/exercise.service');

exports.getAll = () => {
    return new Promise( async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM session_version`
            await mysqlConnection.query(sql, async (err, results) => { 
                resolve(results)
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })
}

exports.getById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * from session_version where id = ${id}`;
            await mysqlConnection.query(sql, (err, result) => {
                resolve(result)
            })
        } catch (err) {
            reject(err);
            throw err;
        }
    })
}


exports.getByVersionId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * from session_version where version_id = ${id}`;
            await mysqlConnection.query(sql, (err, result) => {
                resolve(result)
            })
        } catch (err) {
            reject(err);
            throw err;
        }
    })
}
        


exports.getActivitiesByVersionId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT activity.id, 
                            activity.date, 
                            activity.skill_id, 
                            session.id,
                            session_version.version_id
                            from session
                            inner join session_version on session.id = session_version.session_id
                            inner join activity on session.id = activity.session_id
                            where session_version.version_id = ${id}`;
            await mysqlConnection.query(sql, (err, result) => {
                resolve(result)
            })
        } catch (err) {
            reject(err);
            throw err;
        }
    })
}

exports.getSessionsByVersionId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT session.id, session.date, session_version.version_id FROM session_version INNER JOIN session ON session_version.session_id = session.id WHERE session_version.version_id = ${id}`;
            await mysqlConnection.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result)
            })
        } catch (err) {
            reject(err);
            throw err;
        }
    })
}

exports.createSessionVersion = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `INSERT INTO session_version (session_id, version_id) VALUES (${body.sessionId}, ${body.versionId})`;
            await mysqlConnection.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result)
            })
        } catch (err) {
            reject(err);
            console.log(err);
        }
    })
}

exports.updateSessionVersion = (id, body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `UPDATE session_version SET version_id = ${body.versionId} WHERE id = ${id} and session_id = ${body.sessionId}`;
            await mysqlConnection.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result)
            })
        } catch (err) {
            reject(err);
            console.log(err);
        }
    })
}
