import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const router = Router();

router.get('/users', async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await req.app.locals.db
      .collection('users')
      .find(query, { projection: { password: 0 } })
      .toArray();

    res.json(users);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message
    });
  }
});

router.get('/users/me', async (req, res) => {
   try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await req.app.locals.db
      .collection('users')
      .findOne({ _id: new ObjectId(decoded.id)}, { projection: {password: 0 }} );

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(user);
   } catch (error) {
     res.status(401).json({ error: 'Token inválido' });
   } 
});

router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        message: 'El nombre es obligatorio'
      })
    }

    await req.app.locals.db
     .collection('users')
     .updateOne(
      { _id: new ObjectId(id) },
      { $set: { username } }
     );

    res.json({ message: 'Nombre actualizado correctamente' });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message  
     });
   }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await req.app.locals.db 
     .collection('users')
     .deleteOne({ _id: new ObjectId(id) })
     
    if (result.deleteCount === 0) {
     return res.status(404).json({
       message: 'Usuario no encontrado'
     });
    }

    res.clearCookie('token');
    res.json({ message: 'Cuenta elimianda exitosamente' })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: error.message
    })
  }
})

export default router;