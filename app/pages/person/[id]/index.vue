<script setup lang="ts">
import { useRoute } from '#app';
import { computed } from 'vue';

const route = useRoute();
const personId = computed(() => route.params.id);
</script>

<template>
  <div>Карточка человека: {{ personId }}</div>
</template>
