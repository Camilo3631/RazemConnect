import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "@/stores/authStore";

describe('Auth Store', () => {
    beforeEach(() => {
      setActivePinia(createPinia())
    })

    it('has the correct inital state', () => {
      const authStore = useAuthStore()
      
      expect(authStore.currentUser).toEqual({
        name: 'Cargando...',
        id: null
      })

      expect(authStore.loading).toBe(false)
      expect(authStore.error).toBe(null)
    })

    it('fetches the current user successfully', async () => {
      const authStore = useAuthStore()

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({
          username: 'Camilo',
          _id: '123',
          email: 'camilo@example.com'
        })
      })

      await authStore.fetchCurrentUser()

      expect(authStore.currentUser).toEqual({
        name: 'Camilo',
        id: '123',
        email: 'camilo@example.com'
      })

      expect(authStore.loading).toBe(false)
      expect(authStore.error).toBe(null)
    })

    it('handles an unauthorized response', async () => {
      const authStore = useAuthStore()

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        json: async () => ({
          error: 'No autorizado'
        })
      })

      await authStore.fetchCurrentUser()

      expect(authStore.error).toBe('No autorizado')

      expect(authStore.currentUser).toEqual({
        name: 'Invitado',
        id: null
      })

      expect(authStore.loading).toBe(false)
    })

    it('sets loading to true while fetching', async () => {
      const authStore = useAuthStore()

      let resolveFetch

      vi.spyOn(globalThis, 'fetch').mockImplementation(
        () => 
          new Promise((resolve) => {
            resolveFetch = resolve
          }) 
      )

      const promise = authStore.fetchCurrentUser()

      expect(authStore.loading).toBe(true)

      resolveFetch({
        ok: true,
        json: async () => ({
           username: 'Camilo',
           _id: '123',
           email: 'camilo@example.com'
        })
      })

      await promise

      expect(authStore.loading).toBe(false)
    })

    it('handles a fetch error', async () => {
       const authStore = useAuthStore()

       vi.spyOn(globalThis, 'fetch').mockRejectedValue(
         new Error('Network error')
       )

       await authStore.fetchCurrentUser()

       expect(authStore.error).toBe('Network error')

       expect(authStore.currentUser).toEqual({
         name: 'Invitado',
         id: null
       })

       expect(authStore.loading).toBe(false)
    })
})


