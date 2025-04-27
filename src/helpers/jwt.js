import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
dotenv.config();

export function createAccessToken(payload){
 return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECRET_KEY, 
      {
        // expires in 120 minutes after
        expiresIn: '30m',
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);       
      }
    )
   })
}