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

export default router;