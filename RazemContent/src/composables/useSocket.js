import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'], 
  upgrade: true,
  reconnection: true,          
  reconnectionDelay: 1000,      
  reconnectionDelayMax: 5000,  
  reconnectionAttempts: Infinity 
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