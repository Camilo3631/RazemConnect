import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockSocket } = vi.hoisted(() => ({
  mockSocket: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn()
  }
}))

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => mockSocket)
}))

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

describe('useSocket', () => {
  it('returns a socket instance', async () => {
    const { useSocket } = await import('@/composables/useSocket')
    const { socket } = useSocket()

    expect(socket).toBeDefined()
    expect(socket.on).toBeDefined()
    expect(socket.off).toBeDefined()
    expect(socket.emit).toBeDefined()
  })

  it('register connect, disconnect and connect_error listeners', async () => {
    const { useSocket } = await import('@/composables/useSocket')
    useSocket()

    const events = mockSocket.on.mock.calls.map(call => call[0])

    expect(events).toEqual(
      expect.arrayContaining(['connect', 'disconnect', 'connect_error'])
    )
  })
})
