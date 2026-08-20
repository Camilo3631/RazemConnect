import { defineStore } from "pinia";
import { ref } from "vue";

const useAuthStore = defineStore('auth', ()  => {
   const currentUser = ref({ name: 'Cargando...', id: null })
   const loading = ref(false)
   const error = ref(null)

   const fetchCurrentUser = async () => {
    loading.value = true
    error.value = null

    try {
      const url = `${import.meta.env.VITE_API_URL}/api/users/me`

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      })

      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.error || 'No autorizado')
      }

      currentUser.value = {
        name: data.username,
        id: data._id,
        email: data.email
        }
      } catch (err) {
        error.value = err.message
        currentUser.value = { name: 'Invitado', id: null }
      } finally {
        loading.value = false
      }
    }
 
    return {
     currentUser,
     loading,
     error,
     fetchCurrentUser
   }
})

export { useAuthStore };



   



