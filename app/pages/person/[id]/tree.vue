<script setup lang="ts">
import { computed } from 'vue';
import HelloWorld from '../../../components/HelloWorld.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const personId = computed(() => route.params.id);
</script>

<template>
    {{ personId }}
    <HelloWorld/>
</template>
