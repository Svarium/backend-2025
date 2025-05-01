import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "../controllers/task.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createTaskShema } from "../validators/task.validator.js";
import upload from "../helpers/multer.config.tasks.js";
import { cleanupTaskFiles } from "../middlewares/cleanupTaskFiles.js";



const router = Router();

//obtener todas las tareas
router.get("/tasks", authRequired, getTasks);

//obtener una tarea por id
router.get("/tasks/:id", authRequired, getTask);

// Crear una tarea con archivos
router.post(
  "/tasks",
  authRequired,
  upload.array('files', 5), // 'files' es el nombre del campo y 5 es el máximo de archivos
  validateSchema(createTaskShema),
  createTask
);

// Actualizar una tarea con archivos
router.put(
  "/tasks/:id", 
  authRequired, 
  upload.array('files', 5),
  updateTask
);

//eliminar una tarea
router.delete("/tasks/:id", authRequired, cleanupTaskFiles, deleteTask);

export default router;