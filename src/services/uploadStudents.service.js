const fs = require('fs');
const mysqlConnection = require('../database/database');

function convertFormat(date) {
    // Split the original string into parts using the hyphen as a separator
    var parts = date.split("-");
    
    // Rearrange the parts in the new format
    var newDate = parts[1] + "/" + parts[0] + "/" + parts[2];
    
    return newDate;
  }
  
// Función para insertar un estudiante en la base de datos
function insertStudent(student, type) {
    return new Promise((resolve, reject) => {

        if (type == 'Natalia') {
            const sql = `INSERT INTO student (name, surname, rut, course_id, gender) VALUES (?, ?, ?, ?, ?)`;
            mysqlConnection.query(sql, [student.name, student.surname, student.parsedRut, student.courseId, student.gender], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    resolve(result);
                }
            });
        } else if (type == 'Anabel') {
            const sql = `INSERT INTO student (name, surname, rut, course_id, gender, birthday) VALUES (?, ?, ?, ?, ?, ?)`;
            mysqlConnection.query(sql, [student.name, student.surname, student.parsedRut, student.courseId, student.gender, student.parsedFecha], (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    resolve(result);
                }
            });
        }

    });
}

// Función para leer un archivo CSV y procesar sus filas
exports.processCSVFileNatalia = (filePath) => {
    const arrayPromises = [];

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const lines = data.split('\n');

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const [nombre, apellido_paterno, apellido_materno, rut, curso, genero] = line.split(',');
                // Combina los apellidos en uno solo
                const apellido = `${apellido_paterno} ${apellido_materno}`;
                const surname = apellido?.replaceAll('"', '');
                const name = nombre?.replaceAll('"', '');
                const courseId = Number(curso.replaceAll('"', ''));
                const gender = genero?.replaceAll('"', '');
                const parsedRut = rut?.replaceAll('"', '');
                const student = { name, surname, parsedRut, courseId, gender };

                const promise = insertStudent(student, 'Natalia');
                arrayPromises.push(promise);
            }
        }

        // Esperar a que todas las inserciones se completen
        Promise.all(arrayPromises)
            .then(() => {
                console.log('Todas las inserciones se completaron con éxito.');
            })
            .catch((error) => {
                console.error('Error en al menos una inserción:', error);
            });
    });
}

exports.processCSVFile = (filePath) => {
    this.processCSVFileAnabel(filePath);
}

exports.processCSVFileAnabel = (filePath) => {
    const arrayPromises = [];

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const lines = data.split('\n');

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const [ colegio,curso, rut, nombre, apellido, genero, fecha] = line.split(',');
                // Combina los apellidos en uno solo
                const surname = apellido?.replaceAll('"', '');
                const name = nombre?.replaceAll('"', '');
                const courseId = Number(curso.replaceAll('"', ''));
                const gender = genero?.replaceAll('"', '');
                const parsedRut = rut?.replaceAll('"', '');
                const parsedDate = fecha?.replaceAll('"', '');
                const parsedFecha = convertFormat(parsedDate);
                const student = { name, surname, parsedRut, courseId, gender, parsedFecha };

                const promise =     insertStudent(student, 'Anabel');
                arrayPromises.push(promise);
            }
        }

        // Esperar a que todas las inserciones se completen
        Promise.all(arrayPromises)
            .then(() => {
                console.log('Todas las inserciones se completaron con éxito.');
            })
            .catch((error) => {
                console.error('Error en al menos una inserción:', error);
            });
    });
}

