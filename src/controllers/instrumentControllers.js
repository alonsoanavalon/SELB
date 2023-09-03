const mysqlConnection = require('../database/database')
const mysql = require('mysql')

exports.saveDataFromInstrument = (req, res) => {
    const data = req.body
    mysqlConnection.query(`INSERT INTO test (test) VALUES ('${data.test}')`, (err, results, rows) => {
        if (err) throw err;
    })
} 

exports.getLastMoment = (studyId) => {
    return new Promise( async (resolve, reject) => {
        await mysqlConnection.query(`SELECT moment.id FROM moment INNER JOIN study on study.id = moment.study_id WHERE study.id=${studyId} ORDER BY id DESC LIMIT 1;`, (err, results) => {
            if (err) throw err;
            console.log(err, "ERROR!")
            resolve(results)
        })
    })
}

exports.getMoment = (date, studyId) => { 



    console.log("fecha: ", date)
    return new Promise((resolve, reject) => {
        const sql = `SELECT moment.id FROM moment INNER JOIN study on study.id = moment.study_id WHERE study.id=${studyId} AND moment.begin <= '${date}' AND moment.until >= '${date}'`
        mysqlConnection.query(sql, async (err, results) => {

            if (results !== undefined && results.length > 0) {
                results = JSON.parse(JSON.stringify(results))
                id = results[0]['id']
                if (id) {
                    resolve(id) 
                }
                else {
                    console.log('No existe el momento, consiguiendo last moment 1')
                    id = await this.getLastMoment(studyId)
                    resolve(JSON.parse(JSON.stringify(id))[0]['id'])
                }
            } else {
                console.log("No existe el momento, consiguiendo last moment 2")
                id = await this.getLastMoment(studyId)
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
        mysqlConnection.query(sql, async (err, response) => {
            if (err) throw err;
            const res = JSON.parse(JSON.stringify(await response))
            if (res) {
                resolve(res['insertId'])
            } else {
                console.log("aca")
            }

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

exports.isAnyChoices = (instrument_list_id) => {
    const sql = `SELECT COUNT(*) FROM choice where instrument_list_id = ${instrument_list_id};`
    return new Promise((resolve, reject) => {
        mysqlConnection.query(sql, (err, res) => {
            if (err) throw err;
            console.log(res)
            resolve(res[0]['COUNT(*)'])
        }) 
    })
}

exports.insertMode = async (evaluationId, instrumentId) => {
    const instrumentList = await this.getInstrumentList(evaluationId, instrumentId)
    if (instrumentList == undefined) {
        return undefined
    } else {
        const choices = await this.isAnyChoices(instrumentList['id']);
        if (choices > 0) {
            return instrumentList
        } else {
            return undefined
        }

    }

}

async function save (sql, instrumentIndex) {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(sql, async (err, res) => {
            if(err){
                console.log("Error en índice: ", instrumentIndex)
                throw err;
            } else {
                console.log(`Test N°${instrumentIndex} ingresado con exito`)                
            }
    
            resolve(res);
            
        })
    })
}

// async function insertDataByInstrument (newInstrumentId, updateInstrument, instrumentId, choicesObject, instrumentIndex) {
    
//     let sql = ''

//     let objectLength = Object.keys(choicesObject).length

//     /* Hay algun */

//     if (instrumentId !== 7 && instrumentId !== 8  && instrumentId !== 9 && instrumentId !== 10) {

    
//         if (updateInstrument) {
        
//             let counter = 0;
//             isCreated = false;

//             for (choice in choicesObject) {
//                 counter += 1

//                 sql+= mysql.format(`UPDATE choice SET value='${choicesObject[choice]}' WHERE choice.item_id = ${choice} AND choice.instrument_list_id = ${newInstrumentId};`)
//             }

  
//         } else {


//             let counter = 0;
//             isCreated = true;
//             sql += `INSERT INTO choice (item_id, value, instrument_list_id) VALUES `
//             for (choice in choicesObject) {
//                 counter += 1
//                 if (counter == objectLength) {
//                     sql+= `(${choice}, '${choicesObject[choice]}', ${newInstrumentId});`
//                 } else {
//                     sql+=`(${choice}, '${choicesObject[choice]}', ${newInstrumentId}),`

//                 }


//             }


//         }

//     } else if (instrumentId == 7) {
//         if (updateInstrument) {
        
//             let counter = 0;
//             isCreated = false;

//             for (choice in choicesObject) {
//                 counter += 1

//                 sql+= mysql.format(`UPDATE choice SET value='${choicesObject[choice].choice}', time='${choicesObject[choice].time}' WHERE choice.item_id = ${choice} AND choice.instrument_list_id = ${newInstrumentId};`)
//             }

  
//         } else {

//             let counter = 0;
//             isCreated = true;
//             sql += `INSERT INTO choice (item_id, value, time, instrument_list_id) VALUES `
//             for (choice in choicesObject) {
//                 counter += 1
//                 if (counter == objectLength) {
//                     sql+= `(${choice}, '${choicesObject[choice].choice}', '${choicesObject[choice].time}', ${newInstrumentId});`
//                 } else {
//                     sql+=` (${choice}, '${choicesObject[choice].choice}', '${choicesObject[choice].time}', ${newInstrumentId}),`

//                 }


//             }


//         }
//     } else if (instrumentId === 8){

//         if (updateInstrument) {
        
//             let counter = 0;
//             isCreated = false;

//             for (choice in choicesObject) {
//                 counter += 1

//                 sql+= mysql.format(`UPDATE choice SET value='${choicesObject[choice].value}', text='${choicesObject[choice].options}' WHERE choice.item_id = ${choice} AND choice.instrument_list_id = ${newInstrumentId};`)
//             }

  
//         } else {

//             let counter = 0;
//             isCreated = true;
//             sql += `INSERT INTO choice (item_id, value, text, instrument_list_id) VALUES `
//             for (choice in choicesObject) {
//                 counter += 1
//                 if (counter == objectLength) {
//                     sql+= `(${choice}, '${choicesObject[choice].value}', '${choicesObject[choice].options}', ${newInstrumentId});`
//                 } else {
//                     sql+=` (${choice}, '${choicesObject[choice].value}', '${choicesObject[choice].options}', ${newInstrumentId}),`

//                 }


//             }


//         }

//     } else if (instrumentId === 9){
//         if (updateInstrument) {
        
//             let counter = 0;
//             isCreated = false;

//             for (choice in choicesObject) {
//                 counter += 1
//                 sql+= mysql.format(`UPDATE choice SET value='${choicesObject[choice].value}', time='${choicesObject[choice].options.time}' WHERE choice.item_id = ${choice} AND choice.instrument_list_id = ${newInstrumentId};`)
//             }

  
//         } else {

//             let counter = 0;
//             isCreated = true;
//             sql += `INSERT INTO choice (item_id, value, time, instrument_list_id) VALUES `
//             for (choice in choicesObject) {
//                 counter += 1
//                 if (counter == objectLength) {
//                     sql+= `(${choice}, '${choicesObject[choice].value}', '${choicesObject[choice].options.time}', ${newInstrumentId});`
//                 } else {
//                     sql+=` (${choice}, '${choicesObject[choice].value}', '${choicesObject[choice].options.time}', ${newInstrumentId}),`

//                 }


//             }


//         }

//     } else if (instrumentId === 10){
//         if (updateInstrument) {
        
//             let counter = 0;
//             isCreated = false;

//             for (choice in choicesObject) {
//                 counter += 1
//                 sql+= mysql.format(`UPDATE choice SET value=${choicesObject[choice].value}, alternative='${choicesObject[choice].alternative}' WHERE choice.item_id = ${choice} AND choice.instrument_list_id = ${newInstrumentId};`)
//             }

  
//         } else {

//             let counter = 0;
//             isCreated = true;
//             sql += `INSERT INTO choice (item_id, value, alternative, instrument_list_id) VALUES `
//             for (choice in choicesObject) {
//                 counter += 1
//                 if (counter == objectLength) {
//                     sql+= `(${choice}, ${choicesObject[choice].value}, ${choicesObject[choice].alternative}, ${newInstrumentId});`
//                 } else {
//                     sql+=` (${choice}, ${choicesObject[choice].value}, ${choicesObject[choice].alternative}, ${newInstrumentId}),`

//                 }


//             }


//         }

//     }



//     const savedData = await save(sql, instrumentIndex)
//     return isCreated

    
// }

exports.saveInstrumentData = async (infoObject, choicesObject, instrumentIndex, studyId) => {

    let instrumentId = infoObject['instrument'];
    let studentId = infoObject['student_id']
    let userId = infoObject['user_id']
    let instrumentDate = infoObject['date']
    let isCreated = undefined;
    let evaluationId;
    let newInstrumentId;
    let updateInstrument = true;

    let sql = ''

    // let evaluationIdXX;
    // let newInstrumentIdXX;
    // let updateInstrumentXX = true; 


    // const momentId = await this.getMoment();
    // evaluationIdXX = await this.getEvaluation(momentId, studentId);
    // if (evaluationIdXX === false) {
    //     evaluationIdXX = await this.createEvaluation(userId, studentId, momentId);
    // }

    // newInstrumentIdXX = await this.insertMode(evaluationIdXX, instrumentId)

    // if (newInstrumentIdXX === undefined) {
    //     newInstrumentIdXX = await this.createInstrumentList(evaluationIdXX, instrumentId, userId)
    //     updateInstrumentXX = false;
    // }  else {
    //     newInstrumentIdXX = newInstrumentIdXX['id']
    // }

    // const savedInstrument = await insertDataByInstrument(newInstrumentIdXX, updateInstrumentXX, instrumentId, choicesObject, instrumentIndex)

    // return savedInstrument;

    return new Promise((resolve, reject) => {

        console.log(`InstrumentId ${instrumentId}, StudentId ${studentId}, userId ${userId}, instrumentDate ${instrumentDate}`)

        const today = new Date();
        const date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();

        this.getMoment(date, studyId)
        .then(async (res) => {
    
            evaluationId = await this.getEvaluation(res, studentId)
            
            if (evaluationId === false) {
                evaluationId = await this.createEvaluation(userId, studentId, res)
            } 
            return [evaluationId, instrumentId]
    
        })
        .then(async (evaluationInfo) => {
    
            
            let [evaluationId, instrumentId] = evaluationInfo
            newInstrumentId = await this.insertMode(evaluationId, instrumentId)


        
    
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
    
            let sql = ''
    
            let objectLength = Object.keys(choicesObject).length
    
            /* Hay algun */

            if (instrumentId !== 7 && instrumentId !== 8  && instrumentId !== 9 && instrumentId !== 10) {

            
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
        
            } else if (instrumentId == 7) {
                if (updateInstrument) {
                
                    let counter = 0;
                    isCreated = false;
        
                    for (choice in choicesObject) {
                        counter += 1
        
                        sql+= mysql.format(`UPDATE choice SET value='${choicesObject[choice].choice}', time='${choicesObject[choice].time}' WHERE choice.item_id = ${choice} AND choice.instrument_list_id = ${newInstrumentId};`)
                    }
        
          
                } else {
        
                    let counter = 0;
                    isCreated = true;
                    sql += `INSERT INTO choice (item_id, value, time, instrument_list_id) VALUES `
                    for (choice in choicesObject) {
                        counter += 1
                        if (counter == objectLength) {
                            sql+= `(${choice}, '${choicesObject[choice].choice}', '${choicesObject[choice].time}', ${newInstrumentId});`
                        } else {
                            sql+=` (${choice}, '${choicesObject[choice].choice}', '${choicesObject[choice].time}', ${newInstrumentId}),`
        
                        }
        
        
                    }
        
        
                }
            } else if (instrumentId === 8){

                if (updateInstrument) {
                
                    let counter = 0;
                    isCreated = false;
        
                    for (choice in choicesObject) {
                        counter += 1
        
                        sql+= mysql.format(`UPDATE choice SET value='${choicesObject[choice].value}', text='${choicesObject[choice].options}' WHERE choice.item_id = ${choice} AND choice.instrument_list_id = ${newInstrumentId};`)
                    }
        
          
                } else {
        
                    let counter = 0;
                    isCreated = true;
                    sql += `INSERT INTO choice (item_id, value, text, instrument_list_id) VALUES `
                    for (choice in choicesObject) {
                        counter += 1
                        if (counter == objectLength) {
                            sql+= `(${choice}, '${choicesObject[choice].value}', '${choicesObject[choice].options}', ${newInstrumentId});`
                        } else {
                            sql+=` (${choice}, '${choicesObject[choice].value}', '${choicesObject[choice].options}', ${newInstrumentId}),`
        
                        }
        
        
                    }
        
        
                }

            } else if (instrumentId === 9){
                if (updateInstrument) {
                
                    let counter = 0;
                    isCreated = false;
        
                    for (choice in choicesObject) {
                        const sticks = JSON.stringify(choicesObject[choice].options.sticks);
                        const options = JSON.stringify(choicesObject[choice].options);
                        counter += 1
                        sql+= mysql.format(`UPDATE choice SET value='${choicesObject[choice].value}', time='${choicesObject[choice].options.time}', tries='${choicesObject[choice].options.resets}', text='${sticks}', options='${options}' WHERE choice.item_id = ${choice} AND choice.instrument_list_id = ${newInstrumentId};`)
                    }
        
          
                } else {
        
                    let counter = 0;
                    isCreated = true;
                    sql += `INSERT INTO choice (item_id, value, time, tries, text, instrument_list_id, options) VALUES `
                    for (choice in choicesObject) {
                        const sticks = JSON.stringify(choicesObject[choice].options.sticks);
                        counter += 1
                        if (counter == objectLength) {
                            sql+= `(${choice}, '${choicesObject[choice].value}', '${choicesObject[choice].options.time}', '${choicesObject[choice].options.resets}', '${sticks}',  ${newInstrumentId}, '${options});`
                        } else {
                            sql+=` (${choice}, '${choicesObject[choice].value}', '${choicesObject[choice].options.time}', '${choicesObject[choice].options.resets}', '${sticks}',  ${newInstrumentId}, '${options}),`
        
                        }
        
        
                    }
        
        
                }

            } else if (instrumentId === 10){
                if (updateInstrument) {
                
                    let counter = 0;
                    isCreated = false;
        
                    for (choice in choicesObject) {
                        counter += 1
                        sql+= mysql.format(`UPDATE choice SET value=${choicesObject[choice].value}, alternative='${choicesObject[choice].alternative}' WHERE choice.item_id = ${choice} AND choice.instrument_list_id = ${newInstrumentId};`)
                    }
        
          
                } else {
        
                    let counter = 0;
                    isCreated = true;
                    sql += `INSERT INTO choice (item_id, value, alternative, instrument_list_id) VALUES `
                    for (choice in choicesObject) {
                        counter += 1
                        if (counter == objectLength) {
                            sql+= `(${choice}, ${choicesObject[choice].value}, ${choicesObject[choice].alternative}, ${newInstrumentId});`
                        } else {
                            sql+=` (${choice}, ${choicesObject[choice].value}, ${choicesObject[choice].alternative}, ${newInstrumentId}),`
        
                        }
        
        
                    }
        
        
                }

            }
    
    

    
            await mysqlConnection.query(sql, async (err, res) => {
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

