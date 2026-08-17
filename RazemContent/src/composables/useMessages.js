import { ref } from 'vue'

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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Error al cargar los mensajes'
        )
      }

      messages.value = data

      return data

    } catch (err) {
      error.value = err.message
      messages.value = []

      console.error(
        'Error al cargar mensajes:',
        err
      )

      throw err

    } finally {
      loading.value = false
    }
  }

  const sendMessage = async (
    senderId,
    receiverId,
    content
  ) => {
    try {
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
        throw new Error(
          data.error || 'Error al enviar el mensaje'
        )
      }

      messages.value.push(data.data)

      return data.data

    } catch (err) {
      error.value = err.message

      console.error(
        'Error al enviar mensaje:',
        err
      )

      throw err
    }
  }

  const clearMessages = async (userId1, userId2) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/${userId1}/${userId2}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Error al vaciar el chat'
        )
      }

      // Vaciar los mensajes de la conversación
      // también en el estado local
      messages.value = []

      return data

    } catch (err) {
      error.value = err.message

      console.error(
        'Error al vaciar chat:',
        err
      )

      throw err

    } finally {
      loading.value = false
    }
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


