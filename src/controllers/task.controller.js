import { processFiles,  cleanupTempFiles, saveFilesPermanently } from "../helpers/fileHandler.js";
import Task from "../models/task.model.js";


export const getTasks = async (req, res) => {
  try {
      const tasks = await Task.find({
          user: req.user.id,
        }).populate("user");
        if (!tasks) {
          return res.status(404).json({ msg: "Tasks not found" });
        }
        return res.status(200).json(tasks);
  } catch (error) {
      return res.status(500).json(error.message);
  }
};


export const createTask = async (req, res) => {
  let processedFiles = [];
  
  try {
    // 1. Procesar archivos (sin comprometer aún)
    processedFiles = processFiles(req.files);
    
    // 2. Validaciones adicionales (ejemplo)
    const { title, description, dueDate } = req.body;
    if (!title) {
      throw new Error('Title is required');
    }
    
    // 3. Si todo está OK, guardar archivos permanentemente
    const savedFiles = await saveFilesPermanently(processedFiles);
    
    // 4. Crear la tarea
    const newTask = new Task({
      title,
      description,
      dueDate,
      user: req.user.id,
      files: savedFiles
    });
    
    const savedTask = await newTask.save();
    
    return res.status(201).json(savedTask);
    
  } catch (error) {
    // Limpiar archivos temporales si hubo error
    await cleanupTempFiles(processedFiles);
    return res.status(400).json({ error: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const taskFound = await Task.findById(req.params.id).populate("user");
    if (!taskFound) {
      return res.status(404).json({ msg: "Task not found" });    }

    return res.status(200).json(taskFound);
  } catch (error) {
    return res.status(500).json(error.message);    
  }
};

export const updateTask = async (req, res) => {
  // 1. Primero validamos TODO antes de tocar los archivos
  try {
    // Verificar existencia de la tarea
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    // Validaciones adicionales (ejemplo)
    if (req.body.title && req.body.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }

    // 2. Solo si todo está OK, procesamos archivos
    const processedFiles = processFiles(req.files);
    const savedFiles = await saveFilesPermanently(processedFiles);

    // 3. Actualizar la tarea
    const updateData = {
      ...req.body,
      files: [...(existingTask.files || []), ...savedFiles]
    };

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    return res.status(200).json(updatedTask);

  } catch (error) {
    // 4. Limpiar archivos si hubo error
    if (req.files?.length) {
      await cleanupTempFiles(processFiles(req.files));
    }
    return res.status(error.message === 'Task not found' ? 404 : 400)
              .json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
    try {
        const taskFound = await Task.findByIdAndDelete(req.params.id);

        if (!taskFound) {
            return res.status(404).json({ msg: "Task not found" });
        }

        return res.status(200).json({ message: "Task deleted!" });
    } catch (error) {
        return res.status(500).json(error.message);    
    }
  
};
