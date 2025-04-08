import express from "express"; //requiero express
import { about, home, mongoTest } from "../controllers/auth.controller.js";


const router = express.Router(); //creo el router

router.get("/", home)

router.get("/about", about)

router.post("/mongoTest", mongoTest) //ruta para probar la base de datos

export default router; //exporto el router