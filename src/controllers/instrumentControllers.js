const mysqlConnection = require('../database/database')
const mysql = require('mysql')

exports.saveDataFromInstrument = (req, res) => {
    const data = req.body
    mysqlConnection.query(`INSERT INTO test (test) VALUES ('${data.test}')`, (err, results, rows) => {
        if (err) throw err;
    })
} 

exports.getLastMoment = () => {
    return new Promise( async (resolve, reject) => {
        await mysqlConnection.query('SELECT id FROM moment ORDER BY id DESC LIMIT 1', (err, results) => {
            if (err) throw err;
            console.log(err, "ERROR!")
            resolve(results)
        })
    })
}

exports.getMoment = (date) => { 

    console.log("fecha: ", date)
    return new Promise((resolve, reject) => {
        mysqlConnection.query(`SELECT moment.id FROM moment WHERE moment.begin <= '${date}' AND moment.until >= '${date}'`, async (err, results) => {
            if (results !== undefined && results.length > 0) {
                results = JSON.parse(JSON.stringify(results))
                id = results[0]['id']
                if (id) {
                    resolve(id) 
                }
                else {
                    console.log('No existe el momento, consiguiendo last moment 1')
                    id = await this.getLastMoment()
                    resolve(JSON.parse(JSON.stringify(id))[0]['id'])
                }
            } else {
                console.log("No existe el momento, consiguiendo last moment 2")
                id = this.getLastMoment()
                console.log(id, "id")
                resolve(JSON.parse(JSON.stringify(id))[0]['id'])
/*                 const today = new Date();
                const untilDate = (today.getFullYear() + 1)+'/'+(today.getMonth()+1)+'/'+today.getDate();
                
                mysqlConnection.query("INSERT INTO moment") */
            }
            

        })
    })

}

exports.getEvaluation = (momentId, studentId) => {


        return new Promise((resolve, reject) => {

            try {
                mysqlConnection.query(`SELECT evaluation.id FROM evaluation WHERE evaluation.student_id = ${studentId} AND evaluation.moment_id = ${momentId}`, (err, results) => {
                    results = JSON.parse(JSON.stringify(results))
                    results.length === 0 ? resolve(false) : resolve(results[0]['id'])
                })
            } catch (err) {
                console.log(err);
            }



        })
    



}

exports.createEvaluation = (userId, studentId, momentId) => {

    return new Promise((resolve, reject) => {
        sql = `INSERT INTO evaluation (user_id, student_id, moment_id) values (${userId}, ${studentId}, ${momentId})`
        mysqlConnection.query(sql, (err, res) => {
            if (err) throw err;
            res = JSON.parse(JSON.stringify(res))
            resolve (res['insertId'])
        })
    })

}

exports.createInstrumentList = (evaluationId, instrumentId, userId) => {

    return new Promise((resolve, reject) => {
        sql = `INSERT INTO instrument_list (evaluation_id, instrument_id, evaluator_id) VALUES (${evaluationId}, ${instrumentId}, ${userId})`
        mysqlConnection.query(sql, (err, res) => {
            if (err) throw err;
            res = JSON.parse(JSON.stringify(res))
            resolve(res['insertId'])
        })
    })
}

exports.getInstrumentList = (evaluationId, instrumentId) => {
    return new Promise((resolve, reject) => {
        sql = `SELECT instrument_list.id FROM instrument_list WHERE instrument_list.evaluation_id = ${evaluationId} AND instrument_list.instrument_id = ${instrumentId}`
        

            mysqlConnection.query(sql, (err, res) => {
                if (err) throw err;
                /* Esto esta fallando */
                res = JSON.parse(JSON.stringify(res))
                resolve(res[0])
            })

        

    })
}

exports.saveInstrumentData = async (infoObject, choicesObject, instrumentIndex) => {


    let instrumentId = infoObject['instrument'];
    let studentId = infoObject['student_id']
    let userId = infoObject['user_id']
    let instrumentDate = infoObject['date']
    let isCreated = undefined;
    let evaluationId;
    let newInstrumentId;
    let updateInstrument = true; 

    let sql = ''

    return new Promise((resolve, reject) => {

        console.log(`InstrumentId ${instrumentId}, StudentId ${studentId}, userId ${userId}, instrumentDate ${instrumentDate}`)

        const today = new Date();
        const date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();

        this.getMoment(date)
        .then(async (res) => {
    
            evaluationId = await this.getEvaluation(res, studentId)
            
            if (evaluationId === false) {
                evaluationId = await this.createEvaluation(userId, studentId, res)
            } 
            return [evaluationId, instrumentId]
    
        })
        .then(async (evaluationInfo) => {
    
            
            let [evaluationId, instrumentId] = evaluationInfo
            newInstrumentId = await this.getInstrumentList(evaluationId, instrumentId)
        
    
                if (newInstrumentId === undefined) {
                    newInstrumentId = await this.createInstrumentList(evaluationId, instrumentId, userId)
                    updateInstrument = false;
                }  else {
                    newInstrumentId = newInstrumentId['id']
                }
    
                return [newInstrumentId, updateInstrument]
    
            }
        ) .then(async (response) => {
            const [newInstrumentId, updateInstrument] = response
    

    
            let objectLength = Object.keys(choicesObject).length
    
            /* Hay algun */
    
            
            if (updateInstrument) {
                
                let counter = 0;
                isCreated = false;
    
                for (choice in choicesObject) {
                    counter += 1
    
                    sql+= mysql.format(`UPDATE choice SET value='${choicesObject[choice]}' WHERE choice.item_id = ${choice} AND choice.instrument_list_id = ${newInstrumentId};`)
                }
    
      
            } else {
    
                let counter = 0;
                isCreated = true;
                sql += `INSERT INTO choice (item_id, value, instrument_list_id) VALUES `
                for (choice in choicesObject) {
                    counter += 1
                    if (counter == objectLength) {
                        sql+= `(${choice}, '${choicesObject[choice]}', ${newInstrumentId});`
                    } else {
                        sql+=`(${choice}, '${choicesObject[choice]}', ${newInstrumentId}),`
    
                    }
    
    
                }
    
    
            }
    
    
            await mysqlConnection.query(sql, (err, res) => {
                if(err){
                    console.log("Error en índice: ", instrumentIndex)
                    throw err;
                } else {
                    console.log(`Test N°${instrumentIndex} ingresado con exito`)                
                }
                resolve(isCreated)
                
            })
    
            

            
    
        })

    })



      








}