<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const personId = computed(() => route.params.id);
</script>

<template>
    <div>Карточка человека: {{ personId }}</div>
</template>
