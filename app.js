import express, {json} from "express";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import cors from "cors";
import pageController from "./controllers/page_controller.js"
import errorController from "./controllers/error_controller.js";
import authController from "./controllers/auth_controller.js";
import {fileURLToPath} from 'url';
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, process.env.VIEW_DIRECTORY));
app.set("view engine", process.env.VIEW_ENGINE);

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, process.env.PUBLIC_DIRECTORY)));
app.use(express.urlencoded({extended: false}));

app.get("/", pageController.getIndex);
app.get("/login", authController.authLogin, pageController.getLogin);
app.post("/login", pageController.postLogin);
app.get("/registro", authController.authAdmin, authController.preventCache, pageController.getRegister);
app.post("/registro", pageController.postRegister);
app.get("/resultados", authController.authAdmin,  authController.preventCache, pageController.getResult);
app.get("/formulario", authController.authAlumn,  authController.preventCache, pageController.getForm);
app.post("/formulario", pageController.postForm);
app.get("/cerrar", authController.getClose);

app.use(errorController.error404);

app.listen(process.env.PORT, () => {
    console.log(`APLICACION LEVANTADA EN EL PUERTO http://localhost:${process.env.PORT}`);
});


