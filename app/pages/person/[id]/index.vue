<script setup lang="ts">
import { useRoute } from '#app';
import { computed } from 'vue';
import PersonCard from '~/features/person/components/PersonCard.vue';

const route = useRoute();
const personId = computed(() => {
  const idParam = route.params.id;
  if (typeof idParam === 'string') {
    return parseInt(idParam);
  }
  return -1;
});
</script>

<template>
  <PersonCard :person-id="personId" />
</template>
