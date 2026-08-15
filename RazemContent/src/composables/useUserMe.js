import { ref } from 'vue'


const currentUser = ref({
  name: 'Cargando...',
  id: null,
  email: null
})

const loading = ref(false)
const error = ref(null)

export function useUsersMe() {

  const fetchCurrentUser = async (forceRefresh = false) => {

  
    if (
      loading.value ||
      (!forceRefresh && currentUser.value.id)
    ) {
      return currentUser.value
    }

    loading.value = true
    error.value = null

    try {
      const url = `${import.meta.env.VITE_API_URL}/api/users/me`

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Error al obtener el usuario actual'
        )
      }


      currentUser.value = {
        name: data.username,
        id: data._id,
        email: data.email
      }

      return data

    } catch (err) {

      error.value = err.message

      currentUser.value = {
        name: 'Invitado',
        id: null,
        email: null
      }

      throw err

    } finally {
      loading.value = false
    }
  }


  const clearUser = () => {
    currentUser.value = {
      name: 'Invitado',
      id: null,
      email: null
    }

    error.value = null
  }

  return {
    currentUser,
    loading,
    error,
    fetchCurrentUser,
    clearUser
  }
}