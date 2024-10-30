import connection from "../models/db.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import buildDocument from "../docs/pdfkit.js";
import transporter from "./mailer_controller.js";

import fs from "fs";
import {fileURLToPath} from 'url';
import path from "path";

const getIndex = (req, res) => {
    res.render("index");

}

const getLogin = (req, res) => {
    res.render("login");

}

const postLogin = (req, res) => {
    const {email, password} = req.body;

    connection.query("SELECT * FROM administradores WHERE correo =? AND contrasena = ?", [email, password], (error, results, fields) => {
        if(error) {//En caso de haber un error se rompen las condicionales y retorna el error.
            throw error;
        }else if(results.length === 1) {//Si existe el correo y la contraseña en la entidad "administradores" redirige a resultados.
            const id = results[0].admin_id;
            const token = jwt.sign({id: id, user: "admin"}, process.env.JWT_SECRET);
            const cookieOptions = {expires: new Date (Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpsOnly: true
            }

            res.cookie("jwt", token, cookieOptions);
            res.redirect("resultados");
        
        }else {//En caso de que no exista el registro en la entidad "administradores" pasa a hacer la consulta en la entidad "alumnos".
            connection.query("SELECT * FROM alumnos WHERE correo = ?", [email], async (error, results, fields) => {
                if(error) {//En caso de haber un error se rompen las condicionales y retorna el error.
                    throw error;
                }else if (results.length === 0 || !(await bcryptjs.compare(password, results[0].contrasena))) {//Si no existe el correo o si la contraseña NO coincide con la guardada en junto con el correo.
                    res.render("login", {modalError: true});
                }else {
                    const id = results[0].alumno_id;//Se extrae el ID del usuario que se logueo.
                    const token = jwt.sign({id:id, user: "alumn", name:`${results[0].nombre} ${results[0].apellido_paterno}`, email: results[0].correo}, process.env.JWT_SECRET);//Se crea el JWT, el primer parametro es un objeto con los datos a codificar, el segundo es el secreto con el cual se codificará la información.
                    const cookieOptions = {expires: new Date (Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpsOnly: true
                    }
                    res.cookie("jwt", token, cookieOptions);//Se manda una Cookie llamada "jwt" con el token y las opciones de expiración del token.
                    res.redirect("formulario");
                }
            });

        }
    });

}

const getRegister = (req, res) => {
    res.render("registro");
}

const postRegister = async (req, res) => {
    try {
        const {name, 
            paternalSurname, 
            maternalSurname, 
            sex, 
            noControl, 
            career, 
            semester, 
            email,
            emailConfirm, 
            password,
            passwordConfirm} = req.body;//Se destructura el objeto body del objeto request;

    if((email === emailConfirm) && (password === passwordConfirm)) {//Si las contraseñas son iguales y los correos son iguales se ejecuta la siguiente programación.
        const passHash = await bcryptjs.hash(password, 8);//Encripta la contraseña con bcryptjs (mediante un Hash).

        connection.query("INSERT INTO alumnos (nombre, apellido_paterno, apellido_materno, sexo, numero_control, carrera, semestre, correo, contrasena) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [name, paternalSurname, maternalSurname, sex, noControl, career, semester, email, passHash], (error, results, fields) => {
            if(error) {
                throw error;
            }else {
               res.render("registro", {modalSuccess: true});
               
            }

        });

    }else {//En caso de que las contraseñas y los correos no sean los mismos muestra un error.
        res.render("registro", {modalError: true});//FALTA UN MENSAJE DE QUE NO SE PUDIERON AGREGAR PORQUE LAS CONTRASEñAS Y LOS CORREOS NO SON IGUALES
    }

    }catch(error) {
        throw error;
    }

}

const getForm = (req, res) => {
    const decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);//Decodifica el token y lo asigna a una variable.
    res.render("formulario", {decode});

}

const postForm = (req, res) => {

    const decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);//Decodifica el token y lo asigna a una variable.
    const bodyArray = Object.values(req.body);
    let result = 0;
    let aux = 0;

    for(let i = 0; i < bodyArray.length; i++){
        if(i === aux) {
            result += parseInt(bodyArray[i]);
            aux += 2;
        }
        
    }

    connection.query("SELECT * FROM alumnos WHERE alumno_id = ?", [decode.id], (error, results, fields) => {
        if(error) {
            throw error;

        }else if(results.length === 1) {
            
            const directoryFile = buildDocument({bodyArray, noControl: results[0].numero_control, name: `${results[0].nombre + " " + results[0].apellido_paterno + " " + results[0].apellido_materno}`});

            connection.query("INSERT INTO resultados (nombre, apellido_paterno, apellido_materno, numero_control, carrera, resultado, respuesta) VALUES (?, ?, ?, ?, ?, ?, ?)", [results[0].nombre, results[0].apellido_paterno, results[0].apellido_materno, results[0].numero_control, results[0].carrera, result, directoryFile], (error, results, fields) => {
                if(error) {
                    throw error;
                }else {

                    transporter.sendMail({
                        from: `Admin ${process.env.EMAIL}`,//El email que envía el correo (variable de entorno del correo del cual se va a mandar el correo).
                        to: "reyes.guzman.osiris@gmail.com",//El email al que se envía el correo.
                        subject: "Recordatorio formulario de Beck",//Asundo del correo.
                        text: "Han pasado 15 días, favor de volver a realizar el inventario de Beck, gracias."//Cuerpo del correo.
                    }, (error, info) => {
                        if(error) {
                            throw error;
                        }
                    });
                    
                    
                    res.render("formulario", {modalSuccess: true, decode});
                }
            });

        }else {//Técnicamente nunca debería de pasar a esta validación pero por la robustez del programa se coloca.
            res.redirect("formulario");
        }
    });


    //aqui nomas faltaria lo del email de 15 dias despues.

}

const getResult = (req, res) => {
    connection.query("SELECT * FROM resultados", (error, results, fields) => {
        if(error) {
            throw error;
        }else {

            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            
            //Ruta del documento que representa que el documento con las respuestas del alumno no  existe más en el servidor.
            const directoryFileError = "./origin/docs/error-document.pdf";
            const directoryFile = `${__dirname}/../public/${results[58].respuesta}`;

            console.log(results.length);
            console.log(results[57].respuesta);
            console.log(directoryFile);
            console.log(fs.existsSync(directoryFile));

            for(let i = 0; i < results.length; i++) {
                if(!fs.existsSync(`${__dirname}/../public/${results[i].respuesta}`)) {
                    
                    results[i].respuesta = directoryFileError;
                    
                }else {
                    console.log(results[i].resultado);
                }

            }

            res.render("resultados", {results});

        }
    });
}

export default {
    getIndex,
    getLogin,
    getRegister,
    getForm,
    postForm,
    getResult,
    postLogin,
    postRegister
}



