<script>
export default {
  name: "AppRoot"
};
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/" exact-active-class="active">Home</router-link>
      <router-link to="/favorites" exact-active-class="active">Favorites</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style scoped></style>
