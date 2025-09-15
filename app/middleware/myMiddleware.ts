import { abortNavigation, defineNuxtRouteMiddleware, navigateTo } from '#app';

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.params.id === '2') {
    return abortNavigation();
  }

//   if (to.path !== '/') {
//     return navigateTo('/');
//   }
});