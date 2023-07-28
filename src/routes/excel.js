const router = require('express').Router();
const mysqlConnection = require('../database/database')
const momentService = require('../moments/moments.service')
const studentsService = require('../students/students.service')
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const excelService = require('../services/excel.service')

function getAllMissingStudentsData (allStudentsRows, allStudentsInfo, headers) {
    //const allStudentsInfo = await studentsService.getAllStudentsInfo();
    const records = allStudentsRows;

    const completedStudents = allStudentsRows.map((studentRow) => studentRow[0])

    const allStudents = allStudentsInfo.map((student) => student.rut)

    const missingStudents = allStudents.filter((element) => !completedStudents.includes(element));

    const missingStudentsData = missingStudents.map((missingStudent) => {
        const missingData = allStudentsInfo.find((element) => element.rut == missingStudent);
        const completedStudentData = [missingData.rut, missingData.alumno, missingData.gender, `${missingData.level} ${missingData.course}`, "", missingData.escuela, ""]
        const testLengthData = allStudentsRows[0].length - completedStudentData.length;
        for (var i = 0; i < testLengthData; i++) {
            completedStudentData.push('')
        }
        return completedStudentData
    })

    const allRecords = [...allStudentsRows, ...missingStudentsData];
    let sortedRecords = allRecords.sort((a, b) => {
        const firstA = a[0];
        const firstB = b[0];
        if (typeof firstA === 'string' && typeof firstB === 'string') {
          return firstA.localeCompare(firstB);
        }
        return firstA - firstB;
      });

    const orderedRecords = sortedRecords.reverse();
    orderedRecords.unshift(headers)
    return orderedRecords;
}

const instrument_1 = {
    1: { num: 1, value: "", text: null, alternative: null, time: null},
    2: { num: 2, value: "", text: null, alternative: null, time: null},
    3: { num: 3, value: "", text: null, alternative: null, time: null},
    4: { num: 4, value: "", text: null, alternative: null, time: null},
    5: { num: 5, value: "", text: null, alternative: null, time: null},
    6: { num: 6, value: "", text: null, alternative: null, time: null},
    7: { num: 7, value: "", text: null, alternative: null, time: null},
    8: { num: 8, value: "", text: null, alternative: null, time: null},
    9: { num: 9, value: "", text: null, alternative: null, time: null},
    10: { num: 10, value: "", text: null, alternative: null, time: null},
    11: { num: 11, value: "", text: null, alternative: null, time: null},
    12: { num: 12, value: "", text: null, alternative: null, time: null},
    13: { num: 13, value: "", text: null, alternative: null, time: null},
    14: { num: 14, value: "", text: null, alternative: null, time: null},
    15: { num: 15, value: "", text: null, alternative: null, time: null},
    16: { num: 16, value: "", text: null, alternative: null, time: null},
    17: { num: 17, value: "", text: null, alternative: null, time: null},
    18: { num: 18, value: "", text: null, alternative: null, time: null},
    19: { num: 19, value: "", text: null, alternative: null, time: null},
    20: { num: 20, value: "", text: null, alternative: null, time: null},
    21: { num: 21, value: "", text: null, alternative: null, time: null},
    22: { num: 22, value: "", text: null, alternative: null, time: null},
    23: { num: 23, value: "", text: null, alternative: null, time: null},
    24: { num: 24, value: "", text: null, alternative: null, time: null},
    25: { num: 25, value: "", text: null, alternative: null, time: null},
    26: { num: 26, value: "", text: null, alternative: null, time: null},
    27: { num: 27, value: "", text: null, alternative: null, time: null},
    28: { num: 28, value: "", text: null, alternative: null, time: null},
    29: { num: 29, value: "", text: null, alternative: null, time: null},
    30: { num: 30, value: "", text: null, alternative: null, time: null},
    31: { num: 31, value: "", text: null, alternative: null, time: null},
    32: { num: 32, value: "", text: null, alternative: null, time: null},
    33: { num: 33, value: "", text: null, alternative: null, time: null},
    34: { num: 34, value: "", text: null, alternative: null, time: null},
    35: { num: 35, value: "", text: null, alternative: null, time: null},
    36: { num: 36, value: "", text: null, alternative: null, time: null},
    37: { num: 37, value: "", text: null, alternative: null, time: null},
    38: { num: 38, value: "", text: null, alternative: null, time: null},
    39: { num: 39, value: "", text: null, alternative: null, time: null},
    40: { num: 40, value: "", text: null, alternative: null, time: null},
    41: { num: 41, value: "", text: null, alternative: null, time: null},
    42: { num: 42, value: "", text: null, alternative: null, time: null},
    43: { num: 43, value: "", text: null, alternative: null, time: null},
    44: { num: 44, value: "", text: null, alternative: null, time: null},
    45: { num: 45, value: "", text: null, alternative: null, time: null},
    46: { num: 46, value: "", text: null, alternative: null, time: null},
    47: { num: 47, value: "", text: null, alternative: null, time: null},
    48: { num: 48, value: "", text: null, alternative: null, time: null},
    49: { num: 49, value: "", text: null, alternative: null, time: null},
    50: { num: 50, value: "", text: null, alternative: null, time: null},
    51: { num: 51, value: "", text: null, alternative: null, time: null},
    52: { num: 52, value: "", text: null, alternative: null, time: null},
    53: { num: 53, value: "", text: null, alternative: null, time: null},
    54: { num: 54, value: "", text: null, alternative: null, time: null},
    55: { num: 55, value: "", text: null, alternative: null, time: null},
    56: { num: 56, value: "", text: null, alternative: null, time: null},
    57: { num: 57, value: "", text: null, alternative: null, time: null},
    58: { num: 58, value: "", text: null, alternative: null, time: null},
    59: { num: 59, value: "", text: null, alternative: null, time: null},
    60: { num: 60, value: "", text: null, alternative: null, time: null},
    61: { num: 61, value: "", text: null, alternative: null, time: null},
    62: { num: 62, value: "", text: null, alternative: null, time: null},
    63: { num: 63, value: "", text: null, alternative: null, time: null},
    64: { num: 64, value: "", text: null, alternative: null, time: null},
    65: { num: 65, value: "", text: null, alternative: null, time: null},
    66: { num: 66, value: "", text: null, alternative: null, time: null},
    67: { num: 67, value: "", text: null, alternative: null, time: null},
    68: { num: 68, value: "", text: null, alternative: null, time: null},
    69: { num: 69, value: "", text: null, alternative: null, time: null},
    70: { num: 70, value: "", text: null, alternative: null, time: null},
    71: { num: 71, value: "", text: null, alternative: null, time: null},
    72: { num: 72, value: "", text: null, alternative: null, time: null},

    
}

const instrument_2 = {
    1: {num: 1, value: '', text: null, alternative: null, time: null},
    2: {num: 2, value: '', text: null, alternative: null, time: null},
    3: {num: 3, value: '', text: null, alternative: null, time: null},
    4: {num: 4, value: '', text: null, alternative: null, time: null},
    5: {num: 5, value: '', text: null, alternative: null, time: null},
    6: {num: 6, value: '', text: null, alternative: null, time: null},
    7: {num: 7, value: '', text: null, alternative: null, time: null},
    8: {num: 8, value: '', text: null, alternative: null, time: null},
    9: {num: 9, value: '', text: null, alternative: null, time: null},
    10: {num: 10, value: '', text: null, alternative: null, time: null},
    11: {num: 11, value: '', text: null, alternative: null, time: null},
    12: {num: 12, value: '', text: null, alternative: null, time: null},
    13: {num: 13, value: '', text: null, alternative: null, time: null},
    14: {num: 14, value: '', text: null, alternative: null, time: null},
    15: {num: 15, value: '', text: null, alternative: null, time: null},
    16: {num: 16, value: '', text: null, alternative: null, time: null},
    17: {num: 17, value: '', text: null, alternative: null, time: null},
    18: {num: 18, value: '', text: null, alternative: null, time: null},
    19: {num: 19, value: '', text: null, alternative: null, time: null},
    20: {num: 20, value: '', text: null, alternative: null, time: null},
    21: {num: 21, value: '', text: null, alternative: null, time: null},
    22: {num: 22, value: '', text: null, alternative: null, time: null},
    23: {num: 23, value: '', text: null, alternative: null, time: null},
    24: {num: 24, value: '', text: null, alternative: null, time: null},
    25: {num: 25, value: '', text: null, alternative: null, time: null},
    26: {num: 26, value: '', text: null, alternative: null, time: null},
    27: {num: 27, value: '', text: null, alternative: null, time: null},
    28: {num: 28, value: '', text: null, alternative: null, time: null},
    29: {num: 29, value: '', text: null, alternative: null, time: null},
    30: {num: 30, value: '', text: null, alternative: null, time: null},
    31: {num: 31, value: '', text: null, alternative: null, time: null},
    32: {num: 32, value: '', text: null, alternative: null, time: null},
    33: {num: 33, value: '', text: null, alternative: null, time: null},
    34: {num: 34, value: '', text: null, alternative: null, time: null},
    35: {num: 35, value: '', text: null, alternative: null, time: null},
    36: {num: 36, value: '', text: null, alternative: null, time: null},
    37: {num: 37, value: '', text: null, alternative: null, time: null},
    38: {num: 38, value: '', text: null, alternative: null, time: null},
    39: {num: 39, value: '', text: null, alternative: null, time: null},
    40: {num: 40, value: '', text: null, alternative: null, time: null},
    41: {num: 41, value: '', text: null, alternative: null, time: null},
    42: {num: 42, value: '', text: null, alternative: null, time: null},
    43: {num: 43, value: '', text: null, alternative: null, time: null},
    44: {num: 44, value: '', text: null, alternative: null, time: null},
    45: {num: 45, value: '', text: null, alternative: null, time: null},
    46: {num: 46, value: '', text: null, alternative: null, time: null},
    47: {num: 47, value: '', text: null, alternative: null, time: null},
    48: {num: 48, value: '', text: null, alternative: null, time: null},
    49: {num: 49, value: '', text: null, alternative: null, time: null},
    50: {num: 50, value: '', text: null, alternative: null, time: null},
    51: {num: 51, value: '', text: null, alternative: null, time: null},
    52: {num: 52, value: '', text: null, alternative: null, time: null},
    53: {num: 53, value: '', text: null, alternative: null, time: null},
    54: {num: 54, value: '', text: null, alternative: null, time: null},
    55: {num: 55, value: '', text: null, alternative: null, time: null},
    56: {num: 56, value: '', text: null, alternative: null, time: null},
    57: {num: 57, value: '', text: null, alternative: null, time: null},
    58: {num: 58, value: '', text: null, alternative: null, time: null},
    59: {num: 59, value: '', text: null, alternative: null, time: null}
}

