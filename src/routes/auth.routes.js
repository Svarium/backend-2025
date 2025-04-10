import express from "express"; //requiero express
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema } from "../validators/auth.validator.js";
import { register } from "../controllers/auth.controller.js";


const router = express.Router(); //creo el router

router.post("/register", validateSchema(registerSchema),register)//defino la ruta de registro y le aplico el middleware de validación y el controlador


export default router; //exporto el router