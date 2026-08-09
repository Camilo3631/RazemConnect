<template>
   <footer class="bg-slate-700 border-slate-700 py-3 px-6">
    <div class="max-w-4xl mx-auto flex flex-col items-center gap-3">

        <div class="flex items-center gap-6">
           <a 
            href="#"
            class="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110"
            aria-label="X"
            >
            <OhVueIcon name="bi-x-lg" scale="1.2" />
          </a>

          <a 
            href="#"
            class="text-slate-400 hover:text-pink-500 transition-all duration-300 hover:scale-110"
            aria-label="Instagram"
            >
            <OhVueIcon name="bi-instagram" scale="1.2" />
          </a>
        </div>

        <p class="text-sm text-slate-400">
          © 2026 RazemContent
        </p>

    </div>
  </footer>
</template>


<script setup>
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { BiXLg, BiInstagram } from 'oh-vue-icons/icons';

addIcons(BiXLg, BiInstagram);
</script>



