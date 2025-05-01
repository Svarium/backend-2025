// middlewares/cleanupFiles.js
import fs from 'fs/promises';
import path from 'path';
import Task from '../models/task.model.js'; // Importamos el modelo Task

export const cleanupTaskFiles = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task && task.files.length > 0) {
            await Promise.all(
                task.files.map(async (file) => {
                    const filePath = path.join(process.cwd(), 'public', file.path);
                    try {
                        await fs.unlink(filePath);
                    } catch (err) {
                        console.error(`Error deleting file ${filePath}:`, err);
                    }
                })
            );
        }
        next();
    } catch (error) {
        console.error('Error in cleanupTaskFiles:', error);
        next();
    }
};
