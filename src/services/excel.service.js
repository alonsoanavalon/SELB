exports.getInfoTejasFinal = (rows) =>  {


    let rowArray = Object.entries(rows)

    try {

        let totalPoints = 0
        let studentRow = []
   
        rowArray.forEach((row, key) => {
                                 

            if (key == 0) {


                if (row[1]['value'].length == 0) {
                    studentRow.push('0')
                } else {
                    if (row[1]['value'] == 1) {
                        studentRow.push(row[1]['value'])
                        totalPoints++
                    } else {
                        studentRow.push(row[1]['value'])
                    }

                }
                                    
            } else {
                if (row[1]['value'].length == 0) {
                    studentRow.push('0')
                } else {
                    if (row[1]['value'] == 1) {
                        studentRow.push(row[1]['value'])
                        totalPoints++
                    } else {
                        studentRow.push(row[1]['value'])
                    }
                } 
            }

            if (key == 71) {
                studentRow.push(JSON.stringify(totalPoints))
            } 

        })

        
        return studentRow;
        
    } catch (error) {
        console.log(error.message)
    }
    
}


exports.getInfoFonoFinal = (rows) => {


    let rowArray = Object.entries(rows)

    let studentRow = []
    let totalPoints = 0;

    rowArray.forEach((row, key) => {

        if (key == 0) {
            if (row[1]['value'].length == 0) {
                studentRow.push('0') 
                studentRow.push('')
            } else {
                studentRow.push(row[1]['value'])
                studentRow.push(row[1]['text'])
            } 
            
        } else {
            if (row[1]['value'].length == 0) {
                studentRow.push('0') 
                studentRow.push('')
            } else {
                studentRow.push(row[1]['value'])
                studentRow.push(row[1]['text'])
            } 
        }

        if (row[1]['value'] > 0) {
            totalPoints = parseInt(totalPoints) + parseInt(row[1]['value']);
        }

        if (key === 23) {
            studentRow.push(totalPoints)
        }
    })

    return studentRow;
    
}

exports.getInfoCalculoFinal = (rows)  => {

    let rowArray = Object.entries(rows)
    
    let studentRow = []
    rowArray.forEach((row, key) => {
        if (key == 0) {
        
            if (row[1]['value'].length == 0) {
                studentRow.push('0') 
            } else {
                studentRow.push(row[1]['value'])
            } 
            
        } else {
            
            if (row[1]['num'] == 18) {
                if (row[1]['value'] == 3) {
                    studentRow.push('1') 
                } else {
                    studentRow.push('0') 
                }
            } else if (row[1]['num'] == 19) {
                if (row[1]['value'] == 4) {
                    studentRow.push('1') 
                } else {
                    studentRow.push('0') 
                }
            } else if (row[1]['num'] == 20) {
                if (row[1]['value'] == 6) {
                    studentRow.push('1') 
                } else {
                    studentRow.push('0') 
                }
            }else if (row[1]['num'] == 21) {
                if (row[1]['value'] == 8) {
                    studentRow.push('1') 
                } else {
                    studentRow.push('0') 
                }
            }else if (row[1]['num'] == 22) {
                if (row[1]['value'] == 10) {
                    studentRow.push('1') 
                } else {
                    studentRow.push('0') 
                }
            }else if (row[1]['num'] == 23) {
                if (row[1]['value'] == 11) {
                    studentRow.push('1') 
                } else {
                    studentRow.push('0') 
                }
            }else if (row[1]['num'] == 24) {
                if (row[1]['value'] == 16) {
                    studentRow.push('1') 
                } else {
                    studentRow.push('0') 
                }
            }else {
                if (row[1]['value'].length == 0) {
                    studentRow.push('0') 
                } else {
                    studentRow.push(row[1]['value'])
                } 
            }


        }

    })


    return studentRow
    
}


