<template>
  <div :class="['flex', isOwn ? 'justify-end' : 'justify-start']">
    <div :class="[
      'text-white text-sm px-4 py-2 rounded-2xl max-w-xs',
      isOwn ? 'bg-blue-600' : 'bg-slate-700'
    ]">

    <div class="flex items-end gap-2">
      <p>{{ message.content }}</p>
        
        <OhVueIcon
          v-if="isOwn"
          name="bi-check2"
          scale="0.8"
          :class="message.read ? 'text-[#DC143C]' : 'text-blue-200'"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { BiCheck2 } from 'oh-vue-icons/icons';

addIcons(BiCheck2)

defineProps({
  message: {
    type: Object,
    required: true
  },
  isOwn: {
    type: Boolean,
    default: false
  }
})
</script>