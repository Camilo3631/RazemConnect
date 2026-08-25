import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUsersMe } from '@/composables/useUserMe'

describe('useUsersMe', () => {
  beforeEach(() => {
    vi.restoreAllMocks()

    const { clearUser } = useUsersMe()
    clearUser()
  })

  it('fetches the current user successfully', async () => {
    const { fetchCurrentUser, currentUser } = useUsersMe()

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        username: 'Camilo',
        _id: '1',
        email: 'camilo@test.com'
      })
    })

    await fetchCurrentUser()

   expect(currentUser.value).toEqual({
    name: 'Camilo',
    id: '1',
    email: 'camilo@test.com'
   })
  })

  it('does not refetch if user alredy loaded and forceRefresh is false', async () => {
    const { fetchCurrentUser, currentUser } = useUsersMe()
    
    currentUser.value = {
      name: 'Camilo',
      id: '1',
      email: 'camilo@test.com'
    }

    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    
    await fetchCurrentUser()

    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('refetches when forceRefresh is true', async () => {
    const { fetchCurrentUser, currentUser } = useUsersMe()
    
    currentUser.value = {
      name: 'Camilo',
      id: '1',
      email: 'camilo@test.com'
    }

     vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        username: 'CamiloActualizado',
        _id: '1',
        email: 'camilo@test.com'
      })
    })

    await fetchCurrentUser(true)

   expect(currentUser.value.name).toBe('CamiloActualizado')
  })

  it('sets user to Invitado on fetch error', async () => {
    const { fetchCurrentUser, currentUser, error } = useUsersMe()
    
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'No autorizado'})
    })

    await expect(fetchCurrentUser()).rejects.toThrow('No autorizado')

    expect(currentUser.value).toEqual({
      name: 'Invitado',
      id: null,
      email: null
    })
    expect(error.value).toBe('No autorizado')
  })

  it('clears the user correctly', () => {
    const { currentUser, clearUser } = useUsersMe()
    
    currentUser.value = {
      name: 'Camilo',
      id: '1',
      email: 'camilo@test.com'
    }
    
    clearUser()
    
    expect(currentUser.value).toEqual({
      name: 'Invitado',
      id: null,
      email: null
    })
  })
})

