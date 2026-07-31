<template>
  <SplashScreen v-if="loading"/>
  <router-view v-else/>
</template>


<script setup>
import {ref, onMounted } from 'vue';
import SplashScreen from '@/components/SplashScreen.vue';

const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
     loading.value = false
  }, 2500);
})
</script>

