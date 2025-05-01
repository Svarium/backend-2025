// utils/fileHandler.js
import fs from 'fs/promises';
import path from 'path';

export const processFiles = (files) => {
  if (!files || files.length === 0) return [];
  
  return files.map(file => ({
    tempPath: file.path,
    finalData: {
      name: file.originalname,
      path: file.path.replace(/\\/g, '/').replace(/.*public/, ''),
      size: file.size,
      mimetype: file.mimetype
    }
  }));
};

export const cleanupTempFiles = async (processedFiles) => {
  if (!processedFiles || processedFiles.length === 0) return;
  
  await Promise.all(
    processedFiles.map(file => 
      fs.unlink(file.tempPath).catch(() => {})
    )
  );
};

export const saveFilesPermanently = async (processedFiles) => {
  // En una implementación más avanzada podrías mover los archivos
  // a su ubicación final aquí. Por ahora solo retornamos los datos.
  return processedFiles.map(file => file.finalData);
};