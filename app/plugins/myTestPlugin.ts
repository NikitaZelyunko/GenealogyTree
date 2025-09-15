import { defineNuxtPlugin } from 'nuxt/app';

export default defineNuxtPlugin((nuxtApp) => {
  const myStore = { number: Math.random() };

  if (import.meta.server) {
    nuxtApp.hooks.hook('app:rendered', () => {
      nuxtApp.payload.myStoreState = myStore;
      console.log('ServerSide MyStoreState: ', nuxtApp.payload.myStoreState);
    });
  }

  if (import.meta.client) {
    nuxtApp.hooks.hook('app:created', () => {
      console.log('ClientSide MyStoreState:', nuxtApp.payload.myStoreState);
    });
  }
});
