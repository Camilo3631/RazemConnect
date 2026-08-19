import { Router } from 'express'
import { getUserSocket } from '../managers/socketManager.js'

const router = Router()


router.post('/messages', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({
        message: 'senderId, receiverId y content son obligatorios'
      })
    }

    const newMessage = {
      senderId,
      receiverId,
      content,
      read: false,
      createdAt: new Date()
    }

    const result = await req.app.locals.db
      .collection('messages')
      .insertOne(newMessage)


    newMessage._id = result.insertedId


    const receiverSocketId = getUserSocket(receiverId)


    if (receiverSocketId) {
      req.app.locals.io
        .to(receiverSocketId)
        .emit('new-message', newMessage)

      console.log(
        `📩 Mensaje enviado en tiempo real a ${receiverId}`
      )
    } else {
      console.log(
        `⚠️ Usuario ${receiverId} no está conectado`
      )
    }

    res.status(201).json({
      message: 'Mensaje enviado',
      data: newMessage
    })

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: error.message
    })
  }
})



router.get('/messages/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params

    const messages = await req.app.locals.db
      .collection('messages')
      .find({
        $or: [
          {
            senderId: userId1,
            receiverId: userId2
          },
          {
            senderId: userId2,
            receiverId: userId1
          }
        ]
      })
      .sort({ createdAt: 1 })
      .toArray()

    res.json(messages)

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: error.message
    })
  }
})



router.put('/messages/read/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params

    await req.app.locals.db
      .collection('messages')
      .updateMany(
        {
          senderId: userId2,
          receiverId: userId1,
          read: false
        },
        {
          $set: {
            read: true
          }
        }
      )

  
    const senderSocketId = getUserSocket(userId2)

   
    if (senderSocketId) {
      req.app.locals.io
        .to(senderSocketId)
        .emit('messages-read', {
          userId: userId1,
          contactId: userId2
        })

      console.log(
        `🔴 Mensajes leídos por ${userId1}`
      )
    } else {
      console.log(
        `⚠️ El usuario ${userId2} no está conectado`
      )
    }

    res.json({
      message: 'Mensajes marcados como leídos'
    })

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: error.message
    })
  }
})



router.delete('/messages/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params

    const result = await req.app.locals.db
      .collection('messages')
      .deleteMany({
        $or: [
          {
            senderId: userId1,
            receiverId: userId2
          },
          {
            senderId: userId2,
            receiverId: userId1
          }
        ]
      })

    res.json({
      message: 'Chat vaciado correctamente',
      deletedCount: result.deletedCount
    })

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: error.message
    })
  }
})

export default router