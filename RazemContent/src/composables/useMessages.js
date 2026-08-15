import { ref } from "vue";

const useMessages = () => {
  const messages = ref([])
  const loading = ref(false)
  const error = ref(null)

  const loadMessages = async (userId1, userId2) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/${userId1}/${userId2}`,
        {
            credentials: 'include'
        }
      )

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar los mensajes')
      }

      messages.value = data
      return data

    } catch (err) {
      error.value = err.message
      messages.value = []
      console.error('Error al cargar mensajes:', err)
      throw err
    } finally {
      loading.value = false
    }
   }

   const sendMessage = async (senderId, receiverId, content) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
           senderId,
           receiverId,
           content,
           read: false
         })
        }
       )

    const data = await response.json()

     if (!response.ok) {
      throw new Error(data.error || 'Error al enviar el mensaje')
     }

     messages.value.push(data.data)

     return data.data
    }

    const clearMessages = () => { 
        messages.value = []
      }

    return {
      messages,
      loading,
      error,
      loadMessages,
      sendMessage,
      clearMessages
   }
}


export { useMessages }



