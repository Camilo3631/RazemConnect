import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import Dashboard from '@/views/DashboardPage.vue'


const handleSelectChat = vi.fn()
const handleBack = vi.fn()
const handleSend = vi.fn()
const handleSearchUsers = vi.fn()
const handleAddContact = vi.fn()
const handleDeleteChat = vi.fn()
const handleClearChat = vi.fn()
const selectedChat = ref(null)

vi.mock('@/composables/useDashboard', () => ({
  useDashboard:() => ({
     currentUser: ref({
      id: '1',
      name: 'Camilo'
      }),
      currentUser: ref({
      id: '1',
      name: 'Camilo'
       }),
       selectedChat,
       messageText: ref(''),
       searchQuery: ref(''),
       showAddContact: ref(false),
       userSearchQuery: ref(''),
       filteredUsers: ref([]),
       filteredChats: ref([]),
       messages: ref([]),
       handleSelectChat,
       handleBack,
       handleSend,
       handleSearchUsers,
       handleAddContact,
       handleDeleteChat,
       handleClearChat
    })
}))
        
const createWrapper = () => mount(Dashboard, {
    global: {
     stubs: {
       Layout: {
        template: '<div><slot /></div>'
       },
       RouterLink: true,
       ChatPreview: true,
       InputMessage: true,
       SearchResults: true,
       MessageBubble: true,
       OhVueIcon: true
     }
   }
})

describe('Dashboard', () => {
   it('renders the dashboard', () => {
     const wrapper = createWrapper()
     expect(wrapper.text()).toContain(
       'Aún no tienes contactos. Usa el botón "+" para agregar uno'
     )
     expect(wrapper.text()).toContain(
       'Selecciona un chat para comenzar'
     )
   })

   it('opens the add contact modal', async () => {
     const wrapper = createWrapper()
     expect(wrapper.text()).not.toContain('Agregar contacto')
     const buttons = wrapper.findAll('button')
     await buttons[0].trigger('click')
     expect(wrapper.text()).toContain('Agregar contacto')
   })

   it('shows the selected chat', () => {
     selectedChat.value = {
       id: '2',
       name: 'Daria'
     }
     const wrapper = createWrapper()
     expect(wrapper.text()).toContain('Daria')
     selectedChat.value = null
   })
})
        




