import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  transports: ['polling'],
  upgrade: false
})

socket.on('connect', () => {
  console.log('🟢 Socket conectado:', socket.id)
})

socket.on('disconnect', (reason) => {
  console.log('🔴 Socket desconectado:', reason)
})

socket.on('connect_error', (error) => {
  console.error('🔴 Error Socket.IO:', error.message)
})

const useSocket = () => {
  return {
    socket
  }
}

export { useSocket }