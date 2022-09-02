const mysqlConnection = require('../database/database')

exports.getResults = (sql) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(sql, (err, res) => {
            if (err) throw err;
            const data = JSON.stringify(res)
            resolve (data);
        })
    })
}

exports.getMoments = () => {
    return new Promise((resolve, reject) => {
        try {
            const sql = `SELECT * FROM moment`;
            mysqlConnection.query(sql, (err, res) => {
                if (err) throw err;
                resolve (res);
            })
        } catch (err) {
            reject(err)
            throw err;
        }
    })

}

exports.getMoment = (id) => {
    const sql = `SELECT * FROM moment WHERE moment.id = ${id}`;
    return this.getResults(sql);
}

exports.createMoment = (studyId, begin, until) => {
    const sql = `INSERT INTO moment (study_id, begin, until) VALUES (${studyId}, '${begin}', '${until}')`;
    return this.getResults(sql);
}

exports.updateMoment = (momentId, begin, until) => {
    const sql = `UPDATE moment SET begin='${begin}', until='${until}' WHERE moment.id = ${momentId}`;
    return this.getResults(sql);
    
}

exports.deleteMoment = (momentId) => {
    const sql = `DELETE FROM moment WHERE moment.id = ${momentId}`;
    return this.getResults(sql);
}