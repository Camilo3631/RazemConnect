import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import LoginPage from "@/views/LoginPage.vue";


const login = vi.fn()
const loading = ref(false)
const error = ref(null)

vi.mock('@/composables/useLogin', () => ({
  useLogin: () => ({
    login,
    loading,
    error
  })
}))

const createWrapper = () => mount(LoginPage, {
    global: {
        stubs: {
            Layout: {
                template: '<div><slot /></div>'
            },
            RouterLink: true,
            OhVueIcon: true
        }   
    }
})

describe('LoadinPage', () => {
  it('renders the login form', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Login User')
    expect(wrapper.find('input[type="email"]'))
  })

  it('does not show error message by default', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).not.toContain('error')
  })

  it('shows error message when error exist', async () => {
    error.value = 'Credenciales inválidas'

    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Credenciales inválidas')

    error.value = null
  })

  it('calls login on submit', async () => {
    const wrapper = createWrapper()

    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('form').trigger('submit.prevent')

    expect(login).toHaveBeenCalled()
  })
  
  it('toggles password visibility', async () => {
    const wrapper = createWrapper()

    const passwordInput = wrapper.find('input[type="password"]')
    expect(passwordInput.exists()).toBe(true)

    const toggleButton = wrapper.find('button[type="button"]')
    await toggleButton.trigger('click')

    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('shows loading text when loading is true', async () => {
    loading.value = true

    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Ingresando...')

    loading.value = false
  })
})



