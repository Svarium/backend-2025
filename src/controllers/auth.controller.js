import bcrypt from "bcryptjs";
import { createAccessToken } from "../helpers/jwt.js";
import User from "../models/user.model.js"; // Import the User model
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import transport from '../helpers/mailer.js';


export const register = async(req, res) => {
    try {
     const {username, email, password} = req.body;
 
     const userFound = await User.findOne({email});
     if(userFound) return res.status(400).json({message: "user already exists"});
 
     const passwordHash = await bcrypt.hash(password, 10);
 
     // Generar token de verificación
     const verificationToken = crypto.randomBytes(20).toString('hex');
 
     const newUser = new User({
         username,
         email,
         password: passwordHash,
         verificationToken
     });
 
     const savedUser = await newUser.save();
 
     // Enviar email de verificación
     const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
     
     await transport.sendMail({
         from: process.env.MAIL_FROM,
         to: savedUser.email,
         subject: 'Verifica tu email - TODOAPP',
         template: 'verifyEmail',
         context: {
             username: savedUser.username,
             verificationLink
         }
     });
 
     const token = await createAccessToken({
         id: savedUser._id
     });
 
     res.cookie("token", token, {
         httpOnly: process.env.NODE_ENV !== "development",
         secure: true,
         sameSite: "none",
     });
 
     res.status(201).json({
         id: savedUser._id,
         username: savedUser.username,
         email: savedUser.email,    
         isVerified: savedUser.isVerified,
         token,
     });
 
    } catch (error) {
     res.status(500).json({message: error.message});
    }
 }

export const login = async(req,res) => {
    try {

        const {email, password} = req.body; // Destructure the request body

        // Check if the user exists
        const userFound = await User.findOne({email}); // Find the user by email

        if(!userFound) return res.status(400).json({message: "user not found"}); // If user does not exist, send a 400 response

        //compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, userFound.password); // Compare the provided password with the hashed password

        if(!isMatch) return res.status(400).json({message: "invalid credentials"}); // If passwords do not match, send a 400 response

        //create a token for the user
        const token = await createAccessToken({
            id:userFound._id, // Use the user's ID as the payload for the token,
            username: userFound.username, // Include the username in the token payload (optional)
            email: userFound.email, // Include the email in the token payload (optional)
        })

        // Set the token in a cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })

        //send a success response with the user data and token

        res.status(200).json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,  
            isVerified: userFound.isVerified,
            token, // Include the token in the response
        })
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({msg: "Server Error: " + error.message});  
    }
}

export const logout = async (req,res) => {
    try {

        //clean the cookie
        res.cookie("token", "", {expires: new Date(0)}) // Clear the token cookie by setting it to an empty string and an expiration date in the past

        res.status(200).json({message: "Logout success"}); // Send a success response        
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({msg: "Server Error: " + error.message});
    }
}

export const profile = async (req,res) => {
    try {
        const userFound = await User.findById(req.user.id);

        if(!userFound) return res.status(404).json({message: "user not found"});

        return res.status(200).json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            profileImage: userFound.profileImage, // Añade esta línea
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({msg: "Server Error: " + error.message});
    }
}

export const verifiToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    let token;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userFound = await User.findById(decoded.id);

    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      isVerified: userFound.isVerified,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};


export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: "Token de verificación inválido o expirado" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

       return res.status(200).json({ 
            success: true,
            message: "Email verificado con éxito",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified
            }
            });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: "Server Error: " + error.message });
    }
};

