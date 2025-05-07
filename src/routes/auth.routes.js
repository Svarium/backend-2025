import express from "express"; //requiero express
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { login, logout, profile, register, verifiToken, verifyEmail } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { getProfileImage, uploadProfileImage } from "../controllers/profile.controller.js";
import uploadIconProfileImage from "../helpers/multer.config.iconProfile.js";




const router = express.Router(); //creo el router

router.post("/register", validateSchema(registerSchema),register)//defino la ruta de registro y le aplico el middleware de validación y el controlador

router.post("/login", validateSchema(loginSchema), login)//defino la ruta de login y le aplico el middleware de validación y el controlador

router.post("/logout", logout)//defino la ruta de logout y le aplico el controlador

router.get("/profile", authRequired, profile)//defino la ruta de perfil y le aplico el controlador

router.get("/verify-token", verifiToken)//defino la ruta de verificación y le aplico el controlador

router.post("/upload-profile-image", 
    authRequired, 
    uploadIconProfileImage.single("iconProfile"), // Cambia "profileImage" por el nombre del campo que estás usando en el formulario
    uploadProfileImage
);

router.get("/profile-image", 
    authRequired, 
    getProfileImage
);

router.get("/verify-email", verifyEmail);


export default router; //exporto el router