import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import { useDashboard } from '@/composables/useDashboard'

const loadContactsAsChats= vi.fn()
const updateLastMessage = vi.fn()
const markAsRead = vi.fn()
const chats = ref([])

vi.mock('@/stores/chatStore', () => ({
    useChatStore: () => ({
        chats,
        loadContactsAsChats,
        updateLastMessage,
        markAsRead
    })
}))

const searchUsers = vi.fn()
const users = ref([])

vi.mock('@/composables/useUsers', () => ({
    useUsers: () => ({
        users,
        searchUsers
    })
}))

const addContact = vi.fn()

vi.mock('@/composables/useContacts', () => ({
    useContacts: () => ({
        addContact
    })
}))

const sendMessage = vi.fn()
const loadMessages = vi.fn()
const clearMessages = vi.fn()
const messages = ref([])

vi.mock('@/composables/useMessages', () => ({
    useMessages: () => ({
        messages,
        sendMessage,
        loadMessages,
        clearMessages
    })
}))

const socketOn = vi.fn()
const socketOff = vi.fn()
const socketEmit = vi.fn()

vi.mock('@/composables/useSocket', () => ({
    useSocket: () => ({
      socket: {
        off: socketOff,
        on: socketOn,
        emit: socketEmit
      }
    })
}))

describe('useDashboard', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.restoreAllMocks()
        chats.value = []
        users.value = []
        messages.value = []

        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({})
        })) 
    })

    it('has the correct initial state', () => {
        const { currentUser, selectedChat, messageText } = useDashboard()

        expect(currentUser.value).toEqual({
          name: 'Cargando...',
          id: null,
          email: null
        })
        expect(selectedChat.value).toBe(null)
        expect(messageText.value).toBe('')        
      })

      it('filters users excluding the current user', () => {
        const { filteredUsers, currentUser } = useDashboard()

        currentUser.value.id = '1' 
        users.value = [
          { _id: '1', username: 'Camilo' },
          { _id: '2', username: 'Daria' }
        ]
        
        expect(filteredUsers.value).toEqual([
          { _id: '2', username: 'Daria' }
        ])
       })

       it('filters chats by search query', () => {
        const { filteredChats, searchQuery } = useDashboard()

        chats.value = [
          { id: '1', name: 'Daria' },
          { id: '2', name: 'Camilo' }
        ]

        searchQuery.value = 'dar'
        
        expect(filteredChats.value).toEqual([
          { id: '1', name: 'Daria' }
        ])
       })

       it('sends a message successfully', async () => {
         const { handleSend, messageText, selectedChat, currentUser } = useDashboard()
         
         currentUser.value.id = '1'
         selectedChat.value = { id: '2', name: 'Daria' }
         messageText.value =  'Hola!'

         sendMessage.mockResolvedValueOnce({})
         
         await handleSend()

    
         expect(sendMessage).toHaveBeenCalledWith('1', '2', 'Hola!')
         expect(updateLastMessage).toHaveBeenCalledWith('2', 'Hola!')
         expect(messageText.value).toBe('')
       })

       it('does not send an empty message', async () => {
        sendMessage.mockClear()

        const { handleSend, messageText, selectedChat, currentUser } = useDashboard()
        
        currentUser.value.id = '1'
        selectedChat.value = { id: '2', name: 'Daria' }
        messageText.value =  ''
        
        await handleSend()
        
        expect(sendMessage).not.toHaveBeenCalled()
      })

      it('adds a contact and reloads chats', async () => {
       const { handleAddContact, currentUser, showAddContact } = useDashboard()

        currentUser.value.id = '1'
        showAddContact.value = true

        addContact.mockResolvedValueOnce({})

        await handleAddContact('2')
        
       expect(addContact).toHaveBeenCalledWith('1', '2')
        expect(loadContactsAsChats).toHaveBeenCalledWith('1')
        expect(showAddContact.value).toBe(false)
      })
      
     it('deletes a chat from the list', async () => {
        const { handleDeleteChat, currentUser } = useDashboard()
        
        currentUser.value.id = '1'
        chats.value = [
          { id: '2', name: 'Daria' },
          { id: '3', name: 'Camilo' }
        ]
        
        await handleDeleteChat('2')
        
       expect(chats.value).toEqual([
          { id: '3', name: 'Camilo' }
        ])
     })

     it('clears back to selectedChat null on handleBck', () => {
      const { handleBack, selectedChat, showMobileChat } = useDashboard()

      selectedChat.value = { id: '2', name: 'Daria' }
      showMobileChat.value = true
      
      handleBack()
      
      expect(selectedChat.value).toBe(null)
      expect(showMobileChat.value).toBe(false)
      expect(clearMessages).toHaveBeenCalled()
    })
 })

