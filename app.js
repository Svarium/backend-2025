import express, { urlencoded } from "express"; //requiero express
import dotenv from "dotenv"; //requiero dotenv
import cors from "cors"; //requiero cors
import cookieParser from "cookie-parser"; //requiero cookie-parser
import fs from "node:fs"; //requiero fs 
import morgan from "morgan";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); //cargo las variables de entorno

const app = express(); //creo la app

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//Middlewares
app.use(cors({
    origin: "*", //permito el acceso a cualquier origen
    credentials: true, //permito el acceso a las credenciales
}))
app.use(express.json()); //parseo el json
app.use(urlencoded({ //parseo el urlencoded
    extended: true, //permito el uso de objetos y arrays
}))
app.use(morgan("dev")); //uso morgan para el log de las peticiones
app.use(cookieParser()); //uso cookie-parser para el manejo de cookies

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));


//RUTAS
const routeFiles = fs.readdirSync("./src/routes"); //leo la carpeta de rutas
routeFiles.forEach((file) => {
    //uso importaciones dinámicas
    import(`./src/routes/${file}`).then((route) => {
        app.use("/api/v1", route.default); //uso la ruta
    }).catch((err) => {
        console.error(`Error loading route ${file}:`, err); //si hay un error lo muestro por consola
    })

})


export default app; //exporto la app