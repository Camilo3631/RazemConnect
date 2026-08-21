import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { ref } from 'vue';
import ChatPreview from '@/components/ChatPreview.vue';


const { removeContact, clearMessages } = vi.hoisted(() => ({
  removeContact: vi.fn(),
  clearMessages: vi.fn()
}))


 
vi.mock('@/composables/useContacts', () => ({
   useContacts: () => ({
     removeContact
   })
}))

vi.mock('@/composables/useMessages', () => ({
  useMessages: () => ({
    clearMessages
  })
}))

vi.mock('@/composables/useDashboard', () => ({
  useDashboard: () => ({
     currentUser: ref({
        id: '1',
        name: 'Camilo'
     })
  })
}))

describe('ChatPreview', () => {
    const chat = {
      id: '2',
      name: 'Daria',
      date: '20/8',
      time: '17:43',
      lastMessage: 'Hola'
    }

    const createWrapper = () => shallowMount(ChatPreview, {
       props: {
        chat,
        isSelected: false
       },
       global: {
         stubs: {
            OhVueIcon: true
         }
       }
    })

    it('renders the chat', () => {
       const wrapper = createWrapper()

       expect(wrapper.text()).toContain('Daria')
       expect(wrapper.text()).toContain('Hola')
       expect(wrapper.text()).toContain('20/8')
       expect(wrapper.text()).toContain('17:43')
       
    })

    it('emits select when clicking the chat', async () => {
      const wrapper = createWrapper()

      await wrapper.find('.relative').trigger('click')
      
      expect(wrapper.emitted(['select'])).toEqual([
        [chat]
      ])
    }) 

    it('opens the menu', async () => {
      const wrapper = createWrapper()

      expect(wrapper.text()).not.toContain('Vaciar chat')

      await wrapper.findAll('button')[0].trigger('click')

      expect(wrapper.text()).toContain('Vaciar chat')
      expect(wrapper.text()).toContain('Eliminar contacto')
   })
})
    
