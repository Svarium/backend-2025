import express, { urlencoded } from "express"; //requiero express
import dotenv from "dotenv"; //requiero dotenv
import cors from "cors"; //requiero cors
import fs from "node:fs"; //requiero fs 

dotenv.config(); //cargo las variables de entorno

const port = process.env.PORT || 3000; //defino el puerto

const app = express(); //creo la app

//Middlewares
app.use(cors({
    origin: "*", //permito el acceso a cualquier origen
    credentials: true, //permito el acceso a las credenciales
}))
app.use(express.json()); //parseo el json
app.use(urlencoded({ //parseo el urlencoded
    extended: true, //permito el uso de objetos y arrays
}))


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


//Inicializo Servidor
const server = async () => {
    try {
        app.listen(port, () => { //inicializo el servidor
            console.log("Server is running on port: " + port); //muestro por consola el puerto
        })
    } catch (error) {
        console.log("Error starting server: ", error); //si hay un error lo muestro por consola
        process.exit(1); //salgo del proceso        
    }
}

server(); //llamo a la funcion server


