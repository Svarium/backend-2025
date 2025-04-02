import express from "express"; //requiero express

const router = express.Router(); //creo el router

router.get("/", (req,res) => {
    res.send("Hello World from my route of express"); //envio un mensaje de bienvenida
})

router.get("/about", (req,res) => {
    res.send("Hello this is about us page!!! "); //envio un mensaje de bienvenida
})

export default router; //exporto el router