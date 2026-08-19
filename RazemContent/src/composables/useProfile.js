import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboard } from '@/composables/useDashboard'

const useProfile = () =>  {
  const router = useRouter()
  const { currentUser } = useDashboard()

  const editingName = ref(false)
  const editedName = ref('')

  const editName = () => {
    editedName.value = currentUser.value.name
    editingName.value = true
  }

  const saveName = async () => {
    const username = editedName.value.trim()

    if (!username) {
      editingName.value = false
      return
    }

    if (!currentUser.value.id) {
      editingName.value = false
      return
    }

    if (username === currentUser.value.name) {
      editingName.value = false
      return
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

      const response = await fetch(
        `${apiUrl}/api/users/${currentUser.value.id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username })
        }
      )

      if (!response.ok) {
        editingName.value = false
        return
      }

      currentUser.value.name = username
      editingName.value = false

    } catch (error) {
      console.error('Error al actualizar nombre:', error)
      editingName.value = false
    }
  }

  const deleteAccount = async () => {
    if (!currentUser.value.id) {
      return
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

      const response = await fetch(
        `${apiUrl}/api/users/${currentUser.value.id}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      if (!response.ok) {
        return
      }

      await router.push('/home')

    } catch (error) {
      console.error('Error al eliminar la cuenta:', error)
    }
  }

  return {
    currentUser,
    editingName,
    editedName,
    editName,
    saveName,
    deleteAccount
  }
}

export { useProfile }