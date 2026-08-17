import { ref, computed } from 'vue'

const useContacts = () => {
  const contacts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')

  const filteredContacts = computed(() => {
    if (!searchQuery.value) return contacts.value

    return contacts.value.filter(contact =>
      contact.username?.toLowerCase().includes(
        searchQuery.value.toLowerCase()
      )
    )
  })

  const addContact = async (userId, contactId) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contacts`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            contactId
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Error al agregar contacto'
        )
      }

      return data

    } catch (err) {
      error.value = err.message
      throw err

    } finally {
      loading.value = false
    }
  }

  const fetchContacts = async (userId) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contacts/${userId}`,
        {
          credentials: 'include'
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Error al obtener contactos'
        )
      }

      contacts.value = data

      return data

    } catch (err) {
      error.value = err.message
      throw err

    } finally {
      loading.value = false
    }
  }

  const removeContact = async (userId, contactId) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contacts/${userId}/${contactId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Error al eliminar contacto'
        )
      }

      // Eliminar inmediatamente de la interfaz
      contacts.value = contacts.value.filter(
        contact => String(contact.contactId) !== String(contactId)
      )

      return data

    } catch (err) {
      error.value = err.message
      throw err

    } finally {
      loading.value = false
    }
  }

  return {
    contacts,
    filteredContacts,
    searchQuery,
    loading,
    error,
    addContact,
    fetchContacts,
    removeContact
  }
}

export { useContacts }