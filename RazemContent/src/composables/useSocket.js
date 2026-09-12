import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],  // ✅ Cambio aquí
  upgrade: true,
  reconnection: true,           // ✅ Reconectar automático
  reconnectionDelay: 1000,      // ✅ Esperar 1s antes de reconectar
  reconnectionDelayMax: 5000,   // ✅ Máximo 5s de espera
  reconnectionAttempts: Infinity // 
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