<template>
  <Layout>
    <div class="flex items-center justify-center px-8 py-19 mt-10">
      <div
        class="bg-slate-500 p-5 rounded-2xl shadow-2xl max-w-xs w-full border border-slate-600"
      >
        <h1 class="text-xl font-bold text-blue-500 text-center mb-2">
          Mi Perfil
        </h1>

        <p class="text-slate-200 text-center mb-5 text-xs">
          Información de tu cuenta
        </p>

        <div class="mb-4">
          <p class="text-slate-300 text-xs font-semibold mb-1">
            Nombre
          </p>

          <div
            class="flex items-center justify-between w-full px-3 py-2 text-xs bg-slate-600 text-white rounded-lg border border-slate-500"
          >
            <div class="flex items-center gap-2 flex-1">
              <span v-if="!editingName">
                {{ currentUser.name }}
              </span>

              <input
                v-else
                v-model="editedName"
                type="text"
                class="w-full bg-slate-700 text-white rounded-lg px-2 py-1 outline-none border border-slate-500 focus:border-blue-400"
                @blur="saveName"
              />
            </div>

            <button
              v-if="!editingName"
              type="button"
              @click="editName"
              class="text-blue-400 hover:text-blue-300 transition ml-2"
            >
              <OhVueIcon name="fa-edit" />
            </button>
          </div>
        </div>

        <div class="mb-4">
          <p class="text-slate-300 text-xs font-semibold mb-1">
            Email
          </p>

          <div
            class="w-full px-3 py-2 text-xs bg-slate-600 text-white rounded-lg border border-slate-500"
          >
            {{ currentUser.email }}
          </div>
        </div>

        <button
          type="button"
          @click="deleteAccount"
          class="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 rounded-xl transition duration-300 shadow-lg mt-3"
        >
          Eliminar cuenta
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from '@/components/Layout.vue'
import { useProfile } from '@/composables/useProfile'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { FaEdit } from 'oh-vue-icons/icons'

addIcons(FaEdit)

const {
  currentUser,
  editingName,
  editedName,
  editName,
  saveName,
  deleteAccount
} = useProfile()
</script>