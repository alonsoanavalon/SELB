const fs = require('fs');
const csv = require('csv-parser');
const md5 = require('md5');
const signupService = require('../controllers/authControllers')
const userAssignationService = require('../api/user_assignation/user-asignation.service')
const readline = require('readline');

const ASSIGNATION_TYPE = {
    STUDENT: 1,
    COURSE: 2,
    SCHOOL: 3,
    
}

const processCSV1 = async (filePath) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
  
    for await (const line of rl) {
        const row = JSON.parse(line); // Asumiendo que cada línea es un objeto JSON

        const { apellido_apoderado, nombre_apoderado, rut_apoderado, rut_alumno } = row;

        const user = {
          user: `${nombre_apoderado.toLowerCase()}.${apellido_apoderado.toLowerCase()}`,
          password: md5(rut_apoderado.replace('-', '').slice(0, -1)), // MD5 del rut sin guion ni dígito verificador
          name: nombre_apoderado,
          surname: apellido_apoderado,
          rut: rut_apoderado,
          role: 'Parent',
        }
        // Llamar al servicio de registro
        try {
          const userId = await signupService.signup(user);
  
          if (userId) {
              // Reemplaza el valor de assignation_type_id según tu modelo de datos
              const assignationTypeId = ASSIGNATION_TYPE.STUDENT; // 1 representa al tipo estudiante
              const userAssignation = {
                  userId: userId.insertId,
                  typeId: assignationTypeId,
                  studentRut: rut_alumno
              };
              // Llamar a la función para crear la relación en user_assignation
              const createdAssignation = await userAssignationService.create(userAssignation);
              console.log(createdAssignation)
            } else {
              console.log(`No se pudo crear el usuario ${user.user}`);
            }
        } catch (err){
          console.error(err);
        }
    };
}

    

const processCSV = (filePath) => {
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', async (row) => {
      // Obtener los datos de la fila
     

      // Si se creó el usuario, crear la relación en user_assignation
 
    })
    .on('end', () => {
      console.log('Procesamiento del CSV completo');
    });
};

// Ejecutar el proceso con el archivo CSV
 // Reemplaza con la ubicación real del archivo CSV
exports.processCSVFile = (csvFilePath) => {
    processCSV1('src/public/uploads/users.csv');
};