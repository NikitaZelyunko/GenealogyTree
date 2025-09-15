<script setup lang="ts">
import { computed } from 'vue';
import HelloWorld from '../../../components/HelloWorld.vue';
import { useAsyncData, useLazyAsyncData, useRoute, useRuntimeConfig } from '#app';
import { definePageMeta } from '#imports';

definePageMeta({
    middleware: ['my-middleware'],
});

const {data, status} = await useAsyncData('load-status', () => {
    return new Promise<string>((resolve) => {
        setTimeout(() => {
            console.log('HELLO');
            resolve(`LOADED ${Math.random()}`);
        } , 3000);
    })
}, {lazy: true})

const route = useRoute();
const personId = computed(() => route.params.id);

const config = useRuntimeConfig();
console.log(config.nitro?.routeRules);
</script>

<template>
    {{ personId }}
    <div>
        STATUS: {{ data }} {{ status }}
        <!-- <template v-if="status ==='pending'">LOADING</template>
        <template v-else-if="status === 'error'">ERROR</template>
        <template v-else>{{ data }}</template> -->
    </div>
    <HelloWorld/>
</template>
