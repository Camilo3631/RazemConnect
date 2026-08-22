import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import Register from "@/views/RegisterPage.vue";

const register = vi.fn()

vi.mock('@/composables/useRegister', () => ({
  useRegister: () => ({
    register,
    loading: ref(false),
     error: ref(null)
  })
}))

describe('Register', () => {
  const createWrapper = () => mount(Register, {
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

  it('renders the register form', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Register User')
    expect(wrapper.text()).toContain('Crea tu cuenta nueva')
    expect(wrapper.text()).toContain('Nombre de usuario')
    expect(wrapper.text()).toContain('Email')
    expect(wrapper.text()).toContain('Contraseña')
    expect(wrapper.text()).toContain('Crear cuenta')
  })

  it('submits the form', async () => {
    const wrapper = createWrapper()

    const inputs = wrapper.findAll('input')

    await inputs[0].setValue('Camilo')
    await inputs[1].setValue('camilo@test.com')
    await inputs[2].setValue('123456')

    await wrapper.find('form').trigger('submit')

    expect(register).toHaveBeenCalledWith(
      'Camilo',
      'camilo@test.com',
      '123456'
    )
  })

  it('toggles password visibility', async () => {
    const wrapper = createWrapper()
    const passwordInput = wrapper.find('input[type="password"]')
    const button = wrapper.find('button[type="button"]')


    expect(passwordInput.exists()).toBe(true)
    await button.trigger('click')
    expect(passwordInput.element.type).toBe('text')
  })
})
