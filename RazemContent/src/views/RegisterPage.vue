<template>
   <Layout>
    <div class="flex items-center justify-center px-8 py-19 mt-10">
      <form class="bg-slate-500 p-5 rounded-2xl shadow-2xl max-w-xs w-full border border-slate-600">
        <h1 class="text-xl font-bold text-blue-500 text-center mb-2">
          Register User
        </h1>

        <p class="text-slate-200 text-center mb-5 text-xs">
          Crea tu cuenta nueva
        </p>

        <div class="mb-3">
          <label class="block text-slate-300 text-xs font-semibold mb-1">
            Nombre de usuario
          </label>
          <input
           type="text"
           placeholder="Tu nombre de usuario"
           class="w-full px-3 py-2 text-xs bg-slate-600 text-white placeholder-slate-400 rounded-lg border border-slate-500 focus:outline-none focus:border-blue-500"
           />
        </div>

        <div class="mb-3">
          <label  class="block text-slate-300 text-xs font-semibold mb-1">
            Email
          </label>
          <input
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
             :type="showPassword ? 'text' : 'password'"
             placeholder="Crear una contraseña"
             class="w-full px-3 py-2 text-xs bg-slate-600 text-white  placeholder-slate-400 rounded-lg border border-slate-500 focus:outline-none focus:border-blue-500"
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
        Crear cuenta
      </button>

      <p class="text-center text-slate-300 text-xs mt-4">
        ¿Ya tienes cuenta?
        <RouterLink to="/login" class="text-blue-400 hover:text-blue-300 font-semibold">
          Iniciar sesión aquí
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

addIcons(FaEye, FaEyeSlash)

const showPassword = ref(false)
</script>