exports.getInfoAcesFinal = (rows) => {

    let correctAnswers = { // Respuestas correctas
        1:1,
        2:2,
        3:0,
        4:3,
        5:4,
        6:0,
        7:0,
        8:2,
        9:3,
        10:4,
        11:1,
        12:0,
        13:0,
        14:3,
        15:0,
        16:0,
        17:2,
        18:0,
        19:1,
        20:4,
        21:0,
        22:1,
        23:1,
        24:4,
        25:2,
        26:0
    }

    let rowArray = Object.entries(rows)

    try {
        let studentRow = []
        let totalPoints = 0
        let choicesLength = 25
   
        rowArray.forEach((row, key) => {
            if (key == 0) {

                if (row[1]['value'].length == 0) {
                    studentRow.push('0')
                    studentRow.push('0') 
                } else {
                    if (correctAnswers[row[1]['num']] == row[1]['value']) {
                        studentRow.push('1')
                        studentRow.push(row[1]['value'])
                        totalPoints++
                    } else {
                        studentRow.push('0')
                        studentRow.push(row[1]['value'])
                    }

                }
                                    
            } else {
                if (row[1]['value'].length == 0) {
                    studentRow.push('0')
                    studentRow.push('0') 
                } else {
                    if (correctAnswers[row[1]['num']] == row[1]['value']) {
                        studentRow.push('1')
                        studentRow.push(row[1]['value'])
                        totalPoints++
                    } else {
                        studentRow.push('0')
                        studentRow.push(row[1]['value'])
                    }
                } 
            }

            if (key == choicesLength) { // cada vez que terminamos de recorrerlos, sumamos los puntos totales al array de respuestas
                studentRow.push(JSON.stringify(totalPoints))
            } 
        })

        return studentRow;
        
    } catch (error) {
        throw error.message;
    }
    
}


exports.getInfoFinalCorsi = (rows) => {
    

    let corsiAnswers = {
        2: '6-9',
        3: '3-8',
        4: '2-7-6',
        5: '5-4-3',
        6: '8-2-7-1',
        7: '9-1-4-3',
        8: '1-10-2-8-5',
        9: '10-3-7-5-4',
        10: '8-2-7-6-5-9',
        11: '7-4-1-3-6-10',
        12: '9-2-1-8-5-10-3',
        14: '8-3',
        15: '9-6',
        16: '3-4-5',
        17: '6-7-2',
        18: '3-4-1-9',
        19: '1-7-2-8',
        20: '4-5-7-3-10',
        21: '5-8-2-10-1',
        22: '10-6-3-1-4-7',
        23: '9-5-6-7-2-8',
        24: '4-1-6-5-4-9-2'
    }
        

    let rowArray = Object.entries(rows)
    let studentRow = []
    let puntaje_total = 0;
    rowArray.forEach((row, key) => {
        if (key == 0) {

            if (row[1]['value'].length == 0) {
                studentRow.push('0') 
            } else {
                if (row[1].num === 1) {
                    studentRow.push(row[1]['value']);
                } else if (row[1].num === 13) {
                    //cambiar lugar en el studentRow
                    studentRow.push(row[1]['value'])
                } else {
                //aca tengo que pushear resultado y respuesta
                if (corsiAnswers[row[1].num] === row[1].value) {
                    studentRow.push('1')
                    studentRow.push(row[1]['value'])
                    puntaje_total++
                } else {
                    studentRow.push('0')
                    studentRow.push(row[1]['value'])
                }
                }

            } 
            
        } else {
            if (row[1].num === 1) {
                studentRow.push(row[1]['value']);
            } else if (row[1].num === 13) {
                //cambiar lugar en el studentRow
                studentRow.splice(8, 0, row[1].value);
            } else {
            //aca tengo que pushear resultado y respuesta
            if (row[1].num === 14 || row[1].num === 15 || row[1].num === 2 || row[1].num === 3) {
                if (corsiAnswers[row[1].num] === row[1].value) {
                    studentRow.push(row[1]['value'])
                    studentRow.push('1')
                } else {
                    studentRow.push(row[1]['value'])
                    studentRow.push('0')
                }
            } else {
                if (corsiAnswers[row[1].num] === row[1].value) {
                    studentRow.push(row[1]['value'])
                    studentRow.push('1')
                    puntaje_total++
                } else {
                    studentRow.push(row[1]['value'])
                    studentRow.push('0')
                }
            }

        }}

        if (row[1].num === 24) { // cada vez que terminamos de recorrerlos, sumamos los puntos totales al array de respuestas
            studentRow.splice(0, 0, puntaje_total);
        } 

    })


    return studentRow;
    
}

