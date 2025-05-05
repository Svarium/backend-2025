import User from '../models/user.model.js';
import { createAccessToken } from '../helpers/jwt.js';
import transport from '../helpers/mailer.js'; // Importamos tu transport configurado
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Solicitar reseteo de contraseña
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Validar email
    if (!email) {
      return res.status(400).json({ message: 'El email es requerido' });
    }

    // 2. Buscar al usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 3. Generar token de reseteo (expira en 1 hora)
    const resetToken = await createAccessToken({ 
      id: user._id,
      purpose: 'password_reset'
    });

    // 4. Guardar token y fecha de expiración
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hora
    await user.save();

    // 5. Enviar email con el link de reseteo
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Tu App'}" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: 'Instrucciones para resetear tu contraseña',
      template: 'forgotPassword', // Nombre de tu template sin extensión
      context: {
        name: user.username,
        link: resetLink,
        subject: 'Restablecimiento de contraseña'
      }
    };

    await transport.sendMail(mailOptions);

    res.status(200).json({
      message: 'Email con instrucciones enviado',
      expiresIn: '1h'
    });

  } catch (error) {
    console.error('Error en requestPasswordReset:', {
      message: error.message,
      stack: error.stack,
      email: req.body.email
    });
    
    res.status(500).json({ 
      message: 'Error al procesar la solicitud',
      error: error.message 
    });
  }
};

// Resetear la contraseña
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // 1. Verificar el token
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ 
          message: 'Token inválido o expirado',
          error: err.message 
        });
      }

      // 2. Buscar al usuario
      const user = await User.findOne({
        _id: decoded.id,
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ 
          message: 'Token inválido o expirado' 
        });
      }

      // 3. Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // 4. Actualizar y limpiar token
      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      res.status(200).json({
        message: 'Contraseña actualizada exitosamente'
      });
    });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ 
      message: 'Error al resetear la contraseña',
      error: error.message 
    });
  }
};