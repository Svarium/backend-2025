import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "../controllers/task.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createTaskShema } from "../validators/task.validator.js";



const router = Router();

//obtener todas las tareas
router.get("/tasks", authRequired, getTasks);

//obtener una tarea por id
router.get("/tasks/:id", authRequired, getTask);

//crear una tarea
router.post(
    "/tasks",
    authRequired,
    validateSchema(createTaskShema),
    createTask
  );

//actualizar una tarea
router.put("/tasks/:id", authRequired, updateTask);

//eliminar una tarea
router.delete("/tasks/:id", authRequired, deleteTask); 

export default router;