import { Router } from 'express';

const router = Router();

router.post('/contacts', async (req, res) => {
  try {
    const { userId, contactId } = req.body;

    if (!userId || !contactId) {
       return res.status(400).json({
          message: 'userId y contactId son obligatorios'
       });
    }

    const existingContact = await req.app.locals.db
      .collection('contacts')
      .findOne({ userId, contactId });

     if (existingContact) {
       return res.status(400).json({
         mesaage: 'Este contacto ya fue agregado'
       });
     }

     const newContact = {
       userId,
       contactId,
       createAt: new Date()
     };

     await req.app.locals.db.collection('contacts').insertOne(newContact);
     
     res.status(201).json({
       mesaage: 'Contacto agregado exitosamente'
     });


    } catch (error) {
      consol.log(error);
      res.status(500).json({
        error: error.message 
      });  
    }
 });


router.get('/contacts/:userId', async (req, res) => {
   try {
      const { userId } = req.params;

      const contacts = await req.app.locals.db
        .collection('contacts')
        .find({ userId })
        .toArray();

      res.json(contacts)

   } catch (error) {
     console.log(error);
     res.status(500).json({
        error: error.message
     });
   }
});

router.delete('/contacts/:userId/:contactId', async (req, res) => {
  try {
     const { userId, contactId  } = req.params;

     const result = await req.app.locals.db
       .collection('contacts')
       .deleteOne({ userId, contactId  });

     if (result.deletedCount === 0) {
       return res.status(404).json({
          mesaage: 'Contacto no encontrado'
       });
     }

     res.json({
       message: 'Contacto eliminado exitosamente'
     })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message
    });
   }  
 });

 export default router;
