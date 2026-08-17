<template>
  <div
    class="relative flex items-center gap-3 p-4 cursor-pointer border-b border-slate-700 transition"
    :class="isSelected ? 'bg-slate-700' : 'hover:bg-slate-750'"
    @click="$emit('select', chat)"
  >
    <div
      class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0"
    >
      {{ chat.name.charAt(0) }}
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-center">
        <p class="text-white text-sm font-semibold truncate">
          {{ chat.name }}
        </p>

        <span class="text-slate-400 text-xs flex-shrink-0 ml-2">
          {{ chat.date }} {{ chat.time }}
        </span>
      </div>

      <p class="text-xs truncate text-slate-400">
        {{ chat.lastMessage || 'Sin mensajes aún' }}
      </p>
    </div>

    <button
      @click.stop="showMenu = !showMenu"
      class="text-slate-400 hover:text-white p-1 flex-shrink-0"
    >
      <OhVueIcon
        name="bi-chevron-down"
        scale="1"
      />
    </button>

    <div
      v-if="showMenu"
      class="absolute right-2 top-14 bg-slate-900 rounded-lg shadow-xl z-20 py-1 w-44 border border-slate-700"
      @click.stop
    >
      <button
        @click="handleClearChat"
        class="w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-800 transition"
      >
        Vaciar chat
      </button>

      <button
        @click="handleDeleteContact"
        class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 transition"
      >
        Eliminar contacto
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { BiChevronDown } from 'oh-vue-icons/icons'
import { useContacts } from '@/composables/useContacts'
import { useMessages } from '@/composables/useMessages'
import { useDashboard } from '@/composables/useDashboard'

addIcons(BiChevronDown)

const props = defineProps({
  chat: {
    type: Object,
    required: true
  },

  isSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'select',
  'delete',
  'clear'
])

const showMenu = ref(false)

const { removeContact } = useContacts()
const { clearMessages } = useMessages()
const { currentUser } = useDashboard()

const handleClearChat = async () => {
  showMenu.value = false

  try {
    await clearMessages(
      currentUser.value.id,
      props.chat.id
    )

    emit('clear', props.chat.id)

  } catch (error) {
    console.error(
      'Error al vaciar chat:',
      error
    )
  }
}

const handleDeleteContact = async () => {
  showMenu.value = false

  try {
    await removeContact(
      currentUser.value.id,
      props.chat.id
    )

    // Avisar al componente padre
    // para que quite el chat de la lista
    emit('delete', props.chat.id)

  } catch (error) {
    console.error(
      'Error al eliminar contacto:',
      error
    )
  }
}

const handleClickOutside = (event) => {
  if (
    showMenu.value &&
    !event.target.closest('.relative')
  ) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener(
    'click',
    handleClickOutside
  )
})

onUnmounted(() => {
  document.removeEventListener(
    'click',
    handleClickOutside
  )
})
</script>