import { defineStore } from 'pinia';
import { ref } from 'vue';

const useChatStore = defineStore('chat', () => {
  const chats = ref([])
  const loading = ref(false)

  const loadContactsAsChats = async (userId) => {
    loading.value = true

    try {
      const apiUrl = import.meta.env.VITE_API_URL

      const response = await fetch(
       `${apiUrl}/api/contacts/${userId}`,
       {
          credentials: 'include'
       }
     )

     if (!response.ok) {
       throw new Error('No se pudieron cargar usuarios')
    }

    const contactsData = await response.json()

    const usersResponse = await fetch(
     `${apiUrl}/api/users`,
      {
         credentials: 'include'
      }
     )

     if (!usersResponse.ok) {
       throw new Error('No se pudieron cargar los usuarios')
      }

     const allUsers = await usersResponse.json()
        
     chats.value = await Promise.all(
       contactsData.map(async (contact) => {
        const contactUser = allUsers.find(
         user => user._id === contact.contactId
        )

        let lastMessage = ''
        let date = ''
        let time = ''

        try {
          const messagesResponse = await fetch(
           `${apiUrl}/api/messages/${userId}/${contact.contactId}`,
            {
              credentials: 'include'
            }
           )

           if (messagesResponse.ok) {
             const messages = await messagesResponse.json()

           if (messages.length > 0) {
              const last = messages.reduce((latset, messages) => {
            if (!latset) return messages

             return new Date(messages.createdAt) >
               new Date(latset.createdAt)
               ? messages
               : latset
              }, null)

             lastMessage = last?.content || ''

             if (last?.createdAt) {
              const messageDate = new Date(last.createdAt)

              date = messageDate.toLocaleDateString('es-ES', {
               day: '2-digit',
               month: '2-digit'
              })

              time = messageDate.toLocaleTimeString('es-ES', {
               hour: '2-digit',
               minute: '2-digit'
             })
            }
           }
          }
        } catch (error) {
          console.error(
          'Error al obtener último mensaje:',
           error
         )
        }

       return {
        id: contact.contactId,
        name: contactUser?.username || 'usuario desconocido',
        lastMessage,
        date,
        time,
        read: true
        }
      })
     )
   } catch (error) {
     console.error('Error al cargar los chats:', error)
     chats.value = []
   } finally {
     loading.value = false
    } 
   }

    const updateLastMessage = (chatId, message ) => {
      const chat = chats.value.find(
        chat => chat.id === chatId
      )

      if (!chat) return

     chat.lastMessage = message

     const now = new Date()

    chat.date = now.toLocaleDateString('es-ES', {
     day: '2-digit',
     month: '2-digit'
    })
            
    chat.time = now.toLocaleTimeString('es-ES', {
     hour: '2-digit',
     minute: '2-digit'
    })
   }

   const markAsRead = (chatId) => {
     const chat = chats.value.find(
     chat => chat.id === chatId
    )

   if (chat) {
     chat.read = true
      }
    }

    return {
     chats,
     loading,
     loadContactsAsChats,
     updateLastMessage,
     markAsRead
   } 
})

export { useChatStore };
 