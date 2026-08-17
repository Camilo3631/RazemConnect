<template>
    <nav ref="navRef" class="bg-slate-700 shadow-md px-6 py-3 relative">
       <div class="flex items-center justify-between">
         <RouterLink to="/dashboard">
            <img src="/Logo.png" alt="RazemConnect" class="h-14 w-auto" />
         </RouterLink>

         <button
           @click.stop="toggleMenu"
           class="text-white focus:outline-none"
           aria-label="Toggle menu"
           >
           <OhVueIcon v-if="menuAbierto" name="bi-x-lg" scale="1"/>
           <OhVueIcon v-else name="co-hamburger-menu" scale="1"/>
        </button>
       </div>

       <div
         v-if="menuAbierto"
         class="absolute right-4 top-16 bg-slate-900 rounded-lg shadow-xl w-32 overflow-hidden z-50 flex flex-col"
         >
         <RouterLink
           to="/login"
           @click="menuAbierto = false"
           class="px-3 py-2 text-xs text-white hover:bg-slate-800 transition"
           >
            Iniciar sesión
        </RouterLink>
        <RouterLink
         to="/register"
         @click="menuAbierto = false"
         class="px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition border-t border-slate-700"
         >
          Crear cuenta
        </RouterLink>
      </div>
    </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { CoHamburgerMenu, BiXLg } from 'oh-vue-icons/icons';

addIcons(CoHamburgerMenu, BiXLg);

const menuAbierto = ref(false);
const navRef = ref(null);

const toggleMenu = () => {
  menuAbierto.value = !menuAbierto.value;
};

const handleClickOutside = (event) => {
  if (navRef.value && !navRef.value.contains(event.target)) {
    menuAbierto.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
}); 

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});


</script>
