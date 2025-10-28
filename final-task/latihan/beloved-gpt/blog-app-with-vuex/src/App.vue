<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/add">Add</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>

</script>

<style scoped>
nav {
  display: flex;
  gap: 10px;
}
</style>
