import fs from 'fs';
import path from 'path';
import Task from '../models/task.model.js';



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
// Verifica errores de validación del esquema (ahora ocurren después de Multer)
  if (req.validationError) {  // Asumo que validateSchema guarda errores aquí
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = path.join('public', 'uploads', 'tasks', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    return res.status(400).json({ message: req.validationError });
  }

  // Verifica errores de Multer (como antes)
  if (req.fileValidationError) {
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = path.join('public', 'uploads', 'tasks', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    return res.status(400).json({ message: req.fileValidationError });
  }

  try {
    const { title, description, dueDate } = req.body;
    
    let savedFiles = [];
    if (req.files && req.files.length > 0) {
      savedFiles = req.files.map(file => ({
        name: file.originalname,
        path: `/uploads/tasks/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype
      }));
    }

    const newTask = new Task({
      title,
      description,
      dueDate: dueDate || new Date(),
      user: req.user.id,
      files: savedFiles
    });
    
    const savedTask = await newTask.save();
    return res.status(201).json(savedTask);
    
  } catch (error) {
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = path.join('public', 'uploads', 'tasks', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
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
  // 1. Verificar errores de Multer (title o archivos inválidos)
  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError });
  }

  try {
    // 2. Verificar existencia de la tarea
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // 3. Procesar archivos nuevos (si los hay)
    let savedFiles = [];
    if (req.files && req.files.length > 0) {
      savedFiles = req.files.map(file => ({
        name: file.originalname,
        path: `/uploads/tasks/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype
      }));
    }

    // 4. Actualizar la tarea (combinar archivos existentes con nuevos)
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
    // 5. Limpiar archivos subidos si hubo error (excepto si la tarea no existe)
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = path.join('public', 'uploads', 'tasks', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    return res.status(400).json({ error: error.message });
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