exports.getInfoFinal = (rows) => {


    let rowArray = Object.entries(rows)
    let studentRow = []

    rowArray.forEach((row, key)=> {
        if (key == 0) {

            if (row[1]['value'].length == 0) {
                studentRow.push('0') 
            } else {
                studentRow.push(row[1]['value'])
            } 
            
        } else {
            if (row[1]['value'].length == 0) {
                studentRow.push('0') 
            } else {
                studentRow.push(row[1]['value'])
            } 
        }
    })

    return studentRow;
    
}




exports.getInfoHNFFinal = (rows) => {
    let lastIndex = Object.entries(rows).length;

    let rowArray = Object.entries(rows)
    let studentRow = []
    let studentAnswers = [];
    let exampleHeartTotal = 0;
    let exampleFlowersTotal = 0;
    let heartTotal = 0;
    let flowerTotal = 0;
    let HNFTotal = 0;
    rowArray.forEach((row, key) => {
        if (key == 0) {




            studentAnswers.push({
                item: row[1].num,
                value: row[1].value,
                time: row[1].time
            })

            
        } else {

            studentAnswers.push({
                item: row[1].num,
                value: row[1].value,
                time: row[1].time
            })
        }

        if (key == lastIndex-1) {
            if (studentAnswers.length > 0) {
                console.log("Hacemos logica para sacar los resultados")
 
                let score_hearts = 0;
                let time_seconds_hearts = 0;
                let score_flowers = 0;
                let time_seconds_flowers = 0;
                let score_hearts_flowers = 0;
                let time_seconds_hearts_flowers = 0;


                studentAnswers.forEach((answer) => {

                    if (answer.item > 6 && answer.item < 19) {
                        score_hearts = score_hearts + parseFloat(answer.value)
                        time_seconds_hearts = time_seconds_hearts + parseFloat(answer.time)
                        heartTotal++
                    } else if (answer.item >= 25 && answer.item <= 36) {
                        score_flowers = score_flowers + parseFloat(answer.value)
                        time_seconds_flowers = time_seconds_hearts + parseFloat(answer.time)
                        flowerTotal++
                    } else if (answer.item >= 37) {
                        score_hearts_flowers = score_hearts_flowers + parseInt(answer.value);
                        time_seconds_hearts_flowers = time_seconds_hearts_flowers + parseFloat(answer.time)
                        HNFTotal++
                    }
                })

                //Calculamos cuandtos items le falto contestar y por cada item multiplicamos por 2, es decir que si le faltan 2 respuestas son 4 segundos, si le faltan 7 respuestas son 14 segundos.
                const notSelectedHeartTime = (12 - heartTotal) * 2;
                const notSelectedFlowerTime = (12 - flowerTotal) * 2;
                const notSelectedHNFTime = (33 - HNFTotal) * 2;

                time_seconds_hearts = time_seconds_hearts + notSelectedHeartTime;
                time_seconds_flowers = time_seconds_flowers + notSelectedFlowerTime;
                time_seconds_hearts_flowers = time_seconds_hearts_flowers + notSelectedHNFTime;

                let hnfTotal = score_hearts + score_flowers + score_hearts_flowers;
                let total_time = time_seconds_hearts + time_seconds_flowers + time_seconds_hearts_flowers;

                studentRow.push(hnfTotal)
                studentRow.push(score_hearts)
                studentRow.push(time_seconds_hearts)
                studentRow.push(score_flowers)
                studentRow.push(time_seconds_flowers)
                studentRow.push(score_hearts_flowers)
                studentRow.push(time_seconds_hearts_flowers)
                studentRow.push(total_time)


            }
        }
    })

    return studentRow;

}