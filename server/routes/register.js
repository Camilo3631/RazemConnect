import { Router } from 'express';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email, !password) {
        return res.status(400).json({
           message: 'Todos los campos son obligatorios'
        });
      }

      const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
                       

 
      if (!emailFormat.test(email)) {
        return res.status(400).json({
           message: 'Formato de correo incorrecto'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
            message: 'La contraseña debe tener minimo 6 caracteres'
        });
      }

      const existingUser = await req.app.locals.db
       .collection('users')  
       .findOne({ email })

      if (existingUser) {
        return res.status(400).json({
           message: 'Ya existe una cuenta con ese email'
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = {
        username,
        email,
        password: hashPassword,
        createdAt: new Date()
      };

      const result = await req.app.locals.db
       .collection('users')
       .insertOne(newUser)

    res.status(201).json({
        message: 'Usuario registrado exitosamente'
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: error.message
    })
  }
})

export default router;




