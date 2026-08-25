import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUsers } from "@/composables/useUsers";

describe("useUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it("has the correct initial state", () => {
    const { loading, error, users } = useUsers();

    expect(users.value).toEqual([]);
    expect(error.value).toBe(null);
    expect(loading.value).toBe(false);
  })

  it('searchs users without a search term', async () => {
    const { searchUsers, users } = useUsers();

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ([
        { _id: '1', username: 'Camilo' }
       ])
    })
    
    await searchUsers();
    
  
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/users'),
      expect.any(Object)
    )
    expect(users.value).toEqual([
      { _id: '1', username: 'Camilo' }
    ])
   })

   it('searchs users with a search trem', async () => {
    const { searchUsers, users } = useUsers();

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ([
        { _id: '2', username: 'Daria' }
      ])
    })
    
    await searchUsers('dar')
    
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('search=dar'),
      expect.any(Object)
    )
    expect(users.value).toEqual([
      { _id: '2', username: 'Daria' }
    ])   
   })

   it('handles errors when searching users', async () => {
     const { searchUsers,  error } = useUsers();

     vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Errro al buscar usuarios' })
     })

     await expect(searchUsers('test')).rejects.toThrow(
     'Errro al buscar usuarios'
     )

     expect(error.value).toBe('Errro al buscar usuarios')
   })
})
