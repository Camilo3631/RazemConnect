<template>
  <Layout :show-footer="false">
    <div class="flex h-[calc(100vh-72px)] bg-slate-900 relative overflow-hidden">

      <div
        :class="[
          'border-r border-slate-700 flex-col bg-slate-800',
          selectedChat
            ? 'hidden min-[780px]:flex min-[780px]:w-80'
            : 'flex w-full min-[780px]:w-80 h-full'
        ]"
      >
        <div class="flex items-center justify-between border-b border-slate-700 flex-shrink-0">
          <RouterLink
            to="/profile"
            class="flex items-center gap-3 p-4 hover:bg-slate-700 transition cursor-pointer flex-1"
          >
            <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {{ currentUser.name ? currentUser.name.charAt(0) : '...' }}
            </div>

            <p class="text-white text-sm font-semibold truncate">
              {{ currentUser.name }}
            </p>
          </RouterLink>

          <button
            @click="showAddContact = true"
            class="text-white p-2 mr-2 hover:bg-slate-700 rounded-full transition"
          >
            <OhVueIcon name="bi-plus-lg" scale="1.2" />
          </button>
        </div>

        <SearchResults v-model="searchQuery" />

        <div class="flex-1 overflow-y-auto">
          <ChatPreview
            v-for="chat in filteredChats"
            :key="chat.id"
            :chat="chat"
            :is-selected="selectedChat?.id === chat.id"
            @select="handleSelectChat"
            @delete="handleDeleteChat"
            @clear="handleClearChat"
          />

          <p
            v-if="filteredChats.length === 0"
            class="text-slate-500 text-sm text-center py-6 px-4"
          >
            Aún no tienes contactos. Usa el botón "+" para agregar uno
          </p>
        </div>
      </div>

      <div
        :class="[
          'flex-col bg-slate-900',
          selectedChat
            ? 'flex absolute inset-0 min-[780px]:static min-[780px]:flex-1 z-10'
            : 'hidden min-[780px]:flex min-[780px]:flex-1'
        ]"
      >
        <div
          v-if="selectedChat"
          class="flex items-center gap-3 p-4 border-b border-slate-700 bg-slate-800"
        >
          <button
            @click="handleBack"
            class="min-[780px]:hidden text-white p-1"
          >
            <OhVueIcon name="bi-arrow-left" scale="1.2" />
          </button>

          <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {{ selectedChat.name.charAt(0) }}
          </div>

          <p class="text-white text-sm font-semibold truncate">
            {{ selectedChat.name }}
          </p>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <template v-if="selectedChat">
            <MessageBubble
              v-for="msg in messages"
              :key="msg._id"
              :message="msg"
              :is-own="msg.senderId === currentUser.id"
            />

            <p
              v-if="messages.length === 0"
              class="text-slate-500 text-sm text-center"
            >
              Aún no hay mensajes. ¡Envía el primero!
            </p>
          </template>

          <div
            v-else
            class="flex-1 flex items-center justify-center h-full"
          >
            <p class="text-slate-500 text-sm">
              Selecciona un chat para comenzar
            </p>
          </div>
        </div>

        <InputMessage
          v-model="messageText"
          @send="handleSend"
        />
      </div>
    </div>

    <div
      v-if="showAddContact"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      @click.self="showAddContact = false"
    >
      <div class="bg-slate-800 rounded-2xl p-5 w-full max-w-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-white font-semibold text-lg">
            Agregar contacto
          </h2>

          <button
            @click="showAddContact = false"
            class="text-slate-400 hover:text-white"
          >
            <OhVueIcon name="bi-x-lg" scale="1.1" />
          </button>
        </div>

        <input
          v-model="userSearchQuery"
          @input="handleSearchUsers"
          type="text"
          placeholder="Buscar por nombre o email..."
          class="w-full px-3 py-2 text-sm bg-slate-700 text-white placeholder-slate-400 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 mb-3"
        />

        <div class="max-h-64 overflow-y-auto space-y-2">
          <div
            v-for="user in filteredUsers"
            :key="user._id"
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700 transition"
          >
            <div class="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {{ user.username.charAt(0) }}
            </div>

            <p class="text-white text-sm flex-1 truncate">
              {{ user.username }}
            </p>

            <button
              @click="handleAddContact(user._id)"
              class="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-full transition"
            >
              Agregar
            </button>
          </div>

          <p
            v-if="filteredUsers.length === 0"
            class="text-slate-500 text-sm text-center py-4"
          >
            Escribe para buscar usuarios
          </p>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import Layout from '@/components/Layout.vue'
import ChatPreview from '@/components/ChatPreview.vue'
import InputMessage from '@/components/InputMessage.vue'
import SearchResults from '@/components/SearchResults.vue'
import MessageBubble from '@/components/MessageBubble.vue'
import { useDashboard } from '@/composables/useDashboard'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  BiArrowLeft,
  BiPlusLg,
  BiXLg
} from 'oh-vue-icons/icons'

addIcons(
  BiArrowLeft,
  BiPlusLg,
  BiXLg
)

const {
  currentUser,
  selectedChat,
  messageText,
  searchQuery,
  showAddContact,
  userSearchQuery,
  filteredUsers,
  filteredChats,
  messages,
  handleSelectChat,
  handleBack,
  handleSend,
  handleSearchUsers,
  handleAddContact,
  handleDeleteChat,
  handleClearChat
} = useDashboard()
</script>