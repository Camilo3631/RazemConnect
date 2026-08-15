import { ref } from 'vue'

const useUsers = () => {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  const searchUsers = async (searchTerm = '') => {
    loading.value = true
    error.value = null

    try {
      const url = searchTerm
       ? `${import.meta.env.VITE_API_URL}/api/users?search=${searchTerm}`
       : `${import.meta.env.VITE_API_URL}/api/users`
    
       const response = await fetch(url, {
          credentials: 'include'
       })

       const data = await response.json()

       if (!response.ok) {
        throw new Error(data.message || 'Error al buscar usuarios')
       }

       users.value = data
       return data
     } catch (err) {
       error.value = err.message
       throw err
     } finally {
       loading.value = false
     }
    }

    return {
      users,
      loading,
      error,
      searchUsers
   }
}

export { useUsers }