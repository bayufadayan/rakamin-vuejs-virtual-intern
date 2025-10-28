<script>
export default {
  name: "AppRoot"
};
</script>

<template>
  <div id="app" style="padding:16px;">
    <nav style="display:flex; gap:10px; margin-bottom:12px;">
      <router-link to="/">Home</router-link>
      <router-link to="/favorites">Favorites</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style scoped></style>
