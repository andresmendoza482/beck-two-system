import PDFDocument from "pdfkit-table";//PDFDocument es una clase.
import fs from "fs";//File system.

const buildDocument = (data) => {//Esta función crea el archivo PDF con las respuestas del alumno y a su vez retorna la ruta de su ubicación.

    const doc = new PDFDocument();//Se crea una instancia de PDFDocument.
    const date = new Date();//Se crea una instancia del objeto Date.

    const directoryFile = `origin/docs/${data.noControl}-${date.getDate()}${date.getMonth()}${date.getFullYear()}-${date.getHours()}${date.getMinutes()}.pdf`;//Ruta donde se va a guardar el documento con las respuestas de los alumnos.
    doc.pipe(fs.createWriteStream(`./public/origin/docs/${data.noControl}-${date.getDate()}${date.getMonth()}${date.getFullYear()}-${date.getHours()}${date.getMinutes()}.pdf`));//Necesito recuperar el no.control del alumno (el cual pasaré por data) y la hora exacta actual.

    doc.text(`Reporte del alumno ${data.name}/ No.Control: ${data.noControl}`, (doc.page.width - doc.widthOfString(`Reporte del alumno ${data.name}/ No.Control: ${data.noControl}`)) / 2, 50);
    doc.text(`Fecha: ${date.getDate()} - ${date.getMonth()} - ${date.getFullYear()}/ Hora: ${date.getHours()}: ${date.getMinutes()}`, (doc.page.width - doc.widthOfString(`Fecha: ${date.getDate()} - ${date.getMonth()} - ${date.getFullYear()}/ Hora: ${date.getHours()}: ${date.getMinutes()}`)) / 2, 80);
    
    const table = {//Se crea la tabla que se insertará en el archivo con las respuestas del alumno.
        headers: [ "Pregunta", "Respuesta"],//thead
        rows: [//tbody
          [ "1. Tristeza:", data.bodyArray[1]],
          [ "2. Pesimismo:", data.bodyArray[3]],
          [ "3. Fracaso:", data.bodyArray[5]],
          [ "4. Pérdida de placer:", data.bodyArray[7]],
          [ "5. Sentimiento de culpa:", data.bodyArray[9]],
          [ "6. Sentimiento de castigo:", data.bodyArray[11]],
          [ "7. Disconformidad con uno mismo:", data.bodyArray[13]],
          [ "8. Autocrítica:", data.bodyArray[15]],
          [ "9. Pensamientos o deseos suicidas:", data.bodyArray[17]],
          [ "10. Llanto:", data.bodyArray[19]],
          [ "11. Agitación:", data.bodyArray[21]],
          [ "12. Pérdida de interés:", data.bodyArray[23]],
          [ "13. Indecisión:", data.bodyArray[25]],
          [ "14. Desvalorización:", data.bodyArray[27]],
          [ "15. Pérdida de energía:", data.bodyArray[29]],
          [ "16. Cambios en los hábitos de sueño:", data.bodyArray[31]],
          [ "17. Irritabilidad:", data.bodyArray[33]],
          [ "18. Cambios en el apetito:", data.bodyArray[35]],
          [ "19. Dificultad de concentración:", data.bodyArray[37]],
          [ "20. Cansancio o fatiga:", data.bodyArray[39]],
          [ "21. Salud:", data.bodyArray[41]],
        ],
    }

    doc.table(table, {x: null, y: 120});//Se inserta la tabla creada en el documento.

    doc.end();//Se crea el documento con la información del formulario del alumno.

    return directoryFile;//Retorna la ruta en donde se crea el documento.

}

export default buildDocument;
//Se exporta la función en donde se crea el documento con la respuesta del alumno y se retorna la ruta en donde se guarda.

