import { describe, it, expect, vi, beforeEach } from "vitest";
import { useContacts } from "@/composables/useContacts";



describe('useContants', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('has the correct intial state', () => {
   const { contacts, loading, error, searchQuery } = useContacts()

   expect(contacts.value).toEqual([])
   expect(loading.value).toBe(false)
   expect(error.value).toBe(null)
   expect(searchQuery.value).toBe('')
  })

  it('filters contacts by search query', () => { 
    const { contacts, filteredContacts, searchQuery } = useContacts()

    contacts.value = [
      { username: 'Daria' },
      { username: 'Camilo'},
      { username: 'Juan'}
    ]

    searchQuery.value = 'dar'

    expect(filteredContacts.value).toEqual([
      { username: 'Daria'}
    ])
  }) 

  it('returns all contacts when search query is empty', () => {
    const { contacts, filteredContacts } = useContacts()

    contacts.value = [
      { username: 'Daria' },
      { username: 'Camilo' }
    ]

    expect(filteredContacts.value).toEqual(contacts.value)
  }) 

  it('adds a contact succesfully', async () => {
    const { addContact, loading, error } = useContacts()

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
       ok: true,
       json: async () => ({ message: 'Contacto agregado exitosamente' })
       
    })

    const result = await addContact('1', '2')

     expect(result).toEqual({ message: 'Contacto agregado exitosamente' })
     expect(loading.value).toBe(false)
     expect(error.value).toBe(null)
  })

  it('handles error when adding a contact fails', async () => {
    const { addContact, error } = useContacts()

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
       ok: false,
       json: async () => ({ message: 'Este contacto ya fue agregado'})
    })

    await expect(addContact('1', '2')).rejects.toThrow(
      'Este contacto ya fue agregado'
    )

    expect(error.value).toBe('Este contacto ya fue agregado')
  })

  it('fetches conectacts successfully', async () => {
    const { fetchContacts, contacts } = useContacts()

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ([
        { useId: '1', contactId: '2' }
      ])
    })

    await fetchContacts('1')

    expect(contacts.value).toEqual([
       { useId: '1', contactId: '2' }
    ])
  })

  it('handls error when fetching contacts fails', async () => {
    const { fetchContacts, error } = useContacts()

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      oK: false,
      json: async () => ({ message: 'Error al obtener contactos' })
    })

    await expect(fetchContacts('1')).rejects.toThrow(
       'Error al obtener contactos'
    )

    expect(error.value).toBe('Error al obtener contactos')
  })

  it('removes a contact successfully', async () => {
    const { removeContact, contacts } = useContacts()

    contacts.value = [
     { contactId: '2', username: 'Daria' },
     { contactId: '3', username: 'Camilo' }
    ]

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Contacto eliminado extiosamente' })
    })

    await removeContact('1', '2')

    expect(contacts.value).toEqual([
      { contactId: '3', username: 'Camilo' }
    ])
  })

  it('handles error when removing a contact fails', async () => {
    const { removeContact, error } = useContacts()

     vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Contacto no encontrado' })
    })

    await expect(removeContact('1', '999')).rejects.toThrow(
      'Contacto no encontrado'
    )

    expect(error.value).toBe('Contacto no encontrado')
  })
})

  

   