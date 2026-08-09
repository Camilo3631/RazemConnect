<template>
  <div
   @click="$emit('select', chat)"
   :class="[
      'flex items-center gap-3 p-4 cursor-pointer border-b border-slate-700 transition',
      isSlected ? 'bg-salte-700' : 'hover:bg-slate-750'    
    ]"
   >
   <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
     {{ chat.name.charAt(0) }}  
   </div>
   <div class="flex-1 min-w-0">
    <div class="flex justify-between items-center">
      <p 
       :class="[
         'text-ms truncate',
         !chat.read ? 'text-white font-bold' : 'text-slate-300 font-semibold'
       ]"
      >
      {{  chat.name }}
    </p>
    <span class="text-slate-400 text-xs flex-shrink-0 ml-2">{{ chat.date }} · {{ chat.time }}
     </span>
    </div>
    <div class="flex justify-between item-center">
      <p 
       :class="[
         'text-sm truncate',
         !chat.read ? 'text-slate-200 font-semibold' : 'text-slate-400'
       ]" 
      >
      {{ chat.lastMessage }}
    </p>
    <OhVueIcon
      name="bi-check2"
      scale="0.9"
      :class="chat.read ? 'text-red-500' : 'text-white'"
      class="flex-shrink-0"
      />
    </div>
   </div>
  </div>
</template>

 
<script setup>
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {  BiCheck2 } from 'oh-vue-icons/icons'

addIcons(BiCheck2)

defineProps({
   chat: {
     type: Object,
     required: true
   },
   isSlected: {
     type: Boolean,
     default: false
   }
})

defineEmits(['select'])




</script>













<!-- <template>
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
        <p
          :class="[
            'text-sm truncate',
            !chat.read ? 'text-white font-bold' : 'text-slate-300 font-semibold'
          ]"
        >
          {{ chat.name }}
        </p>
        <span class="text-slate-400 text-xs flex-shrink-0 ml-2">{{ chat.date }} · {{ chat.time }}</span>
      </div>
      <div class="flex justify-between items-center">
        <p
          :class="[
            'text-sm truncate',
            !chat.read ? 'text-slate-200 font-semibold' : 'text-slate-400'
          ]"
        >
          {{ chat.lastMessage }}
        </p>
        <OhVueIcon
          name="bi-check2"
          scale="0.9"
          :class="chat.read ? 'text-red-500' : 'text-white'"
          class="flex-shrink-0 ml-2"
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
</script> -->