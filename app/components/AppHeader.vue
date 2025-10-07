<script setup lang="ts">
import Button from '~/volt/Button.vue';
</script>

<template>
  <header class="fixed top-0 h-12 w-full shadow">
    <nav class="bg flex h-full items-center justify-between">
      <NuxtLink class="header-link" to="/person/add">
        Добавить человека
      </NuxtLink>

      <!-- <IconField pt:root="pl-2 pr-2">
        <InputIcon class="app-i app-i-search" />
        <InputText placeholder="Search" />
      </IconField> -->

      <Button
        class="my-button"
        label="Check"
        icon="app-i app-i-check"
        :loading="false"
      ></Button>
    </nav>
  </header>
</template>
