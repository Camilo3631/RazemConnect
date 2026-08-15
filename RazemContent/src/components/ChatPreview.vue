<template>
  <div
    @click="$emit('select', chat)"
    :class="[
      'flex items-center gap-3 p-4 cursor-pointer border-b border-slate-700 transition',
      isSelected ? 'bg-slate-700' : 'hover:bg-slate-750'
    ]"
  >
    <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
      {{ chat.name.charAt(0) }}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-center">
        <p class="text-white text-sm font-semibold truncate">{{ chat.name }}</p>
        <span class="text-slate-400 text-xs flex-shrink-0 ml-2">{{ chat.date }} {{ chat.time }}</span>
      </div>
      <p class="text-xs truncate text-slate-400">
        {{ chat.lastMessage || 'Sin mensajes aún' }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  chat: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select'])
</script>