const instrument_3 = {
    1: {num: 1, value: '', text: null, alternative: null, time: null},
    2: {num: 2, value: '', text: null, alternative: null, time: null},
    3: {num: 3, value: '', text: null, alternative: null, time: null},
    4: {num: 4, value: '', text: null, alternative: null, time: null},
    5: {num: 5, value: '', text: null, alternative: null, time: null},
    6: {num: 6, value: '', text: null, alternative: null, time: null},
    7: {num: 7, value: '', text: null, alternative: null, time: null},
    8: {num: 8, value: '', text: null, alternative: null, time: null},
    9: {num: 9, value: '', text: null, alternative: null, time: null},
    10: {num: 10, value: '', text: null, alternative: null, time: null},
    11: {num: 11, value: '', text: null, alternative: null, time: null},
    12: {num: 12, value: '', text: null, alternative: null, time: null},
    13: {num: 13, value: '', text: null, alternative: null, time: null},
    14: {num: 14, value: '', text: null, alternative: null, time: null},
    15: {num: 15, value: '', text: null, alternative: null, time: null},
    16: {num: 16, value: '', text: null, alternative: null, time: null},
    17: {num: 17, value: '', text: null, alternative: null, time: null},
    18: {num: 18, value: '', text: null, alternative: null, time: null},
    19: {num: 19, value: '', text: null, alternative: null, time: null},
    20: {num: 20, value: '', text: null, alternative: null, time: null},
    21: {num: 21, value: '', text: null, alternative: null, time: null},
    22: {num: 22, value: '', text: null, alternative: null, time: null},
    23: {num: 23, value: '', text: null, alternative: null, time: null},
    24: {num: 24, value: '', text: null, alternative: null, time: null},
    25: {num: 25, value: '', text: null, alternative: null, time: null},
    26: {num: 26, value: '', text: null, alternative: null, time: null},
    27: {num: 27, value: '', text: null, alternative: null, time: null},
    28: {num: 28, value: '', text: null, alternative: null, time: null},
    29: {num: 29, value: '', text: null, alternative: null, time: null},
    30: {num: 30, value: '', text: null, alternative: null, time: null},
    31: {num: 31, value: '', text: null, alternative: null, time: null}

}

const instrument_4 = {
    1: {num: 1, value: '', text: null, alternative: null, time: null},
    2: {num: 2, value: '', text: null, alternative: null, time: null},
    3: {num: 3, value: '', text: null, alternative: null, time: null},
    4: {num: 4, value: '', text: null, alternative: null, time: null},
    5: {num: 5, value: '', text: null, alternative: null, time: null},
    6: {num: 6, value: '', text: null, alternative: null, time: null},
    7: {num: 7, value: '', text: null, alternative: null, time: null},
    8: {num: 8, value: '', text: null, alternative: null, time: null},
    9: {num: 9, value: '', text: null, alternative: null, time: null},
    10: {num: 10, value: '', text: null, alternative: null, time: null},
    11: {num: 11, value: '', text: null, alternative: null, time: null},
    12: {num: 12, value: '', text: null, alternative: null, time: null},
    13: {num: 13, value: '', text: null, alternative: null, time: null},
    14: {num: 14, value: '', text: null, alternative: null, time: null},
    15: {num: 15, value: '', text: null, alternative: null, time: null},
    16: {num: 16, value: '', text: null, alternative: null, time: null},
    17: {num: 17, value: '', text: null, alternative: null, time: null},
    18: {num: 18, value: '', text: null, alternative: null, time: null},
    19: {num: 19, value: '', text: null, alternative: null, time: null},
    20: {num: 20, value: '', text: null, alternative: null, time: null},
    21: {num: 21, value: '', text: null, alternative: null, time: null},
    22: {num: 22, value: '', text: null, alternative: null, time: null},
    23: {num: 23, value: '', text: null, alternative: null, time: null},
    24: {num: 24, value: '', text: null, alternative: null, time: null},
    25: {num: 25, value: '', text: null, alternative: null, time: null},
    26: {num: 26, value: '', text: null, alternative: null, time: null},
}

const instrument_5 = {
    1: {num: 1, value: 0, text: null, alternative: null, time: null},
    2: {num: 2, value: 0, text: null, alternative: null, time: null},
    3: {num: 3, value: 0, text: null, alternative: null, time: null},
    4: {num: 4, value: 0, text: null, alternative: null, time: null},
    5: {num: 5, value: 0, text: null, alternative: null, time: null},
    6: {num: 6, value: 0, text: null, alternative: null, time: null},
    7: {num: 7, value: 0, text: null, alternative: null, time: null},
    8: {num: 8, value: 0, text: null, alternative: null, time: null},
    9: {num: 9, value: 0, text: null, alternative: null, time: null},
    10: {num: 10, value: 0, text: null, alternative: null, time: null},
    11: {num: 11, value: 0, text: null, alternative: null, time: null},
    12: {num: 12, value: 0, text: null, alternative: null, time: null},
}

const instrument_6 = {
    1: {num: 1, value: '', text: null, alternative: null, time: null},
    2: {num: 2, value: '', text: null, alternative: null, time: null},
    3: {num: 3, value: '', text: null, alternative: null, time: null},
    4: {num: 4, value: '', text: null, alternative: null, time: null},
    5: {num: 5, value: '', text: null, alternative: null, time: null},
    6: {num: 6, value: '', text: null, alternative: null, time: null},
    7: {num: 7, value: '', text: null, alternative: null, time: null},
    8: {num: 8, value: '', text: null, alternative: null, time: null},
    9: {num: 9, value: '', text: null, alternative: null, time: null},
    10: {num: 10, value: '', text: null, alternative: null, time: null},
    11: {num: 11, value: '', text: null, alternative: null, time: null},
    12: {num: 12, value: '', text: null, alternative: null, time: null},
    13: {num: 13, value: '', text: null, alternative: null, time: null},
    14: {num: 14, value: '', text: null, alternative: null, time: null},
    15: {num: 15, value: '', text: null, alternative: null, time: null},
    16: {num: 16, value: '', text: null, alternative: null, time: null},
    17: {num: 17, value: '', text: null, alternative: null, time: null},
    18: {num: 18, value: '', text: null, alternative: null, time: null},
    19: {num: 19, value: '', text: null, alternative: null, time: null},
    20: {num: 20, value: '', text: null, alternative: null, time: null},
    21: {num: 21, value: '', text: null, alternative: null, time: null},
    22: {num: 22, value: '', text: null, alternative: null, time: null},
    23: {num: 23, value: '', text: null, alternative: null, time: null},
    24: {num: 24, value: '', text: null, alternative: null, time: null},

}

const instrument_7 = {
    1: { num: 1, value: "0", text: null, alternative: null, time: 0},
    2: { num: 2, value: "0", text: null, alternative: null, time: 0},
    3: { num: 3, value: "0", text: null, alternative: null, time: 0},
    4: { num: 4, value: "0", text: null, alternative: null, time: 0},
    5: { num: 5, value: "0", text: null, alternative: null, time: 0},
    6: { num: 6, value: "0", text: null, alternative: null, time: 0},
    7: { num: 7, value: "0", text: null, alternative: null, time: 0},
    8: { num: 8, value: "0", text: null, alternative: null, time: 0},
    9: { num: 9, value: "0", text: null, alternative: null, time: 0},
    10: { num: 10, value: "0", text: null, alternative: null, time: 0},
    11: { num: 11, value: "0", text: null, alternative: null, time: 0},
    12: { num: 12, value: "0", text: null, alternative: null, time: 0},
    13: { num: 13, value: "0", text: null, alternative: null, time: 0},
    14: { num: 14, value: "0", text: null, alternative: null, time: 0},
    15: { num: 15, value: "0", text: null, alternative: null, time: 0},
    16: { num: 16, value: "0", text: null, alternative: null, time: 0},
    17: { num: 17, value: "0", text: null, alternative: null, time: 0},
    18: { num: 18, value: "0", text: null, alternative: null, time: 0},
    19: { num: 19, value: "0", text: null, alternative: null, time: 0},
    20: { num: 20, value: "0", text: null, alternative: null, time: 0},
    21: { num: 21, value: "0", text: null, alternative: null, time: 0},
    22: { num: 22, value: "0", text: null, alternative: null, time: 0},
    23: { num: 23, value: "0", text: null, alternative: null, time: 0},
    24: { num: 24, value: "0", text: null, alternative: null, time: 0},
    25: { num: 25, value: "0", text: null, alternative: null, time: 0},
    26: { num: 26, value: "0", text: null, alternative: null, time: 0},
    27: { num: 27, value: "0", text: null, alternative: null, time: 0},
    28: { num: 28, value: "0", text: null, alternative: null, time: 0},
    29: { num: 29, value: "0", text: null, alternative: null, time: 0},
    30: { num: 30, value: "0", text: null, alternative: null, time: 0},
    31: { num: 31, value: "0", text: null, alternative: null, time: 0},
    32: { num: 32, value: "0", text: null, alternative: null, time: 0},
    33: { num: 33, value: "0", text: null, alternative: null, time: 0},
    34: { num: 34, value: "0", text: null, alternative: null, time: 0},
    35: { num: 35, value: "0", text: null, alternative: null, time: 0},
    36: { num: 36, value: "0", text: null, alternative: null, time: 0},
    37: { num: 37, value: "0", text: null, alternative: null, time: 0},
    38: { num: 38, value: "0", text: null, alternative: null, time: 0},
    39: { num: 39, value: "0", text: null, alternative: null, time: 0},
    40: { num: 40, value: "0", text: null, alternative: null, time: 0},
    41: { num: 41, value: "0", text: null, alternative: null, time: 0},
    42: { num: 42, value: "0", text: null, alternative: null, time: 0},
    43: { num: 43, value: "0", text: null, alternative: null, time: 0},
    44: { num: 44, value: "0", text: null, alternative: null, time: 0},
    45: { num: 45, value: "0", text: null, alternative: null, time: 0},
    46: { num: 46, value: "0", text: null, alternative: null, time: 0},
    47: { num: 47, value: "0", text: null, alternative: null, time: 0},
    48: { num: 48, value: "0", text: null, alternative: null, time: 0},
    49: { num: 49, value: "0", text: null, alternative: null, time: 0},
    50: { num: 50, value: "0", text: null, alternative: null, time: 0},
    51: { num: 51, value: "0", text: null, alternative: null, time: 0},
    52: { num: 52, value: "0", text: null, alternative: null, time: 0},
    53: { num: 53, value: "0", text: null, alternative: null, time: 0},
    54: { num: 54, value: "0", text: null, alternative: null, time: 0},
    55: { num: 55, value: "0", text: null, alternative: null, time: 0},
    56: { num: 56, value: "0", text: null, alternative: null, time: 0},
    57: { num: 57, value: "0", text: null, alternative: null, time: 0},
    58: { num: 58, value: "0", text: null, alternative: null, time: 0},
    59: { num: 59, value: "0", text: null, alternative: null, time: 0},
    60: { num: 60, value: "0", text: null, alternative: null, time: 0},
    61: { num: 61, value: "0", text: null, alternative: null, time: 0},
    62: { num: 62, value: "0", text: null, alternative: null, time: 0},
    63: { num: 63, value: "0", text: null, alternative: null, time: 0},
    64: { num: 64, value: "0", text: null, alternative: null, time: 0},
    65: { num: 65, value: "0", text: null, alternative: null, time: 0},
    66: { num: 66, value: "0", text: null, alternative: null, time: 0},
    67: { num: 67, value: "0", text: null, alternative: null, time: 0},
    68: { num: 68, value: "0", text: null, alternative: null, time: 0},
    69: { num: 69, value: "0", text: null, alternative: null, time: 0},

}

