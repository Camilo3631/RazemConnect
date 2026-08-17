import { ref, computed, onMounted } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { useUsers } from '@/composables/useUsers'
import { useContacts } from '@/composables/useContacts'
import { useMessages } from '@/composables/useMessages'
import { storeToRefs } from 'pinia'

const useDashboard = () => {
  const chatStore = useChatStore()
  const { chats } = storeToRefs(chatStore)

  const { users, searchUsers } = useUsers()
  const { addContact } = useContacts()

  const {
    messages,
    sendMessage,
    loadMessages,
    clearMessages
  } = useMessages()

  const currentUser = ref({
    name: 'Cargando...',
    id: null
  })

  const selectedChat = ref(null)
  const showMobileChat = ref(false)
  const messageText = ref('')
  const searchQuery = ref('')
  const showAddContact = ref(false)
  const userSearchQuery = ref('')

  const filteredUsers = computed(() => {
    return users.value.filter(
      user => user._id !== currentUser.value.id
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
      const apiUrl =
        import.meta.env.VITE_API_URL || 'http://localhost:3000'

      const response = await fetch(`${apiUrl}/api/users/me`, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        currentUser.value = {
          name: 'Invitado',
          id: null
        }
        return
      }

      const data = await response.json()

      currentUser.value = {
        name: data.username,
        email: data.email,
        id: data._id
      }

      await chatStore.loadContactsAsChats(data._id)

    } catch (err) {
      console.error('Error al obtener usuario actual:', err)

      currentUser.value = {
        name: 'Error',
        id: null
      }
    }
  }

  const handleSelectChat = async (chat) => {
    selectedChat.value = chat
    showMobileChat.value = true

    chatStore.markAsRead(chat.id)

    clearMessages()

    if (currentUser.value.id) {
      await loadMessages(
        currentUser.value.id,
        chat.id
      )

      const apiUrl =
        import.meta.env.VITE_API_URL || 'http://localhost:3000'

      await fetch(
        `${apiUrl}/api/messages/read/${currentUser.value.id}/${chat.id}`,
        {
          method: 'PUT',
          credentials: 'include'
        }
      )

      await loadMessages(
        currentUser.value.id,
        chat.id
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
      const textToSend = messageText.value.trim()

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
      console.error('Error al enviar mensaje:', err)
    }
  }

  const handleSearchUsers = async () => {
    await searchUsers(userSearchQuery.value)
  }

  const handleAddContact = async (contactId) => {
    try {
      if (!currentUser.value.id) {
        alert('No se ha identificado el usuario actual')
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
      console.error('Error al agregar contacto:', err)
    }
  }

  const handleDeleteChat = async (chatId) => {
    try {
      if (!currentUser.value.id) {
        return
      }

      chats.value = chats.value.filter(
        chat => String(chat.id) !== String(chatId)
      )

      if (
        selectedChat.value &&
        String(selectedChat.value.id) === String(chatId)
      ) {
        selectedChat.value = null
        showMobileChat.value = false
        clearMessages()
      }

    } catch (err) {
      console.error('Error al eliminar contacto:', err)
    }
  }

  const handleClearChat = async (chatId) => {
    if (!currentUser.value.id) return

    try {
      await clearMessages(
        currentUser.value.id,
        chatId
      )

      const chat = chats.value.find(
        chat => String(chat.id) === String(chatId)
      )

      if (chat) {
        chat.lastMessage = ''
        chat.date = ''
        chat.time = ''
      }

      if (
        selectedChat.value &&
        String(selectedChat.value.id) === String(chatId)
      ) {
        selectedChat.value = {
          ...selectedChat.value,
          lastMessage: '',
          date: '',
          time: ''
        }
      }
    } catch (error) {
      console.log('Error al vaciar chat:', error)
    }
  }
    


  onMounted(() => {
    loadCurrentUser()
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