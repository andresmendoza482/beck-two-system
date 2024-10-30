import jwt from "jsonwebtoken";
//Middlewares de autenticación.

const authLogin = (req, res, next) => {//Verifica si el usuario está logueado con una cookie, y de esa manera no mostrar de nuevo la vista "Login".
    if (req.cookies.jwt) {//Si existe la cookie con el token aplica la siguiente programación la cual lo requiere.
        const decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);//Decodifica el token y lo asigna a una variable.
        if(decode.user === "admin") {//Si existe el token y además el token fue creado por un admin redirige a resultados.
            res.redirect("resultados");
    
        }else if(decode.user === "alumn") {//Si existe el token y además el token fue creado por un alumno redirige a formulario.
            res.redirect("formulario");
        }
    }else {//Si el token no existe redirige al login.
        next();
    }
}

const authAdmin = (req, res, next) => {//Verifica si el usuario logueado es un administrador para proteger las rutas del administrador.
    if(req.cookies.jwt) {//Si existe la cookie con el token aplica la siguiente programación la cual lo requiere.
        const decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);//Decodifica el token y lo asigna a una variable.
        if(decode.user === "admin") {//Si existe el token y además el token fue creado por un admin entonces se tiene acceso a la ruta.
            next();
        }else {//En caso de que no haya sido creado por un admin redirige al login.
            res.redirect("login");
        }
    }else {//En caso de que NO exista el token se va a redirigir al login.
        res.redirect("login");
    }
}

const authAlumn = async (req, res, next) => {//Verifica si el usuario logueado es un alumno para proteger las rutas de los alumnos.
    if(req.cookies.jwt) {//Si existe la cookie con el token aplica la siguiente programación la cual lo requiere.
        const decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);//Decodifica el token y lo asigna a una variable.
        if(decode.user === "alumn") {//Si existe el token y además el token fue creado por un alumno entonces se tiene acceso a la ruta.
            next();
        }else {//En caso de que NO haya sido creado por un alumno redirige al login.
            res.redirect("login");
        }
    }else {//En caso de que NO exista el token se va a redirigir al login.
        res.redirect("login");
    }
}

const getClose = (req, res) => {//En caso de que el usuario se deslogue, se elimina la cookie.
    const token = jwt.sign({id: "null", user: "null"}, process.env.JWT_SECRET);//Se crea un JWT nuevo para sobreescribir el que ya existe.
    const cookieOptions = {
        expires: new Date(0),
        httpsOnly: true
    }

    res.cookie("jwt", token, cookieOptions);//Se sobre escribe la cookie que ya existe con nuevos valores de expiración los cuales hacen que se expire en este momento.
    res.redirect("login");//Se redirige al login.

}

const preventCache = (req, res, next) => {//Las rutas con este middleware no almacenan datos en caché, lo que hace que una vez deslogueados los usuarios no puedan volver atrás con el botón del navegador.
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate', 'Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
}


export default {
    authLogin,
    authAdmin,
    authAlumn,
    getClose,
    preventCache
}