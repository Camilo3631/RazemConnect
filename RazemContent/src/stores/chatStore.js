import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const chats = ref([
    { id: 1, name: 'Juan Pérez', lastMessage: 'Hola, ¿cómo estás?', date: '06 Ago', time: '10:30', read: false },
    { id: 2, name: 'María López', lastMessage: 'Nos vemos mañana', date: '06 Ago', time: '09:15', read: true },
    { id: 3, name: 'Carlos Ruiz', lastMessage: '👍', date: '05 Ago', time: '18:20', read: false },
  ])

  const markAsRead = (chatId) => {
    const chat = chats.value.find(c => c.id === chatId)
    if (chat) {
      chat.read = true
    }
  }

  return {
    chats,
    markAsRead
  }
})