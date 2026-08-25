import { describe, it, expect, beforeEach, vi  } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useChatStore,  } from "@/stores/chatStore";


describe('ChatStore', () => {
     beforeEach(() => {
        setActivePinia(createPinia())
     })

     it('has the correct intial state', () => {
       const chatStore = useChatStore()

       expect(chatStore.chats).toEqual([])
       expect(chatStore.loading).toEqual(false)
     })

    it('loads contacts as chats successfully', async () => {
      const chatStore = useChatStore()

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { userId: '1', contactId: '2', createdAt: new Date() }
        ])
      }).mockResolvedValueOnce({
         ok: true,
         json: async () => ([
           { _id: '2', username: 'Daria'}
         ])
      }).mockResolvedValueOnce({
         ok: true,
         json: async () => ([])
      })

      await chatStore.loadContactsAsChats('1')


      expect(chatStore.chats).toEqual([
        {
          id: '2',
          name: 'Daria',
          lastMessage: '',
          date: '',
          time: '',
          read: true
        }
      ])

      expect(chatStore.loading).toBe(false)
    })

    it('handles error when contacts fetch fails', async () => {
      const chatsStore = useChatStore()

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false
      })

      await chatsStore.loadContactsAsChats('1')

      expect(chatsStore.chats).toEqual([])
      expect(chatsStore.loading).toBe(false)
    })

    it('updates the last message of a chat', async () => {
      const chatStore = useChatStore()

      chatStore.chats = [
        { id: '2', name: 'Daria', lastMessage: '', date: '', time: '', read: true }
      ]

      chatStore.updateLastMessage('999', 'Hola')

      expect(chatStore.chats[0].lastMessage).toBe('')
    })

    it('marks a chat as read', () => {
      const chaStore = useChatStore()

      chaStore.chats = [
        { id: '2', name: 'Daria', read: false }
      ]

      chaStore.markAsRead('2')

      expect(chaStore.chats[0].read).toBe(true)
    })
})