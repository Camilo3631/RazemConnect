import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useMessages } from '@/composables/useMessages'

describe('useMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('has the correct initial state', () => {
    const { messages, loading, error } = useMessages()

    expect(messages.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })

  it('loads messages successfully', async () => {
    const { loadMessages, messages, loading, error } = useMessages()

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ([
        { _id: '1', senderId: '1', receiverId: '2', content: 'Hola' }
      ])
    })

    await loadMessages('1', '2')

    expect(messages.value).toEqual([
       { _id: '1', senderId: '1', receiverId: '2', content: 'Hola' }
    ])
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })

  it('handles error when loading messages fails', async () => {
    const { loadMessages, messages, loading, error } = useMessages()

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Error al cargar los mensajes' })
    })

    await expect(loadMessages('1', '2')).rejects.toThrow(
    'Error al cargar los mensajes'
    )

    expect(messages.value).toEqual([])
    expect(error.value).toBe('Error al cargar los mensajes')
  })

  it('sends a message successfully', async () => {
    const { sendMessage, messages } = useMessages()

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
       data: { _id: '1', senderId: '1', receiverId: '2', content: 'Hola' }
      })
    })

    const result = await sendMessage('1', '2', 'Hola')
   
    expect(result).toEqual({
       _id: '1', senderId: '1', receiverId: '2', content: 'Hola' 
    })

    expect(messages.value).toEqual([
      { _id: '1', senderId: '1', receiverId: '2', content: 'Hola' }
    ])
  })

  it('handles error when sending a message fails', async () => {
    const { sendMessage, error } = useMessages()

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Error al enviar el mensaje' })
    })

    await expect(sendMessage('1', '2', 'Hola')).rejects.toThrow(
      'Error al enviar el mensaje'
    )

    expect(error.value).toBe('Error al enviar el mensaje')
  })

  it('clears messages successfully', async () => {
    const { clearMessages, messages } = useMessages()

    messages.value = [
      { _id: '1', content: 'Hola'}
    ]

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ messages: 'Chat vaciado correctamente' })
    })

    await clearMessages('1', '2')

    expect(messages.value).toEqual([])
  })

  it('handles error when clearing messages fails', async () => {
    const { clearMessages, error } = useMessages()

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Error al vaciar el chat' })
    })

    await expect(clearMessages('1', '2')).rejects.toThrow(
      'Error al vaciar el chat'
    )

    expect(error.value).toBe('Error al vaciar el chat')
  })
})