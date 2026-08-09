 <!-- <template>
  <div class="p-4 border-t border-slate-700 bg-slate-800 flex items-center gap-2">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      placeholder="Escribe un mensaje..."
      class="flex-1 px-4 py-2 text-sm bg-slate-700 text-white placeholder-slate-400 rounded-full border border-slate-600 focus:outline-none focus:border-blue-500"
      />
      <button
       @click="$emit('send')"
       class="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 flex items-center justify-center transition"
       >
        <OhVueIcon name="bi-send-fill" scale="1.1" />
      </button>
  </div>
</template>

<script setup>
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { BiSendFill } from 'oh-vue-icons/icons';

addIcons(BiSendFill)

defineProps({
   modelValue: {
     type: String,
     default: ''
   }
})

defineEmits(['update:modelValue', 'send'])
</script> -->




<template>
  <div class="p-4 border-t border-slate-700 bg-slate-800 flex items-center gap-2">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      placeholder="Escribe un mensaje..."
      class="flex-1 px-4 py-2 text-sm bg-slate-700 text-white placeholder-slate-400 rounded-full border border-slate-600 focus:outline-none focus:border-blue-500"
    />
    <button
      @click="$emit('send')"
      class="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 flex items-center justify-center transition"
    >
      <OhVueIcon name="bi-send-fill" scale="1.1" />
    </button>
  </div>
</template>

<script setup>
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { BiSendFill } from 'oh-vue-icons/icons';

addIcons(BiSendFill)

defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue', 'send'])
</script> 