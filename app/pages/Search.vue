<script setup lang="ts">
  const Data = Math.random();
</script>

<template>
  <div>
    HELLO SEARCH
    <search v-if="Data > 0.5">
      <form action="./search/">
        <label for="movie">Find a Movie</label>
        <input type="search" id="movie" name="q" />
        <button type="submit">Search</button>
      </form>
    </search>
  </div>
  <input type="search" />
</template>
