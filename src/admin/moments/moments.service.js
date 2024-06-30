const mysqlConnection = require('../../database/database.js')

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

exports.createMoment = async (moments) => {
    const lastMoment = moments['moments'].slice(-1)[0];
    const date = new Date(new Date().toLocaleDateString('zh-Hans-CN')).getTime();
    const lastMomentBegin = new Date(lastMoment.begin).toLocaleDateString('zh-Hans-CN');
    const currentDate = new Date(date).toLocaleDateString('zh-Hans-CN');
    const newBegin = new Date(new Date(date + 86400000)).toLocaleDateString('zh-Hans-CN');


    const updatedPreviousMoment = await this.updateMoment(lastMoment.id, lastMomentBegin, currentDate);
    if (updatedPreviousMoment) {
        const sql = `INSERT INTO moment (id, study_id, begin, until) VALUES (${lastMoment.id + 1}, ${lastMoment.study_id}, '${newBegin}', '2100-10-10')`;
        return this.getResults(sql);
    }

}

exports.updateMoment = (momentId, begin, until) => {
    const sql = `UPDATE moment SET begin='${begin}', until='${until}' WHERE moment.id = ${momentId}`;
    return this.getResults(sql);
    
}

exports.deleteMoment = (momentId) => {
    const sql = `DELETE FROM moment WHERE moment.id = ${momentId}`;
    return this.getResults(sql);
}


exports.getMomentsIdsByStudy = (study_id) => {
    return new Promise((resolve, reject) => {
        try {
            const sql = `SELECT * FROM moment WHERE study_id = ${study_id}`;
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


exports.getMomentsIds = () => {
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