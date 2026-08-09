<template>
  <Layout :show-footer="false">
    <div class="flex h-[calc(100vh-72px)] bg-slate-900 relative overflow-hidden">

      <div :class="[
        'border-r border-slate-700 flex-col bg-slate-800',
        selectedChat ? 'hidden min-[780px]:flex min-[780px]:w-80' : 'flex w-full min-[780px]:w-80 h-full'
       ]">
      <RouterLink
       to="/profile"
       class="flex items-center gap-3 p-4 border-b border-slate-700 hover:bg-slate-700 transition cursor-pointer flex-shrink-0"
       >
       <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
        {{ currentUser.name.charAt(0)}}
       </div>
       <p class="text-white text-sm font-semibold truncate">{{ currentUser.name }}</p>
      </RouterLink>

      <SearchResults v-model="searchQuery" />

      <div class="flex-1 overflow-y-auto">
        <ChatPreview
         v-for="chat in filteredChats"
         :key="chat.id"
         :chat="chat"
         :is-selected="selectedChat?.id === chat.id"
         @select="handleSelectChat"
         />
      </div>
    </div>

    <div :class="[
      'flex-col bg-slate-900',
      selectedChat ? 'flex absolute inset-0 min-[780px]:static min-[780px]:flex-1 z-10' : 'hidden min-[780px]:flex min-[780px]:flex-1'
    ]">
     <div v-if="selectedChat" class="flex items-center gap-3 p-4 border-b border-slate-700 
      bg-slate-800">
      <button @click="handleBack" class="min-[780px]:hidden text-white p-1">
        <OhVueIcon name="bi-arrow-left" scale="1.2"/>
      </button>
        <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
          {{ selectedChat.name.charAt(0) }}
        </div>
        <p class="text-white text-sm font-semibold truncate">{{ selectedChat.name }}</p>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <div v-if="selectedChat" class="flex justify-start">
          <div class="bg-slate-700 text-white text-sm px-4 py-2 rounded-2xl max-w-xs">
              {{ selectedChat.lastMessage }}
          </div>
        </div>
        <div v-else class="flex-1 flex items-center justify-center h-full">
          <p class="text-slate-500 text-sm">Selecciona un chat para comenzar</p>
        </div>  
      </div>

      <InputMessage v-model="messageText" @send="handleSend" />

     </div>
   </div>
  </Layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import Layout from '@/components/Layout.vue';
import ChatPreview from '@/components/ChatPreview.vue';
import InputMessage from '@/components/InputMessage.vue';
import SearchResults from '@/components/SearchResults.vue';
import { useChatStore } from '@/stores/chatStore';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { BiArrowLeft } from 'oh-vue-icons/icons';


addIcons(BiArrowLeft)

const currentUser = ref({ name: 'Tu Nombre' })

const chatStore = useChatStore()
const { chats } = storeToRefs(chatStore)

const selectedChat = ref(null)
const showMobileChat = ref(false)
const messageText = ref('')
const searchQuery = ref('')

const filteredChats = computed(() => {
  if (!searchQuery.value) return chats.value
  return chats.value.filter(chat => 
    {
      return chat.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    }
  )
})

const handleSelectChat = (chat) => {
  selectedChat.value = chat
  showMobileChat.value = true
  chatStore.markAsRead(chat.id)
}

const handleBack = () => {
  showMobileChat.value = false
  selectedChat.value = null
}

const handleSend = () => {
   console.log('Enviado', messageText.value)
   messageText.value = '';
}
</script> 






















<!-- 



 <template>
  <Layout :show-footer="false">
    <div class="flex h-[calc(100vh-72px)] bg-slate-900 relative overflow-hidden">
      
 
<div :class="[
        'border-r border-slate-700 flex-col bg-slate-800',
        selectedChat ? 'hidden min-[780px]:flex min-[780px]:w-80' : 'flex w-full min-[780px]:w-80 h-full'
      ]">
        <RouterLink
          to="/profile"
          class="flex items-center gap-3 p-4 border-b border-slate-700 hover:bg-slate-700 transition cursor-pointer flex-shrink-0"
        >
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {{ currentUser.name.charAt(0) }}
          </div>
          <p class="text-white text-sm font-semibold truncate">{{ currentUser.name }}</p>
        </RouterLink>

        <SearchResults v-model="searchQuery" />

        <div class="flex-1 overflow-y-auto">
          <ChatPreview
            v-for="chat in filteredChats"
            :key="chat.id"
            :chat="chat"
            :is-selected="selectedChat?.id === chat.id"
            @select="handleSelectChat"
          />
        </div>
      </div>

   <div :class="[
        'flex-col bg-slate-900',
        selectedChat ? 'flex absolute inset-0 min-[780px]:static min-[780px]:flex-1 z-10' : 'hidden min-[780px]:flex min-[780px]:flex-1'
      ]">
        <div v-if="selectedChat" class="flex items-center gap-3 p-4 border-b border-slate-700 bg-slate-800">
          <button @click="handleBack" class="min-[780px]:hidden text-white p-1">
            <OhVueIcon name="bi-arrow-left" scale="1.2" />
          </button>
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {{ selectedChat.name.charAt(0) }}
          </div>
          <p class="text-white font-semibold truncate">{{ selectedChat.name }}</p>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div v-if="selectedChat" class="flex justify-start">
            <div class="bg-slate-700 text-white text-sm px-4 py-2 rounded-2xl max-w-xs">
              {{ selectedChat.lastMessage }}
            </div>
          </div>
          <div v-else class="flex-1 flex items-center justify-center h-full">
            <p class="text-slate-500 text-sm">Selecciona un chat para comenzar</p>
          </div>
        </div>

        <InputMessage v-model="messageText" @send="handleSend" />
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import Layout from '@/components/Layout.vue';
import ChatPreview from '@/components/ChatPreview.vue';
import InputMessage from '@/components/InputMessage.vue';
import SearchResults from '@/components/SearchResults.vue';
import { useChatStore } from '@/stores/chatStore';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { BiArrowLeft } from 'oh-vue-icons/icons';

addIcons(BiArrowLeft)

const currentUser = ref({ name: 'Tu Nombre' })

const chatStore = useChatStore()
const { chats } = storeToRefs(chatStore)

const selectedChat = ref(null)
const showMobileChat = ref(false)
const messageText = ref('')
const searchQuery = ref('')

const filteredChats = computed(() => {
  if (!searchQuery.value) return chats.value
  return chats.value.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleSelectChat = (chat) => {
  selectedChat.value = chat
  showMobileChat.value = true
  chatStore.markAsRead(chat.id)
}

const handleBack = () => {
  showMobileChat.value = false
  selectedChat.value = null
}

const handleSend = () => {
  console.log('Enviando:', messageText.value)
  messageText.value = ''
}
</script>  





  -->