const instrument_8 = {
    1: {num: 1, value: '0', text: '', alternative: null, time: null},
    2: {num: 2, value: '0', text: '', alternative: null, time: null},
    3: {num: 3, value: '0', text: '', alternative: null, time: null},
    4: {num: 4, value: '0', text: '', alternative: null, time: null},
    5: {num: 5, value: '0', text: '', alternative: null, time: null},
    6: {num: 6, value: '0', text: '', alternative: null, time: null},
    7: {num: 7, value: '0', text: '', alternative: null, time: null},
    8: {num: 8, value: '0', text: '', alternative: null, time: null},
    9: {num: 9, value: '0', text: '', alternative: null, time: null},
    10: {num: 10, value: '0', text: '', alternative: null, time: null},
    11: {num: 11, value: '0', text: '', alternative: null, time: null},
    12: {num: 12, value: '0', text: '', alternative: null, time: null},
    13: {num: 13, value: '0', text: '', alternative: null, time: null},
    14: {num: 14, value: '0', text: '', alternative: null, time: null},
    15: {num: 15, value: '0', text: '', alternative: null, time: null},
    16: {num: 16, value: '0', text: '', alternative: null, time: null},
    17: {num: 17, value: '0', text: '', alternative: null, time: null},
    18: {num: 18, value: '0', text: '', alternative: null, time: null},
    19: {num: 19, value: '0', text: '', alternative: null, time: null},
    20: {num: 20, value: '0', text: '', alternative: null, time: null},
    21: {num: 21, value: '0', text: '', alternative: null, time: null},
    22: {num: 22, value: '0', text: '', alternative: null, time: null},
    23: {num: 23, value: '0', text: '', alternative: null, time: null},
    24: {num: 24, value: '0', text: '', alternative: null, time: null},

}

const allInstruments = {
    1: instrument_1,
    2: instrument_2,
    3: instrument_3,
    4: instrument_4,
    5: instrument_5,
    6: instrument_6,
    7: instrument_7,
    8: instrument_8
}

//1. DATA: Basicamente esta cosa lo que hace es primero traerse toda la data dependiendo el momento
//2. HEADERS: Luego lo que hace es dado el primer elemento, saca todos los HEADERS
//3. ROWS: luego dependiendo del instrumento, hay una forma para calcular puntajes y setear la row

