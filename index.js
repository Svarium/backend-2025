import express from "express"; //requiero express

const app = express(); //creo la app

app.get("/", (req, res) => {
    res.send("¡¡¡Hello World from Express!!!"); //respondo con hello world
})

app.listen(3000, ( ) => { //inicializo el servidor
    console.log("Server is running on port 3000");
})