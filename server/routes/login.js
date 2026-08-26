import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { cookieOptions } from '../config/cookies.js';

const router = Router();

router.post('/login', async (req, res) => {
    try {
       const { email, password } = req.body;

       if (!email || !password) {
        return res.status(400).json({
            message: 'Email y contraseña son obligatorios'
        });
       }

       const user = await req.app.locals.db
         .collection('users')
         .findOne({ email })

        if (!user) {
          return res.status(400).json({
             message: 'Usuario no encontrado'
          });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(400).json({
            message: 'Contraseña incorrecta'
          });
        }
     
        const token = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        )


       res.cookie('token', token, { 
           ...cookieOptions,
           maxAge: 24 * 60 * 60 * 1000
        });

      
        res.json({
            user: {
              id:  user._id,
              username: user.username,
              email: user.email
           },
           message: 'Login exitoso'
        })
 
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: error.message
       });
    }
 })



export default router;