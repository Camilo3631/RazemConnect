import { Router } from 'express';
import { ObjectId } from 'mongodb';

const router = Router();

router.post('/messages', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({
        message: 'senderId, receiverId y content son obligatorios'
      });
    }

    const newMessage = {
      senderId,
      receiverId,
      content,
      read: false,
      createdAt: new Date()
    };

    const result = await req.app.locals.db
      .collection('messages')
      .insertOne(newMessage);

    res.status(201).json({
      message: 'Mensaje enviado',
      data: newMessage
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message
    });
  }
});

router.get('/messages/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    const messages = await req.app.locals.db
      .collection('messages')
      .find({
        $or: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 }
        ]
      })
      .sort({ createdAt: 1 })
      .toArray();

    res.json(messages);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message
    });
  }
});

router.put('/messages/read/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    await req.app.locals.db
     .collection('messages')
     .updateMany(
       { senderId: userId2, receiverId: userId1, read: false },
       { $set: { read: true } }
     );

     res.json({ message: 'Mensajes marcados como leídos' });
  
   }catch (error) {
    console.log(error)
    res.status(500).json({
      error: error.message
    });
   }
});

export default router;