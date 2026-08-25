import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLogin } from '@/composables/useLogin'

const push = vi.fn()

vi.mock('vue-router', () => ({
    useRouter: () => ({
     push
    })
}))

describe('useLogin', () => {
    beforeEach(() => {
      vi.restoreAllMocks()
      push.mockClear()
    })
    
    it('has the correct inital state', () => {
      const { user, loading, error } = useLogin()

      expect(user.value).toBe(null)
      expect(loading.value).toBe(false)
      expect(error.value).toBe(null)
    })

    it('logs in successfully and redirects to dashboard', async () => {
      const { login, user } = useLogin()

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
       json: async () => ({
         user: { id: '1', username: 'Camilo'},
         message: 'Login exitoso'
       })
     })

     await login('camilo@test.com', '123456')

     expect(user.value).toEqual({ id: '1', username: 'Camilo' })
     expect(push).toHaveBeenCalledWith('/dashboard')
   })

   it('handles login error', async () => {
    const { login, error } = useLogin()

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Usuario no encontrado' })
    })

    await expect(login('camilo@test.com', 'wrong')).rejects.toThrow(
     'Usuario no encontrado'
    )

    expect(error.value).toBe('Usuario no encontrado')
    expect(push).not.toHaveBeenCalled()
   })
})