router.post('/', async (req, res) => {
    let instrument = req.body['instrument']
    let moment = req.body['moment']
    let schools = req.body['schools']
    let studyId = req.body['studyId']

    let sql;

    // Este if es porque los primeros 2 momentos sacamos el userId de Evaluation, y desde los otros desde instrument_list
    // Como el userId lo agregamos recientemente a instrument_list, tenemos que realizar queries distintas
    
    //este instrument 0 actualmente no es nada, no se para que isrve pero aca queda
    if (instrument == 0) {

        // no necesitamos una consulta para cada momento, ya que el userId en este caso al ser el instrumento 0 siempre será al user del evaluation

        sql = `SELECT 
        student.rut as rut, 
        concat(student.name , " ", student.surname) as alumno, 
        course.level as nivel,
        course.letter as curso,
        concat(user.name, " ", user.surname) as profesor, 
        student.gender as genero,
        school.name as colegio, 
        instrument_list.date as fecha, 
        choice.value,  
		choice.alternative,
        choice.time,
        choice.text,
        item.num, 
        choice.id,
        instrument.id as instrument,
        evaluation.id as eva,
        moment_id as moment
    FROM choice  
        INNER JOIN instrument_list ON choice.instrument_list_id = instrument_list.id 
        INNER JOIN instrument ON instrument.id = instrument_list.instrument_id 
        INNER JOIN evaluation ON instrument_list.evaluation_id = evaluation.id
        INNER JOIN user ON user.id = evaluation.user_id 
        INNER JOIN student ON evaluation.student_id = student.id 
        INNER JOIN moment ON moment.id = evaluation.moment_id 
        INNER JOIN study_list ON instrument.id = study_list.instrument_id 
        INNER JOIN course ON student.course_id = course.id 
        INNER JOIN school ON course.school_id = school.id 
        INNER JOIN item ON choice.item_id = item.id 
        
    GROUP BY student.rut, user.name, user.surname, instrument_list.date, choice.value, item.num, choice.id, evaluation.id, choice.time, choice.text, choice.alternative
    LIMIT 1000000;`

    } else {

        if (moment == 1 || moment == 2) {
            sql = `SELECT 
            student.rut as rut, 
            concat(student.name , " ", student.surname) as alumno, 
            concat(course.level , " ", course.letter) as curso,
            concat(user.name, " ", user.surname) as profesor, 
            student.gender as genero,
            school.name as colegio, instrument_list.date as fecha, 
            choice.value,  item.num, choice.id 
            FROM choice  
            INNER JOIN instrument_list ON choice.instrument_list_id = instrument_list.id 
            INNER JOIN instrument ON instrument.id = instrument_list.instrument_id 
            INNER JOIN evaluation ON instrument_list.evaluation_id = evaluation.id
            INNER JOIN user ON user.id = evaluation.user_id 
            INNER JOIN student ON evaluation.student_id = student.id 
            INNER JOIN moment ON moment.id = evaluation.moment_id 
            INNER JOIN study_list ON instrument.id = study_list.instrument_id 
            INNER JOIN course ON student.course_id = course.id 
            INNER JOIN school ON course.school_id = school.id 
            INNER JOIN item ON choice.item_id = item.id 
            WHERE instrument.id = ${instrument} 
            AND evaluation.moment_id = ${moment} 
            AND school.id 
            IN (${schools}); `
        } else {
            sql = `SELECT 
            student.rut as rut, 
            concat(student.name , " ", student.surname) as alumno, 
            concat(course.level , " ", course.letter) as curso,
            concat(user.name, " ", user.surname) as profesor, 
            student.gender as genero,
            school.name as colegio, instrument_list.date as fecha, 
            choice.value,  item.num, item.title, choice.id, 
            choice.alternative as alternative, 
            choice.text as text, choice.time as time,
            study.id as study   
            FROM choice  
            INNER JOIN instrument_list ON choice.instrument_list_id = instrument_list.id 
            INNER JOIN instrument ON instrument.id = instrument_list.instrument_id 
            INNER JOIN evaluation ON instrument_list.evaluation_id = evaluation.id
            INNER JOIN user ON instrument_list.evaluator_id = user.id
            INNER JOIN student ON evaluation.student_id = student.id 
            INNER JOIN moment ON moment.id = evaluation.moment_id 
            INNER JOIN study on study.id = moment.study_id
            INNER JOIN study_list ON instrument.id = study_list.instrument_id 
            INNER JOIN course ON student.course_id = course.id 
            INNER JOIN school ON course.school_id = school.id 
            INNER JOIN item ON choice.item_id = item.id 
            WHERE instrument.id = ${instrument} 
            AND evaluation.moment_id = ${moment} 
            AND study.id = ${studyId}
            AND school.id 
            IN (${schools});`
        }

    }
    
    

    
    function getDataRows () {


        return new Promise((resolve, reject) => {
            mysqlConnection.query(sql, (err, response) => {
                if (err) throw err;
                response = JSON.parse(JSON.stringify(response))
                resolve (response)
            })
        })

    }

    let rows = await getDataRows()


    if (instrument == 0) {
        let allStudents = await studentsService.getAllStudentsInfo(schools);
        let allMoments = await momentService.getMomentsIds();


        function getAllRows(allRows) {

            let parsedStudentsChoices = {};
            let studentRows = [];
            let currentStudent;
            let previousStudent = null;
            let studentData = {}
            let currentMoment = null;
            let previousMoment = null;
            let instrumentObject = {};
            let previousInstrument = null;
            let currentInstrument = null;

            allRows.forEach((row, key) => {

                if (row.moment == 8) {
                    console.log("papota")
                }

                if (row.alumno == "Marcela Contreras" && row.moment == 8 && row.instrument == 1 && row.num == 72) {
                    console.log("papita")
                }

        
                currentInstrument = row.instrument;
                currentMoment = row.moment;
                currentStudent = row.rut;

                if (row.rut == '20788918-1' && row.instrument == "5"){
                    console.log("lo ultim")
                    // esta funcion esta recibienedo los 12 datos pero los sobre erscribe y quedan 12.. ha yq hacer algo condiciona la ael instrument 5
                }


               

      
                if (row.instrument == "5") {
                        instrumentObject[Object.entries(instrumentObject).length+1] = {
                            "num": row.num,
                            "value": row.value,
                            "text": row.text,
                            "alternative":row.alternative,
                            "time":row.time
                        };
        
                } else{ 
                    instrumentObject[row.num] = {
                        "num": row.num,
                        "value": row.value,
                        "text": row.text,
                        "alternative":row.alternative,
                        "time":row.time
                    };
                }

                if (previousStudent === null) {
                    studentData.evaluador = row.profesor;
                    studentData.genero = row.genero;
                    studentData.colegio = row.colegio;
                    studentData.nombre = row.alumno;
                    studentData.rut = row.rut;
                    studentData.level = row.nivel;
                    studentData.course = row.curso;
                    studentData.date = row.fecha;


                } else {
                    if (previousStudent !== currentStudent) {
                        studentRows.push(studentData);
                        studentData = {}
                        if (parsedStudentsChoices[8] !== undefined) {
                            console.log("debug")
                        } else if (row.moment == 8) {
                            //Aca queda la ultima ultima vez 16/03, estoy validando las cantidades de datos perfect 5 + 301, y que los test vayan con los items que les faltan, instruments y evalauciones
                            //Lo que ahora esta fallando es que cuando estamos asignando por estudiante y ordenando por momentos aca de toda la data
                            // no estamos retornando los objetos totales, ahora en el momento 8 hay 4 o 5 no recuerdo test
                            // y solo figuran 2 en el output. Puede que sea un problema mas general pero CREO que solucionando esto al menos el de TODOS funcioanra impeque (sin limitaciones de study o moment)
                            console.log("que megda pasa")
                        }
                        
                        parsedStudentsChoices[`${previousMoment}`] = studentRows;
                        if (currentMoment !== previousMoment){
                            studentRows = [];
                        }
                        studentData.evaluador = row.profesor;
                        studentData.genero = row.genero;
                        studentData.colegio = row.colegio;
                        studentData.nombre = row.alumno;
                        studentData.rut = row.rut;
                        studentData.level = row.nivel;
                        studentData.course = row.curso;
                        studentData.date = row.fecha;
                        studentData.moment = row.moment;
                        instrumentObject = {}                        
                        instrumentObject[row.num] = {
                            "num": row.num,
                            "value": row.value,
                            "text": row.text,
                            "alternative":row.alternative,
                            "time":row.time
                        };



                    }
                }


      



               


            

                if (allInstruments[currentInstrument] !== undefined) {

                    //esto entra en el ultimo elemento del array hecho a partir del objeto y saca el num
                    const lastInstrumentItemNum = Object.entries(allInstruments[currentInstrument])[Object.entries(allInstruments[currentInstrument]).length -1][1].num


                    if (Object.entries(allInstruments[currentInstrument]).length === row.num) {
                        studentData[`instrument-${currentInstrument}`] = instrumentObject;
                        instrumentObject = {};
                    } 
                    // else if (currentInstrument == 8 && lastInstrumentItemNum == row.num) {
                    //     // este condicional es unico para el 8 porque ahi parti de 0 a 23 y no de 1 a 24 entonces queda desfasado el row.num (23) con el row.length = 24, por eso sacamos el num del item y lo comparamos con eso mejor.
                    //     studentData[`instrument-${currentInstrument}`] = instrumentObject;
                    //     instrumentObject = {};
                    // }
                } else {
                    console.log("quionda")
                }


                previousStudent = currentStudent;
                previousMoment = currentMoment;
                previousInstrument = currentInstrument;
            })
            parsedStudentsChoices[`${previousMoment}`] = studentData;
            return parsedStudentsChoices
        }

        const testsByMoment = getAllRows(rows);
        delete testsByMoment.null;


        let infoHeaders = ['rut', 'alumno','genero','fecha_de_nacimiento', 'colegio', 'diagnostico_oficial', 'observacion_evaluador'];
        let thisMomentInfo = ['evaluador_responsable', 'nivel', 'curso', 'fecha_evaluacion', 'edad_etapa']
        let tejasHeaders = ['pregunta_1', 'pregunta_2', 'pregunta_3', 'pregunta_4', 'pregunta_5', 'pregunta_6', 'pregunta_7', 'pregunta_8', 'pregunta_9', 'pregunta_10', 'pregunta_11', 'pregunta_12', 'pregunta_13', 'pregunta_14', 'pregunta_15', 'pregunta_16', 'pregunta_17', 'pregunta_18', 'pregunta_19', 'pregunta_20', 'pregunta_21', 'pregunta_22', 'pregunta_23', 'pregunta_24', 'pregunta_25', 'pregunta_26', 'pregunta_27', 'pregunta_28', 'pregunta_29', 'pregunta_30', 'pregunta_31', 'pregunta_32', 'pregunta_33', 'pregunta_34', 'pregunta_35', 'pregunta_36', 'pregunta_37', 'pregunta_38', 'pregunta_39', 'pregunta_40', 'pregunta_41', 'pregunta_42', 'pregunta_43',  'pregunta_44', 'pregunta_45', 'pregunta_46', 'pregunta_47', 'pregunta_48', 'pregunta_49', 'pregunta_50', 'pregunta_51', 'pregunta_52', 'pregunta_53', 'pregunta_54', 'pregunta_55', 'pregunta_56', 'pregunta_57', 'pregunta_58', 'pregunta_59', 'pregunta_60', 'pregunta_61', 'pregunta_62', 'pregunta_63', 'pregunta_64', 'pregunta_65', 'pregunta_66', 'pregunta_67', 'pregunta_68', 'pregunta_69', 'pregunta_70', 'pregunta_71', 'pregunta_72', 'puntaje_total']
        let precalculoHeaders = ['pregunta_1', 'pregunta_2', 'pregunta_3', 'pregunta_4', 'pregunta_5', 'pregunta_6', 'pregunta_7', 'pregunta_8', 'pregunta_9', 'pregunta_10', 'pregunta_11', 'pregunta_12', 'pregunta_13', 'pregunta_14', 'pregunta_15', 'pregunta_16', 'pregunta_17', 'pregunta_18', 'pregunta_19', 'pregunta_20', 'pregunta_21', 'pregunta_22', 'pregunta_23', 'pregunta_24', 'pregunta_25', 'pregunta_26', 'pregunta_27', 'pregunta_28', 'pregunta_29', 'pregunta_30', 'pregunta_31', 'pregunta_32', 'pregunta_33', 'pregunta_34', 'pregunta_35', 'pregunta_36', 'pregunta_37', 'pregunta_38', 'pregunta_39', 'pregunta_40', 'pregunta_41', 'pregunta_42', 'pregunta_43',  'pregunta_44', 'pregunta_45', 'pregunta_46', 'pregunta_47', 'pregunta_48', 'pregunta_49', 'pregunta_50', 'pregunta_51', 'pregunta_52', 'pregunta_53', 'pregunta_54', 'pregunta_55', 'pregunta_56', 'pregunta_57', 'pregunta_58', 'pregunta_59']
        let acesHeaders = ['puntaje_1', 'pregunta_1', 'puntaje_2', 'pregunta_2','puntaje_3', 'pregunta_3','puntaje_4', 'pregunta_4','puntaje_5', 'pregunta_5','puntaje_6', 'pregunta_6','puntaje_7', 'pregunta_7','puntaje_8', 'pregunta_8','puntaje_9', 'pregunta_9','puntaje_10', 'pregunta_10','puntaje_11', 'pregunta_11','puntaje_12', 'pregunta_12','puntaje_13', 'pregunta_13','puntaje_14', 'pregunta_14','puntaje_15', 'pregunta_15','puntaje_16', 'pregunta_16','puntaje_17', 'pregunta_17','puntaje_18', 'pregunta_18','puntaje_19', 'pregunta_19','puntaje_20', 'pregunta_20','puntaje_21', 'pregunta_21','puntaje_22', 'pregunta_22','puntaje_23', 'pregunta_23','puntaje_24', 'pregunta_24','puntaje_25', 'pregunta_25','puntaje_26', 'pregunta_26', 'puntaje_total']
        let wallyHeaders = ['emocion_1', 'conducta_1', 'emocion_2', 'conducta_2', 'emocion_3', 'conducta_3', 'emocion_4', 'conducta_4', 'emocion_5', 'conducta_5', 'emocion_6', 'conducta_6'];
        let corsiHeaders = ['corsi_total_0', 'ordered_tries', 'reversed_tries_0', 'corsi_ordered_example_1_0', 'answer', 'corsi_ordered_example_2_0', 'answer', 'corsi_ordered_example_3_0', 'answer', 'corsi_ordered_example_4_0', 'answer', 'corsi_ordered_example_5_0', 'answer', 'corsi_ordered_example_6_0', 'answer', 'corsi_ordered_example_7_0', 'answer', 'corsi_ordered_example_8_0', 'answer', 'corsi_ordered_example_9_0', 'answer', 'corsi_ordered_example_10_0', 'answer', 'corsi_ordered_example_11_0', 'answer', 'corsi_ordered_example_12_0', 'answer', 'corsi_ordered_example_13_0', 'answer', 'corsi_ordered_example_14_0', 'answer', 'corsi_reverse_example_15_0', 'answer', 'corsi_reverse_example_16_0', 'answer', 'corsi_reverse_example_17_0', 'answer', 'corsi_reverse_example_18_0', 'answer', 'corsi_reverse_example_19_0', 'answer', 'corsi_reverse_example_20_0', 'answer', 'corsi_reverse_example_21_0', 'answer', 'corsi_reverse_example_22_0', 'answer'];
        let HNFHeaders = ['hnf_total', 'score_hearts', 'time_seconds_hearts', 'score_flowers', 'time_seconds_flowers', 'score_heart_flowers', 'time_seconds_heart_flowers', 'total_time'];
        let fonoHeaders = ['ejemplo_a_score', 'ejemplo_a_answer', 'ejemplo_b_score', 'ejemplo_b_answer', 'item_1_score', 'item_1_answer', 'item_2_score', 'item_2_answer', 'item_3_score', 'item_3_answer','ejemplo_c_score', 'ejemplo_c_answer','item_4_score', 'item_4_answer','item_5_score', 'item_5_answer','item_6_score', 'item_6_answer','item_7_score', 'item_7_answer','item_8_score', 'item_8_answer','item_9_score', 'item_9_answer','item_10_score', 'item_10_answer','item_11_score', 'item_11_answer', 'item_12_score', 'item_12_answer','item_13_score', 'item_13_answer','item_14_score', 'item_14_answer','item_15_score', 'item_15_answer','item_16_score', 'item_16_answer','item_17_score', 'item_17_answer','item_18_score', 'item_18_answer','item_19_score', 'item_19_answer','item_20_score', 'item_20_answer','item_21_score', 'item_21_answer', 'total_points']

        // hay que agregar los headers principales solo 1 vez

        

        const momentsIds = Object.keys(testsByMoment);

        let allMomentsHeaders = [];

        momentsIds.forEach((moment) => {
            allMomentsHeaders.push(...thisMomentInfo,...tejasHeaders, ...precalculoHeaders, ...acesHeaders, ...wallyHeaders, ...corsiHeaders, ...HNFHeaders, ...fonoHeaders)
        })

        let allHeaders = [...infoHeaders, ...allMomentsHeaders]
        

        // let thisMomentHeaders = [...thisMomentInfo,...tejasHeaders, ...precalculoHeaders, ...acesHeaders, ...wallyHeaders, ...corsiHeaders, ...HNFHeaders, ...fonoHeaders];



        function addEmptyInstruments(studentRows) {
            const completedStudentRows = studentRows.map((momentRow, key) => {
                if (momentRow[0]) {
                    if (momentRow[0]['instrument-1'] == undefined){
                        momentRow[0]['instrument-1'] = instrument_1
                    } 
                    if (momentRow[0]['instrument-2'] == undefined) {
                        momentRow[0]['instrument-2'] = instrument_2
                    } 
                    if (momentRow[0]['instrument-4'] == undefined) {
                        momentRow[0]['instrument-4'] = instrument_4
                    } 
                    if (momentRow[0]['instrument-5'] == undefined) {
                        momentRow[0]['instrument-5'] = instrument_5
                    } 
                    if (momentRow[0]['instrument-6'] == undefined) {
                        momentRow[0]['instrument-6'] = instrument_6
                    }
                    if (momentRow[0]['instrument-7'] == undefined) {
                        momentRow[0]['instrument-7'] = instrument_7
                    }
    
                    if (momentRow[0]['instrument-8'] == undefined) {
                        momentRow[0]['instrument-8'] = instrument_8
                    }
                } else if (momentRow == false) {
                    momentRow = {}
                    momentRow['instrument-1'] = instrument_1
                    momentRow['instrument-2'] = instrument_2
                    momentRow['instrument-4'] = instrument_4
                    momentRow['instrument-5'] = instrument_5
                    momentRow['instrument-6'] = instrument_6
                    momentRow['instrument-7'] = instrument_7
                    momentRow['instrument-8'] = instrument_8

                }else {

                    console.log("Todo OK?")
                    if (momentRow['instrument-1'] == undefined) {
                        momentRow['instrument-1'] = instrument_1
                    }
                    if (momentRow['instrument-2'] == undefined) {
                        momentRow['instrument-2'] = instrument_2
                    }
                    if (momentRow['instrument-4'] == undefined) {
                        momentRow['instrument-4'] = instrument_4
                    }
                    if (momentRow['instrument-5'] == undefined) {
                        momentRow['instrument-5'] = instrument_5
                    }
                    if (momentRow['instrument-6'] == undefined) {
                        momentRow['instrument-6'] = instrument_6
                    }
                    if (momentRow['instrument-7'] == undefined) {
                        momentRow['instrument-7'] = instrument_7
                    }
                    if (momentRow['instrument-8'] == undefined) {
                        momentRow['instrument-8'] = instrument_8
                    }
                }

                return momentRow[0] ? momentRow[0] : momentRow;

   
                
            })

            return completedStudentRows;
        }

        function addEmptyMoments(studentRows, allMoments, emptyStudentInfo = undefined) {


            //Ahora deberia obtener cuales keys faltan
            // por cada key que falta, iremos a buscar a allMoments que momento le corresponde a esa key
            // obteniendo el momento y con la key, insertaremos un objeto en la key correspondiente
            // usaremos la data general que exista en otra llave (la podemos obtener cuando row no es undefined)
            // en la key insertaremos con esa data lo general y los instrumentos los asignaremos todos 
            // los que ya estan definidos arriba... luego se pasará al otro key que falta.
            
            let studentInfo = {}
            let emptyKeys = []
            studentRows.forEach((row, key) => {
                if (key === 0) {
                    if (emptyStudentInfo !== undefined && Object.entries(studentInfo).length == 0) {
                        studentInfo['evaluador'] = '';
                        studentInfo['genero'] = emptyStudentInfo.gender;
                        studentInfo['colegio'] = emptyStudentInfo.escuela;
                        studentInfo['nombre'] = emptyStudentInfo.alumno;
                        studentInfo['rut'] = emptyStudentInfo.rut;
                        studentInfo['nivel'] = emptyStudentInfo.level;
                        studentInfo['curso'] = emptyStudentInfo.course;
                        if (row) {
                            if (row.hasOwnProperty("date"))  {
                                studentInfo['fecha'] = row.date;
                            }
                        } else {
                            studentInfo['fecha'] = '';
                        }
 
                        

                    } else if (Object.entries(studentInfo).length == 0) {
                        studentInfo['evaluador'] = '';
                        studentInfo['genero'] = row.genero;
                        studentInfo['colegio'] = row.colegio;
                        studentInfo['nombre'] = row.nombre;
                        studentInfo['rut'] = row.rut;
                        studentInfo['nivel'] = row.level;
                        studentData['curso'] = row.course;
                        if (row) {
                            //tendre que comprobar de esta misma forma para enviar la edad u otras posibles cosas que no tengamos.
                            if (row.hasOwnProperty("date"))  {
                                studentInfo['fecha'] = row.date;
                            }
                        } else {
                            studentInfo['fecha'] = '';
                        }
                    }
                }
                if (row === undefined || row.length === 0) {
                    emptyKeys.push(key)
                } 
            })

            // no se estan contando las emptyKeys nose pq con los qu no tienen

            if (emptyKeys.length > 0) {
                emptyKeys.forEach((key) => {
                    const momentId = allMoments[key].id;

                    // studentInfo['evaluador'] = '';
                    // studentInfo['genero'] = row.genero;
                    // studentInfo['colegio'] = row.colegio;
                    // studentInfo['nombre'] = row.nombre;
                    // studentInfo['rut'] = row.rut;
                    // studentInfo['nivel'] = row.level;
                    // studentData['curso'] = row.course;
                    
                    studentRows[key] = {
                        "evaluador": studentInfo['evaluador'],
                        "genero": studentInfo['genero'],
                        "colegio": studentInfo['colegio'],
                        "nombre": studentInfo['nombre'],
                        "rut": studentInfo['rut'],
                        "nivel": studentInfo['nivel'],
                        "curso": studentInfo['curso'],
                        "moment": momentId,
                        "instrument-1": instrument_1,
                        "instrument-2": instrument_2,
                        "instrument-4": instrument_4,
                        "instrument-5": instrument_5,
                        "instrument-6": instrument_6,
                        "instrument-7": instrument_7,
                        "instrument-8": instrument_8
                    }
                })
            }

            return studentRows
        }

        function checkStudentMoments(studentRows) {
            let response = false;
            studentRows.forEach((row) => {
                if (row === undefined) {
                    response = true;
                }
            })
            return response;
        }


        function finalParsedRows (allStudentRows) {



        // let infoHeaders = ['rut', 'alumno','genero','fecha_de_nacimiento', 'colegio', 'diagnostico_oficial', 'observacion_evaluador'];
        // let thisMomentInfo = ['evaluador_responsable', 'nivel', 'curso', 'fecha_evaluacion', 'edad_etapa']
            const allFinalParsedRows = [];

            allStudentRows.forEach((studentRows, key) => {

                if (studentRows[1].rut == "20728918-3"){
                    console.log("ql con problemas")
                } else if (studentRows[1].rut == "25.772.208-2") {
                    console.log("ql con2 problemas")
                }

                studentRows.forEach((row, key) => {
                    if (row == false) {
                        console.log("asdasd")
                    }
                })
                const finalParsedRow = [];
                studentRows.forEach((row, key) => {
                    if (key == 0) {

                        

        // let infoHeaders = ['rut', 'alumno','genero','fecha_de_nacimiento', 'colegio', 'diagnostico_oficial', 'observacion_evaluador'];
        // let thisMomentInfo = ['evaluador_responsable', 'nivel', 'curso', 'fecha_evaluacion', 'edad_etapa']

                        //pusheo de datos generales
                        finalParsedRow.push(row.rut, row.nombre, row.genero, '2017/01/01', row.colegio, 'Diagnostico test', 'Observacion test')

                        //datos ya del momento

                        finalParsedRow.push(row.profesor ? row.profesor : row.evaluador, row.level ? row.level : row.nivel, row.course ? row.course : row.curso, row.date ? row.date : '', '0')

                        let instrument_1 = undefined;
                        let instrument_2 = undefined;
                        let instrument_4 = undefined;
                        let instrument_5 = undefined;
                        let instrument_6 = undefined;
                        let instrument_7 = undefined;
                        let instrument_8 = undefined;

                        if (Object.entries(row['instrument-1']).length !== Object.entries(allInstruments[1]).length) {
                            //Explicacion del porque de esto en el notion "InsertMissing"
                            instrument_1 = excelService.insertMissingObjects(row['instrument-1'], Object.entries(allInstruments[1]).length)
                        }

                        if (Object.entries(row['instrument-2']).length !== Object.entries(allInstruments[2]).length) {
                            //Explicacion del porque de esto en el notion "InsertMissing"
                            instrument_2 = excelService.insertMissingObjects(row['instrument-2'], Object.entries(allInstruments[2]).length)
                        }

                        if (Object.entries(row['instrument-4']).length !== Object.entries(allInstruments[4]).length) {
                            //Explicacion del porque de esto en el notion "InsertMissing"
                            instrument_4 = excelService.insertMissingObjects(row['instrument-4'], Object.entries(allInstruments[4]).length)
                        }

                        if (Object.entries(row['instrument-5']).length !== Object.entries(allInstruments[5]).length) {
                            //Explicacion del porque de esto en el notion "InsertMissing"
                            instrument_5 = excelService.insertMissingObjects(row['instrument-5'], Object.entries(allInstruments[5]).length)

                        }

                        if (Object.entries(row['instrument-6']).length !== Object.entries(allInstruments[6]).length) {
                            //Explicacion del porque de esto en el notion "InsertMissing"
                            instrument_6 = excelService.insertMissingObjects(row['instrument-6'], Object.entries(allInstruments[6]).length)

                        }

                        if (Object.entries(row['instrument-7']).length !== Object.entries(allInstruments[7]).length) {
                            //Explicacion del porque de esto en el notion "InsertMissing"
                            instrument_7 = excelService.insertMissingObjects(row['instrument-7'], Object.entries(allInstruments[7]).length)

                        }

                        if (Object.entries(row['instrument-8']).length !== Object.entries(allInstruments[8]).length) {
                            //Explicacion del porque de esto en el notion "InsertMissing"
                            instrument_8 = excelService.insertMissingObjects(row['instrument-8'], Object.entries(allInstruments[8]).length)

                        }

                        const tejasRows = excelService.getInfoTejasFinal(instrument_1 ? instrument_1 : row['instrument-1']);
                        const precalculoRows = excelService.getInfoCalculoFinal(instrument_2 ? instrument_2 : row['instrument-2']);
                        const acesRows = excelService.getInfoAcesFinal(instrument_4 ? instrument_4 : row['instrument-4']);
                        const wallyRows = excelService.getInfoFinal(instrument_5 ? instrument_5 : row['instrument-5']);
                        const corsiRows = excelService.getInfoFinalCorsi(instrument_6 ? instrument_6 : row['instrument-6']);
                        const HNFRows = excelService.getInfoHNFFinal(instrument_7 ? instrument_7 : row['instrument-7']);
                        const fonoRows = excelService.getInfoFonoFinal(instrument_8 ? instrument_8 : row['instrument-8']);




                        finalParsedRow.push(...tejasRows, ...precalculoRows, ...acesRows, ...wallyRows, ...corsiRows, ...HNFRows, ...fonoRows)

                        if (finalParsedRow.length != 313 && finalParsedRow.length != 619 && finalParsedRow.length != 925 && finalParsedRow.length != 1231 && finalParsedRow.length != 1537 ) {
                            console.log("Estos son los multiplos, si es que sale este mensaje es porque no agreguee el multiplo (del total q deberia ser de headers)  o es pq hay algo mal")
                        } 
                    } else {

                        let instrument_1 = undefined;
                        let instrument_2 = undefined;
                        let instrument_4 = undefined;
                        let instrument_5 = undefined;
                        let instrument_6 = undefined;
                        let instrument_7 = undefined;
                        let instrument_8 = undefined;

                        if (finalParsedRow.length != 12) {
                            finalParsedRow.push(row.profesor ? row.profesor : row.evaluador, row.level ? row.level : row.nivel, row.course ? row.course : row.curso, row.date ? row.date : '', '0')
                        }

                        if (row['instrument-1'] == undefined ||  row['instrument-1'] == null){
                            console.log("que ta pachando")
                        }
                        

                        if (Object.entries(row['instrument-1']).length !== Object.entries(allInstruments[1]).length) {
                            //Explicacion del porque de esto en el notion "InsertMissing"
                            instrument_1 = excelService.insertMissingObjects(row['instrument-1'], Object.entries(allInstruments[1]).length)
                        }

                        if (Object.entries(row['instrument-2']).length !== Object.entries(allInstruments[2]).length) {
                            //Explicacion del porque de esto en el notion "InsertMissing"
                            instrument_2 = excelService.insertMissingObjects(row['instrument-2'], Object.entries(allInstruments[2]).length)
                        }

                        if (Object.entries(row['instrument-4']).length !== Object.entries(allInstruments[4]).length) {
                            //Explicacion del porque de esto en el notion "InsertMissing"
                            instrument_4 = excelService.insertMissingObjects(row['instrument-4'], Object.entries(allInstruments[4]).length)
                        }

                        if (Object.entries(row['instrument-5']).length !== Object.entries(allInstruments[5]).length) {
                            //Explicacion del porque de esto en el notion "InsertMissing"
                            instrument_5 = excelService.insertMissingObjects(row['instrument-5'], Object.entries(allInstruments[5]).length)

                        }

                        if (Object.entries(row['instrument-6']).length !== Object.entries(allInstruments[6]).length) {
                            //Explicacion del porque de esto en el notion "InsertMissing"
                            instrument_6 = excelService.insertMissingObjects(row['instrument-6'], Object.entries(allInstruments[6]).length)

                        }

                        if (Object.entries(row['instrument-7']).length !== Object.entries(allInstruments[7]).length) {
                            //Explicacion del porque de esto en el notion "InsertMissing"
                            instrument_7 = excelService.insertMissingObjects(row['instrument-7'], Object.entries(allInstruments[7]).length)

                        }

                        if (Object.entries(row['instrument-8']).length !== Object.entries(allInstruments[8]).length) {
                            //Explicacion del porque de esto en el notion "InsertMissing"
                            instrument_8 = excelService.insertMissingObjects(row['instrument-8'], Object.entries(allInstruments[8]).length)

                        }

                        const tejasRows = excelService.getInfoTejasFinal(instrument_1 ? instrument_1 : row['instrument-1']);
                        const precalculoRows = excelService.getInfoCalculoFinal(instrument_2 ? instrument_2 : row['instrument-2']);
                        const acesRows = excelService.getInfoAcesFinal(instrument_4 ? instrument_4 : row['instrument-4']);
                        const wallyRows = excelService.getInfoFinal(instrument_5 ? instrument_5 : row['instrument-5']);
                        const corsiRows = excelService.getInfoFinalCorsi(instrument_6 ? instrument_6 : row['instrument-6']);
                        const HNFRows = excelService.getInfoHNFFinal(instrument_7 ? instrument_7 : row['instrument-7']);
                        const fonoRows = excelService.getInfoFonoFinal(instrument_8 ? instrument_8 : row['instrument-8']);

                        if (tejasRows.length !== 73){
                            console.log("algo pasa")
                        }
                        if (precalculoRows.length !== 59){
                            console.log("algo pasa")
                        }
                        if (acesRows.length !== 53){
                            console.log("algo pasa")
                        }
                        if (wallyRows.length !== 12){
                            console.log("algo pasa")
                        }
                        if (corsiRows.length !== 47){
                            console.log("algo pasa")
                        }
                        if (HNFRows.length !== 8){
                            console.log("algo pasa")
                        }
                        if (fonoRows.length !== 49){
                            console.log("algo pasa")
                        }

                        finalParsedRow.push(...tejasRows, ...precalculoRows, ...acesRows, ...wallyRows, ...corsiRows, ...HNFRows, ...fonoRows)

                        if (finalParsedRow.length != 313 && finalParsedRow.length != 619 && finalParsedRow.length != 925 && finalParsedRow.length != 1231 && finalParsedRow.length != 1537) {
                            console.log("problemilla esta distinto el length del final 313")
                        } 
                    }
                })

                if (finalParsedRow.length != 1537) {
                    console.log("problemilla esta distinto el length del final")
                } else {
                    console.log("WHAT?")
                }


                allFinalParsedRows.push(finalParsedRow)
            })

            return allFinalParsedRows

        }

        function numberOfEvaluations (studentRowsByMoment) {
            let counter = 0;
            studentRowsByMoment.forEach((row) => {
                counter = counter + row.length;
            })

            return counter;
        }

        const allStudentCompletedRows = allStudents.map((student) =>  {


            // esta funcion basicamente se encarga de dejar todo el orden qeu ya habiamos dado a un next level
            // se preocupa de integrar los momentos e instrumentos que no existan y dejar todo con el mismo formato.

            //recuerda que por cada alumno, estamos generando la ROW con todas sus datos correspondientes, es decir, info general y info por momento [instrumento]
            
            const localTestsByMoment = testsByMoment; // esto es para agarrar la data que llega nomas de la bdd
            const momentsIds = Object.keys(localTestsByMoment);


            const studentRowsByMoment = momentsIds.map((momentId) => {
                if (student.rut == "20428918-3" && momentId == 8 ) {
                    console.log("papita")
                }
                let rowsByMoment;
                if (localTestsByMoment[momentId].length != undefined) {
                    rowsByMoment = localTestsByMoment[momentId].filter((row) => row.rut == student.rut)
                } else {
                    rowsByMoment = localTestsByMoment[momentId].rut == student.rut && localTestsByMoment[momentId] 
                }
                return rowsByMoment;
            })

            // Esto es para contar la cantidad de evaluaciones que tiene el alumno actual
            //Mas abajo si es que es 0 agregamos todos los momentos vacios..
            // en caso de que no sea 0, agregaremos los instrumentos faltantes (ya que el de empty moments no añade instrumentos, solo evas, asi que es necesario del deinstrumentos)
            const evaluationCounter = numberOfEvaluations(studentRowsByMoment) 

            let newRows;

            if (evaluationCounter == 0) {
                newRows = addEmptyMoments(studentRowsByMoment, allMoments, student);
            } else {

                newRows = addEmptyInstruments(studentRowsByMoment);
                let isIncomplete = checkStudentMoments(newRows);
                if (isIncomplete){
                    newRows = addEmptyMoments(newRows, allMoments, student);
                }
            }

            return newRows;

        })

        const finalRows = finalParsedRows(allStudentCompletedRows);

        const csvDataFinal = [];
        csvDataFinal.push([...allHeaders])
        
        finalRows.forEach(
            row => {
                csvDataFinal.push(row);
            }
        )

        res.send(csvDataFinal)


        const csvWriter = createCsvWriter({
            header: allHeaders,
            path: 'file.csv'
        });
         
        const records = finalRows;
         
        csvWriter.writeRecords(records)      
            .then(() => {
                console.log('....Done');
            })
            .catch(err => console.log(err))




    } else {
    let infoHeaders = ['rut', 'alumno','genero','curso', 'evaluador', 'colegio', 'fecha'];
    let filteredRows = rows.filter(row => row.rut == rows[0]['rut'])
    let infoChoices = []
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
        
    // ACA añadimos los headers personalizados
    if (instrument == 4) {
        filteredRows.map(row => {
            infoAnswer = `puntaje_${row.num}`
            infoRow = `pregunta_${row.num}`
            infoChoices.push(infoAnswer)
            infoChoices.push(infoRow)
        })

        infoChoices.push('puntaje_total')
    } else if (instrument == 5){
        let index = 1;
        filteredRows.map(row => {
            if (index % 2 ==! 0) {
                infoRow = `emocion_${row.num}`
                infoChoices.push(infoRow)
            } else {
                infoRow = `conducta_${row.num}`
                infoChoices.push(infoRow)
            }
            index++

        })
    } else if (instrument == 1){
        filteredRows.map(row => {
            infoRow = `pregunta_${row.num}`;
            infoChoices.push(infoRow);
        })
        infoChoices.push('puntaje_total')
    } else if (instrument == 6){
        infoChoices.push('puntaje_total');
        infoChoices.push('intentos_ordenado');
        infoChoices.push('intentos_desordenado');

        filteredRows.map((row)=> {
            if (row.num === 1|| row.num === 2 || row.num === 13 || row.num === 14 ) {
                infoRow = `ordenado_${row.num}_ejemplo`;
                infoChoices.push(infoRow);
                infoRow = `respuesta`;
                infoChoices.push(infoRow);
            } else {
                if (row.num <= 11) {
                    infoRow = `ordenado_${row.num}`;
                    infoChoices.push(infoRow);
                    infoRow = `respuesta`;
                    infoChoices.push(infoRow);
                } else if (row.num <= 22) {
                    infoRow = `reversa_${row.num}`;
                    infoChoices.push(infoRow);
                    infoRow = `respuesta`;
                    infoChoices.push(infoRow);
                }
            }
            

        })
    
    } else if (instrument == 7) {
        infoRow = `hnf_total`;
        infoChoices.push(infoRow)
        infoRow = `score_hearts`;
        infoChoices.push(infoRow)
        infoRow = `time_seconds_hearts`;
        infoChoices.push(infoRow)
        infoRow = `score_flowers`;
        infoChoices.push(infoRow)
        infoRow = `time_seconds_flowers`;
        infoChoices.push(infoRow)
        infoRow = `score_heart_flowers`;
        infoChoices.push(infoRow)
        infoRow = `time_seconds_heart_flowers`;
        infoChoices.push(infoRow)
        infoRow = `total_time`;
        infoChoices.push(infoRow)
    } else if (instrument == 8) {
        filteredRows.map(row => {
            infoRow = `${row.title}_score`
            infoChoices.push(infoRow)
            infoRow = `${row.title}_answer`
            infoChoices.push(infoRow)
        })

        infoRow = `total_points`
        infoChoices.push(infoRow)
    } else {
        filteredRows.map(row => {
            infoRow = `pregunta_${row.num}`
            infoChoices.push(infoRow)
        })
    }
    
    //esta info es realmente los headers de toda la weaita
    let info = [...infoHeaders, ...infoChoices]
    let allStudentsRows = []

    async function getStudentInfoTejas(rows) {

        try {
            let studentRow = []
            let studentCounter = 0
            let previousStudent = undefined;
            let totalPoints = 0
            let choicesLength = 71
            let index = 0
       
            rows.forEach((row) => {
                currentStudentRut = rows[studentCounter]['rut']
                currentStudent = rows[studentCounter]
                if (previousStudent !== currentStudentRut) {
                    totalPoints = 0
                    index = 0
                    studentRow = []
                    const fechaTest = new Date(currentStudent['fecha']);
                    const fechaParseada = `${fechaTest.getDate()}/${fechaTest.getMonth()+1}/${fechaTest.getFullYear()}`
                    studentRow.push(currentStudent['rut'])
                    studentRow.push(currentStudent['alumno'])
                    studentRow.push(currentStudent['genero'])
                    studentRow.push(currentStudent['curso'])
                    studentRow.push(currentStudent['profesor'])
                    studentRow.push(currentStudent['colegio'])
                    studentRow.push(fechaParseada)
    
                    if (currentStudent['value'].length == 0) {
                        studentRow.push('0')
                    } else {
                        if (row['value'] == 1) {
                            studentRow.push(currentStudent['value'])
                            totalPoints++
                        } else {
                            studentRow.push(currentStudent['value'])
                        }
    
                    }
                                        
                } else {
                    if (currentStudent['value'].length == 0) {
                        studentRow.push('0')
                    } else {
                        if (row['value'] == 1) {
                            studentRow.push(currentStudent['value'])
                            totalPoints++
                        } else {
                            studentRow.push(currentStudent['value'])
                        }
                    } 
                }

                if (index > 71) {
                    console.log(index)
                }

                if (index == choicesLength) { // cada vez que terminamos de recorrerlos, sumamos los puntos totales al array de respuestas
                    studentRow.push(JSON.stringify(totalPoints))
                    allStudentsRows.push(studentRow)
                } 
                index++
                studentCounter++
                previousStudent = currentStudentRut;
            })
    
            let csvData = [];
            csvData.push([...info])
            


            allStudentsRows.forEach(
                row => {
                    csvData.push(row);
                }
            )
            const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
            const parsedData = getAllMissingStudentsData(allStudentsRows, allStudentsInfo, [...info])
            res.send(parsedData)
            
        } catch (error) {
            throw error.message;
        }
        
    }

    async function getStudentInfoFono(rows) {
        let studentRow = []
        let studentCounter = 0
        let previousStudent = undefined;
        let totalPoints = 0;
        let index = 0
        rows.forEach((row, key) => {
            currentStudentRut = rows[studentCounter]['rut']
            currentStudent = rows[studentCounter]
            if (previousStudent !== currentStudentRut) {
                studentRow = []
                totalPoints = 0;
                index = 0;
                const fechaTest = new Date(currentStudent['fecha']);
                const fechaParseada = `${fechaTest.getDate()}/${fechaTest.getMonth()+1}/${fechaTest.getFullYear()}`
                studentRow.push(currentStudent['rut'])
                studentRow.push(currentStudent['alumno'])
                studentRow.push(currentStudent['genero'])
                studentRow.push(currentStudent['curso'])
                studentRow.push(currentStudent['profesor'])
                studentRow.push(currentStudent['colegio'])
                studentRow.push(fechaParseada)

                if (currentStudent['value'].length == 0) {
                    studentRow.push('0') 
                    studentRow.push('')
                } else {
                    studentRow.push(currentStudent['value'])
                    studentRow.push(currentStudent['text'])
                } 
                allStudentsRows.push(studentRow)
                
            } else {
                if (currentStudent['value'].length == 0) {
                    studentRow.push('0') 
                    studentRow.push('')
                } else {
                    studentRow.push(currentStudent['value'])
                    studentRow.push(currentStudent['text'])
                } 
            }

            if (currentStudent['value'] > 0) {
                totalPoints = parseInt(totalPoints) + parseInt(currentStudent['value']);
            }

            if (index === 23) {
                studentRow.push(totalPoints)
            }
            index++
            studentCounter++
            previousStudent = currentStudentRut;
        })


        let csvData = [];
        csvData.push([...info])
        
        allStudentsRows.forEach(
            row => {
                csvData.push(row);
            }
        )

        const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
        const parsedData = getAllMissingStudentsData(allStudentsRows, allStudentsInfo, [...info])
        res.send(parsedData)
        
    }

    async function getStudentInfoCalculo(rows) {
        let studentRow = []
        let studentCounter = 0
        let previousStudent = undefined;
        rows.forEach(row => {
            currentStudentRut = rows[studentCounter]['rut']
            currentStudent = rows[studentCounter]
            if (previousStudent !== currentStudentRut) {
                studentRow = []
                const fechaTest = new Date(currentStudent['fecha']);
                const fechaParseada = `${fechaTest.getDate()}/${fechaTest.getMonth()+1}/${fechaTest.getFullYear()}`
                studentRow.push(currentStudent['rut'])
                studentRow.push(currentStudent['alumno'])
                studentRow.push(currentStudent['genero'])
                studentRow.push(currentStudent['curso'])
                studentRow.push(currentStudent['profesor'])
                studentRow.push(currentStudent['colegio'])
                studentRow.push(fechaParseada)
                

                if (currentStudent['value'].length == 0) {
                    studentRow.push('0') 
                } else {
                    studentRow.push(currentStudent['value'])
                } 
                allStudentsRows.push(studentRow)
                
            } else {
                
                if (currentStudent['num'] == 18) {
                    if (currentStudent['value'] == 3) {
                        studentRow.push('1') 
                    } else {
                        studentRow.push('0') 
                    }
                } else if (currentStudent['num'] == 19) {
                    if (currentStudent['value'] == 4) {
                        studentRow.push('1') 
                    } else {
                        studentRow.push('0') 
                    }
                } else if (currentStudent['num'] == 20) {
                    if (currentStudent['value'] == 6) {
                        studentRow.push('1') 
                    } else {
                        studentRow.push('0') 
                    }
                }else if (currentStudent['num'] == 21) {
                    if (currentStudent['value'] == 8) {
                        studentRow.push('1') 
                    } else {
                        studentRow.push('0') 
                    }
                }else if (currentStudent['num'] == 22) {
                    if (currentStudent['value'] == 10) {
                        studentRow.push('1') 
                    } else {
                        studentRow.push('0') 
                    }
                }else if (currentStudent['num'] == 23) {
                    if (currentStudent['value'] == 11) {
                        studentRow.push('1') 
                    } else {
                        studentRow.push('0') 
                    }
                }else if (currentStudent['num'] == 24) {
                    if (currentStudent['value'] == 16) {
                        studentRow.push('1') 
                    } else {
                        studentRow.push('0') 
                    }
                }else {
                    if (currentStudent['value'].length == 0) {
                        studentRow.push('0') 
                    } else {
                        studentRow.push(currentStudent['value'])
                    } 
                }


            }
            studentCounter++
            previousStudent = currentStudentRut;
        })

        let csvData = [];
        csvData.push([...info])
        
        allStudentsRows.forEach(
            row => {
                csvData.push(row);
            }
        )

        const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
        const parsedData = getAllMissingStudentsData(allStudentsRows, allStudentsInfo, [...info])
        res.send(parsedData)
        
        
    }


    async function getStudentInfoAces(rows) {

        try {
            let studentRow = []
            let studentCounter = 0
            let previousStudent = undefined;
            let totalPoints = 0
            let choicesLength = 25
            let index = 0
       
            rows.forEach((row) => {
                currentStudentRut = rows[studentCounter]['rut']
                currentStudent = rows[studentCounter]
                if (previousStudent !== currentStudentRut) {
                    totalPoints = 0
                    index = 0
                    studentRow = []
                    const fechaTest = new Date(currentStudent['fecha']);
                    const fechaParseada = `${fechaTest.getDate()}/${fechaTest.getMonth()+1}/${fechaTest.getFullYear()}`
                    studentRow.push(currentStudent['rut'])
                    studentRow.push(currentStudent['alumno'])
                    studentRow.push(currentStudent['genero'])
                    studentRow.push(currentStudent['curso'])
                    studentRow.push(currentStudent['profesor'])
                    studentRow.push(currentStudent['colegio'])
                    studentRow.push(fechaParseada)
    
                    if (currentStudent['value'].length == 0) {
                        studentRow.push('0')
                        studentRow.push('0') 
                    } else {
                        if (correctAnswers[row['num']] == row['value']) {
                            studentRow.push('1')
                            studentRow.push(currentStudent['value'])
                            totalPoints++
                        } else {
                            studentRow.push('0')
                            studentRow.push(currentStudent['value'])
                        }
    
                    }
                                        
                } else {
                    if (currentStudent['value'].length == 0) {
                        studentRow.push('0')
                        studentRow.push('0') 
                    } else {
                        if (correctAnswers[row['num']] == row['value']) {
                            studentRow.push('1')
                            studentRow.push(currentStudent['value'])
                            totalPoints++
                        } else {
                            studentRow.push('0')
                            studentRow.push(currentStudent['value'])
                        }
                    } 
                }

                if (index == choicesLength) { // cada vez que terminamos de recorrerlos, sumamos los puntos totales al array de respuestas
                    studentRow.push(JSON.stringify(totalPoints))
                    allStudentsRows.push(studentRow)
                } 
                index++
                studentCounter++
                previousStudent = currentStudentRut;
            })
    
            let csvData = [];
            csvData.push([...info])
            
            allStudentsRows.forEach(
                row => {
                    csvData.push(row);
                }
            )
    
            const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
            const parsedData = getAllMissingStudentsData(allStudentsRows, allStudentsInfo, [...info])
            res.send(parsedData)
            
            
            
        } catch (error) {
            throw error.message;
        }
        
    }


    async function getStudentInfoCorsi(rows) {
        let studentRow = []
        let studentCounter = 0
        let previousStudent = undefined;
        let puntaje_total = 0;
        rows.forEach(row => {
            currentStudentRut = rows[studentCounter]['rut']
            currentStudent = rows[studentCounter]
            if (previousStudent !== currentStudentRut) {
                studentRow = []
                const fechaTest = new Date(currentStudent['fecha']);
                const fechaParseada = `${fechaTest.getDate()}/${fechaTest.getMonth()+1}/${fechaTest.getFullYear()}`
                studentRow.push(currentStudent['rut'])
                studentRow.push(currentStudent['alumno'])
                studentRow.push(currentStudent['genero'])
                studentRow.push(currentStudent['curso'])
                studentRow.push(currentStudent['profesor'])
                studentRow.push(currentStudent['colegio'])
                studentRow.push(fechaParseada)
                //agregar intentos
                puntaje_total = 0;

                if (currentStudent['value'].length == 0) {
                    studentRow.push('0') 
                } else {
                    if (row.num === 1) {
                        studentRow.push(currentStudent['value']);
                    } else if (row.num === 13) {
                        //cambiar lugar en el studentRow
                        studentRow.push(currentStudent['value'])
                    } else {
                    //aca tengo que pushear resultado y respuesta
                    if (corsiAnswers[row.num] === row.value) {
                        studentRow.push('1')
                        studentRow.push(currentStudent['value'])
                        puntaje_total++
                    } else {
                        studentRow.push('0')
                        studentRow.push(currentStudent['value'])
                    }
                    }

                } 
                allStudentsRows.push(studentRow)
                
            } else {
                if (row.num === 1) {
                    studentRow.push(currentStudent['value']);
                } else if (row.num === 13) {
                    //cambiar lugar en el studentRow
                    studentRow.splice(8, 0, row.value);
                } else {
                //aca tengo que pushear resultado y respuesta
                if (row.num === 14 || row.num === 15 || row.num === 2 || row.num === 3) {
                    if (corsiAnswers[row.num] === row.value) {
                        studentRow.push(currentStudent['value'])
                        studentRow.push('1')
                    } else {
                        studentRow.push(currentStudent['value'])
                        studentRow.push('0')
                    }
                } else {
                    if (corsiAnswers[row.num] === row.value) {
                        studentRow.push(currentStudent['value'])
                        studentRow.push('1')
                        puntaje_total++
                    } else {
                        studentRow.push(currentStudent['value'])
                        studentRow.push('0')
                    }
                }

            }}

            if (row.num === 24) { // cada vez que terminamos de recorrerlos, sumamos los puntos totales al array de respuestas
                studentRow.splice(7, 0, puntaje_total);
            } 
            studentCounter++
            previousStudent = currentStudentRut;
        })


        let csvData = [];
        csvData.push([...info])
        
        allStudentsRows.forEach(
            row => {
                csvData.push(row);
            }
        )

        const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
        const parsedData = getAllMissingStudentsData(allStudentsRows, allStudentsInfo, [...info])
        res.send(parsedData)
        
        
    }

    async function getStudentInfo(rows) {
        let studentRow = []
        let studentCounter = 0
        let previousStudent = undefined;
        rows.forEach(row => {
            currentStudentRut = rows[studentCounter]['rut']
            currentStudent = rows[studentCounter]
            if (previousStudent !== currentStudentRut) {
                studentRow = []
                const fechaTest = new Date(currentStudent['fecha']);
                const fechaParseada = `${fechaTest.getDate()}/${fechaTest.getMonth()+1}/${fechaTest.getFullYear()}`
                studentRow.push(currentStudent['rut'])
                studentRow.push(currentStudent['alumno'])
                studentRow.push(currentStudent['genero'])
                studentRow.push(currentStudent['curso'])
                studentRow.push(currentStudent['profesor'])
                studentRow.push(currentStudent['colegio'])
                studentRow.push(fechaParseada)

                if (currentStudent['value'].length == 0) {
                    studentRow.push('0') 
                } else {
                    studentRow.push(currentStudent['value'])
                } 
                allStudentsRows.push(studentRow)
                
            } else {
                if (currentStudent['value'].length == 0) {
                    studentRow.push('0') 
                } else {
                    studentRow.push(currentStudent['value'])
                } 
            }
            studentCounter++
            previousStudent = currentStudentRut;
        })

        let csvData = [];
        csvData.push([...info])
        
        allStudentsRows.forEach(
            row => {
                csvData.push(row);
            }
        )

        const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
        const parsedData = getAllMissingStudentsData(allStudentsRows, allStudentsInfo, [...info])
        res.send(parsedData)
        
        
    }

    async function getStudentInfoHNF(rows) {
        let studentRow = []
        let studentAnswers = [];
        let studentCounter = 0
        let previousStudent = undefined;
        let exampleHeartTotal = 0;
        let exampleFlowersTotal = 0;
        let heartTotal = 0;
        let flowerTotal = 0;
        let HNFTotal = 0;
        rows.forEach(row => {
            currentStudentRut = rows[studentCounter]['rut']
            currentStudent = rows[studentCounter]
            if (previousStudent !== currentStudentRut) {

                exampleHeartTotal = 0;
                exampleFlowersTotal = 0;
                heartTotal = 0;
                flowerTotal = 0;
                HNFTotal = 0;

                if (studentAnswers.length > 0) {
     
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

                    allStudentsRows.push(studentRow)

                }

                studentRow = []
                studentAnswers = []
                const fechaTest = new Date(currentStudent['fecha']);
                const fechaParseada = `${fechaTest.getDate()}/${fechaTest.getMonth()+1}/${fechaTest.getFullYear()}`
                studentRow.push(currentStudent['rut'])
                studentRow.push(currentStudent['alumno'])
                studentRow.push(currentStudent['genero'])
                studentRow.push(currentStudent['curso'])
                studentRow.push(currentStudent['profesor'])
                studentRow.push(currentStudent['colegio'])
                studentRow.push(fechaParseada)


                studentAnswers.push({
                    item: row.num,
                    value: row.value,
                    time: row.time
                })

                
            } else {

                studentAnswers.push({
                    item: row.num,
                    value: row.value,
                    time: row.time
                })
            }
            studentCounter++
            previousStudent = currentStudentRut;
        })

        let csvData = [];
        csvData.push([...info])
        
        allStudentsRows.forEach(
            row => {
                csvData.push(row);
            }
        )

        const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);
        const parsedData = getAllMissingStudentsData(allStudentsRows, allStudentsInfo, [...info])
        res.send(parsedData)
        
        
    }

    if (instrument == 4) {
        getStudentInfoAces(rows);
    } else if (instrument == 1) {
        getStudentInfoTejas(rows);
    }else if (instrument == 2) {
        getStudentInfoCalculo(rows);
    } else if (instrument == 6) {
        getStudentInfoCorsi(rows);
    } else if (instrument == 7) {
        //Solo este test necesita 1 valor mas para iterar... se me complica en la logica interna de la funcion asi que SE que es horrible solucion, pero le añadire una fila mas para q pueda sacarlas todas y esta fila sea la afectada q no salga.
        rows.push({rut: '', alumno: '', curso: '', profesor: '', genero: '', "id": '', "num":'', "value":''}
        )
        getStudentInfoHNF(rows);
    } else if (instrument == 8) {
        getStudentInfoFono(rows);
    } else {
        getStudentInfo(rows);
    }

    const csvWriter = createCsvWriter({
        header: info,
        path: 'file.csv'
    });


    const allStudentsInfo = await studentsService.getAllStudentsInfo(schools);

    const records = allStudentsRows;

    const completedStudents = records.map((studentRow) => studentRow[0])

    const allStudents = allStudentsInfo.map((student) => student.rut)

    const missingStudents = allStudents.filter((element) => !completedStudents.includes(element));

    const missingStudentsData = missingStudents.map((missingStudent) => {
        const missingData = allStudentsInfo.find((element) => element.rut == missingStudent);
        const completedStudentData = [missingData.rut, missingData.alumno, missingData.gender, `${missingData.level} ${missingData.course}`, "", missingData.escuela, ""]
        const testLengthData = allStudentsRows[0].length - completedStudentData.length;
        for (var i = 0; i < testLengthData; i++) {
            completedStudentData.push('')
        }
        return completedStudentData
    })

    const allRecords = [...records, ...missingStudentsData];
    let sortedRecords = allRecords.sort((a, b) => {
        const firstA = a[0];
        const firstB = b[0];
        if (typeof firstA === 'string' && typeof firstB === 'string') {
          return firstA.localeCompare(firstB);
        }
        return firstA - firstB;
      });

    const orderedRecords = sortedRecords.reverse();


     
    csvWriter.writeRecords(orderedRecords)      
        .then(() => {
            console.log('....Done');
        });

}})


module.exports = router;