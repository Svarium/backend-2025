import app from "./app.js";

// Define the port to listen on
const port = process.env.PORT || 3005;

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

console.log('Server on port: ' + port);