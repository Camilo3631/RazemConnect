import { describe, it, expect, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { ref } from "vue";
import ProfilePage from "@/views/ProfilePage.vue";


const editName = vi.fn()
const saveName = vi.fn()
const deleteAccount= vi.fn()
const editingName = ref(false)
const editedName = ref('')
const currentUser = ref({
  name: 'Camilo',
  email: 'camilo@test.com',
  id: '1'
})

vi.mock('@/composables/useProfile', () => ({ 
  useProfile: () => ({
    currentUser,
    editingName,
    editedName,
    editName,
    saveName,
    deleteAccount
   })
}))

const createWrapper = () => shallowMount(ProfilePage, {
   global: {
    stubs: {
      Layout: {
        template: '<div><slot /></div>'
      },
      OhVueIcon: true
    }
   }
})

describe('ProfilePage', () => {
  it('renders the user name and email', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Camilo')
    expect(wrapper.text()).toContain('camilo@test.com')
  })

  it('calls editName when clicking the edit button', async () => {
    const wrapper = createWrapper()
    
    await wrapper.find('button[type="button"]').trigger('click')

    expect(editName).toHaveBeenCalled()
  })

  it('shows input when name edtting name', async () => {
    editingName.value = true

    const wrapper = createWrapper()
    
    expect(wrapper.find('input').exists()).toBe(true)

    editingName.value = false
  })

  it('calls deleteAccount when clicking delete button', async () => {
    const wrapper = createWrapper()

    const buttons = wrapper.findAll('button')
    await buttons[buttons.length -1].trigger('click')

    expect(deleteAccount).toHaveBeenCalled()
  })
})