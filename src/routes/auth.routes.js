import express from "express"; //requiero express
import { about, home } from "../controllers/auth.controller.js";


const router = express.Router(); //creo el router

router.get("/", home)

router.get("/about", about)

export default router; //exporto el router