<template>
    <div class="min-h-screen w-full flex flex-col bg-slate-800 text-white">
      <Navbar />

      <main class="flex-1">
        <slot />
       </main>

      <Footer />
    </div>
</template>

<script setup>
import Footer from '@/components/Footer.vue'
import Navbar from './Navbar.vue';

</script>