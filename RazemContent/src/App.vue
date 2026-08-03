<template>
  <SplashScreen v-if="loading"/>
  <RouterView v-else />
</template>


<script setup>
import {ref, onMounted } from 'vue';
import SplashScreen from '@/components/SplashScreen.vue';
import { RouterView } from 'vue-router'

const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
     loading.value = false
  }, 2500);
})
</script>

