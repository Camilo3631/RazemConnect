import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { useUsers } from '@/composables/useUsers'
import { useContacts } from '@/composables/useContacts'
import { useMessages } from '@/composables/useMessages'
import { useSocket } from '@/composables/useSocket'
import { storeToRefs } from 'pinia'

const useDashboard = () => {
  const chatStore = useChatStore()
  const { chats } = storeToRefs(chatStore)

  const { users, searchUsers } = useUsers()
  const { addContact } = useContacts()
  const { socket } = useSocket()

  const {
    messages,
    sendMessage,
    loadMessages,
    clearMessages
  } = useMessages()

  const currentUser = ref({
    name: 'Cargando...',
    id: null,
    email: null
  })

  const selectedChat = ref(null)
  const showMobileChat = ref(false)
  const messageText = ref('')
  const searchQuery = ref('')
  const showAddContact = ref(false)
  const userSearchQuery = ref('')

  const apiUrl = import.meta.env.VITE_API_URL

  const filteredUsers = computed(() => {
    return users.value.filter(
      user => String(user._id) !== String(currentUser.value.id)
    )
  })

  const filteredChats = computed(() => {
    if (!searchQuery.value) {
      return chats.value
    }

    return chats.value.filter(chat =>
      chat.name
        ?.toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    )
  })

  const loadCurrentUser = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/users/me`,
        {
          method: 'GET',
          credentials: 'include'
        }
      )

      if (!response.ok) {
        currentUser.value = {
          name: 'Invitado',
          id: null,
          email: null
        }

        return
      }

      const data = await response.json()

      currentUser.value = {
        name: data.username,
        email: data.email,
        id: data._id
      }

      socket.emit(
        'register-user',
        currentUser.value.id
      )

      await chatStore.loadContactsAsChats(
        currentUser.value.id
      )

    } catch (err) {
      console.error(
        'Error al obtener usuario actual:',
        err
      )

      currentUser.value = {
        name: 'Error',
        id: null,
        email: null
      }
    }
  }

  const handleNewMessage = async (message) => {
    if (!currentUser.value.id) {
      return
    }

    const isForCurrentUser =
      String(message.receiverId) ===
      String(currentUser.value.id)

    const isFromCurrentUser =
      String(message.senderId) ===
      String(currentUser.value.id)

    if (!isForCurrentUser && !isFromCurrentUser) {
      return
    }

    const otherUserId = isFromCurrentUser
      ? message.receiverId
      : message.senderId

    if (
      selectedChat.value &&
      String(selectedChat.value.id) ===
        String(otherUserId)
    ) {
      const alreadyExists = messages.value.some(
        msg =>
          String(msg._id) ===
          String(message._id)
      )

      if (!alreadyExists) {
        messages.value.push(message)

        if (isForCurrentUser) {
          try {
            await fetch(
              `${apiUrl}/api/messages/read/${currentUser.value.id}/${otherUserId}`,
              {
                method: 'PUT',
                credentials: 'include'
              }
            )
          } catch (err) {
            console.error(
              'Error al marcar leído automáticamente:',
              err
            )
          }
        }
      }
    }

    const chat = chats.value.find(
      chat =>
        String(chat.id) ===
        String(otherUserId)
    )

    if (chat) {
      chat.lastMessage = message.content

      chat.time = new Date(
        message.createdAt
      ).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })

      if (
        isForCurrentUser &&
        (
          !selectedChat.value ||
          String(selectedChat.value.id) !==
            String(otherUserId)
        )
      ) {
        chat.unread = (chat.unread || 0) + 1
      }
    }
  }

  const handleMessagesRead = (data) => {
    if (!currentUser.value.id) {
      return
    }

    const userId = String(data.userId)
    const contactId = String(data.contactId)
    const currentUserId = String(currentUser.value.id)

    messages.value = messages.value.map(message => {
      const senderId = String(message.senderId)
      const receiverId = String(message.receiverId)

      if (
        senderId === currentUserId &&
        receiverId === userId
      ) {
        return {
          ...message,
          read: true
        }
      }

      return message
    })

    const chat = chats.value.find(
      chat => String(chat.id) === contactId
    )

    if (chat) {
      chat.read = true
    }
  }

  const handleSelectChat = async (chat) => {
    selectedChat.value = chat
    showMobileChat.value = true

    chatStore.markAsRead(chat.id)

    clearMessages()

    if (!currentUser.value.id) {
      return
    }

    try {
      await loadMessages(
        currentUser.value.id,
        chat.id
      )

      const response = await fetch(
        `${apiUrl}/api/messages/read/${currentUser.value.id}/${chat.id}`,
        {
          method: 'PUT',
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error(
          'No se pudieron marcar los mensajes como leídos'
        )
      }

      await loadMessages(
        currentUser.value.id,
        chat.id
      )

    } catch (error) {
      console.error(
        'Error al seleccionar chat:',
        error
      )
    }
  }

  const handleBack = () => {
    showMobileChat.value = false
    selectedChat.value = null

    clearMessages()
  }

  const handleSend = async () => {
    if (
      !messageText.value.trim() ||
      !selectedChat.value ||
      !currentUser.value.id
    ) {
      return
    }

    try {
      const textToSend =
        messageText.value.trim()

      await sendMessage(
        currentUser.value.id,
        selectedChat.value.id,
        textToSend
      )

      if (chatStore.updateLastMessage) {
        chatStore.updateLastMessage(
          selectedChat.value.id,
          textToSend
        )
      }

      messageText.value = ''

    } catch (err) {
      console.error(
        'Error al enviar mensaje:',
        err
      )
    }
  }

  const handleSearchUsers = async () => {
    await searchUsers(
      userSearchQuery.value
    )
  }

  const handleAddContact = async (contactId) => {
    try {
      if (!currentUser.value.id) {
        alert(
          'No se ha identificado el usuario actual'
        )

        return
      }

      await addContact(
        currentUser.value.id,
        contactId
      )

      showAddContact.value = false
      userSearchQuery.value = ''

      await chatStore.loadContactsAsChats(
        currentUser.value.id
      )

    } catch (err) {
      console.error(
        'Error al agregar contacto:',
        err
      )
    }
  }

  const handleDeleteChat = async (chatId) => {
    try {
      if (!currentUser.value.id) {
        return
      }

      chats.value = chats.value.filter(
        chat =>
          String(chat.id) !==
          String(chatId)
      )

      if (
        selectedChat.value &&
        String(selectedChat.value.id) ===
          String(chatId)
      ) {
        selectedChat.value = null
        showMobileChat.value = false

        clearMessages()
      }

    } catch (err) {
      console.error(
        'Error al eliminar contacto:',
        err
      )
    }
  }

  const handleClearChat = async (chatId) => {
    if (!currentUser.value.id) {
      return
    }

    try {
      await clearMessages(
        currentUser.value.id,
        chatId
      )

      const chat = chats.value.find(
        chat =>
          String(chat.id) ===
          String(chatId)
      )

      if (chat) {
        chat.lastMessage = ''
        chat.date = ''
        chat.time = ''
      }

      if (
        selectedChat.value &&
        String(selectedChat.value.id) ===
          String(chatId)
      ) {
        selectedChat.value = {
          ...selectedChat.value,
          lastMessage: '',
          date: '',
          time: ''
        }
      }

    } catch (error) {
      console.error(
        'Error al vaciar chat:',
        error
      )
    }
  }

  onMounted(() => {
    socket.on(
      'new-message',
      handleNewMessage
    )

    socket.on(
      'messages-read',
      handleMessagesRead
    )

    loadCurrentUser()
  })

  onUnmounted(() => {
    socket.off(
      'new-message',
      handleNewMessage
    )

    socket.off(
      'messages-read',
      handleMessagesRead
    )
  })

  return {
    currentUser,
    selectedChat,
    showMobileChat,
    messageText,
    searchQuery,
    showAddContact,
    userSearchQuery,
    filteredUsers,
    filteredChats,
    messages,
    handleSelectChat,
    handleBack,
    handleSend,
    handleSearchUsers,
    handleAddContact,
    handleDeleteChat,
    handleClearChat
  }
}

export { useDashboard }