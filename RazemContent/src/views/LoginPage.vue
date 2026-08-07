<template>
   <Layout>
    <div class="flex items-center justify-center px-8 py-19 mt-10">
      <form @submit.prevent="handleSubmit" class="bg-slate-500 p-5 rounded-2xl shadow-2xl max-w-xs w-full border border-slate-600">
        <h1 class="text-xl font-bold text-blue-500 text-center mb-2">
          Login User
        </h1>

        <p class="text-slate-200 text-center mb-5 text-xs">
          Inciar sesión con tu cuenta
        </p>

        <p v-if="error" class="text-red-400 text-xs text-center mb-3">
          {{ error }}
        </p>
     

        <div class="mb-3">
          <label class="block text-slate-300 text-xs font-semibold mb-1">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="correo@ejemplo.com"
            class="w-full px-3 py-2 text-xs bg-slate-600 text-white placeholder-slate-400 rounded-lg border border-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div class="mb-4">
          <label class="block text-slate-300 text-xs font-semibold mb-1">
            Contraseña
          </label>
          <div class="relative">
            <input
             v-model="password"
             :type="showPassword ? 'text' : 'password'"
             placeholder="Tu contraseña"
             class="w-full px-3 py-2 text-xs bg-slate-600 text-white placeholder-slate-400 rounded-lg border border-slate-500 focus:outline-none focus:border-blue-500 pr-9"
             />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
              <OhVueIcon :name="showPassword ? 'fa-eye-slash' : 'fa-eye'" scale="1"/>
            </button> 
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-xl transition duration-300 shadow-lg"
          >
          {{ loading ? 'Ingresando...': 'Entrar' }}
         </button>

         <p class="text-center text-slate-300 text-xs mt-4">
           ¿No tienes cuenta?
           <RouterLink to="/register" class="text-blue-400 hover:text-blue-300 font-semibold">
            Registrate aquí
           </RouterLink>
         </p>
       </form>
     </div>
  </Layout>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

import Layout from '@/components/Layout.vue';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { FaEye, FaEyeSlash } from 'oh-vue-icons/icons';
import { useLogin } from '@/composables/useLogin';

addIcons(FaEye, FaEyeSlash)

const email = ref('');
const password = ref('')
const showPassword = ref(false)

const { login, loading, error } = useLogin();

const handleSubmit = async () => {
  try {
    await login(email.value, password.value)
  } catch (err) {
    console.error(err)
  }
}
</script>