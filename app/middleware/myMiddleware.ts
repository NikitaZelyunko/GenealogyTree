import { abortNavigation, defineNuxtRouteMiddleware } from '#app';

export default defineNuxtRouteMiddleware((to) => {
  if (to.params.id === '2') {
    return abortNavigation();
  }
});
