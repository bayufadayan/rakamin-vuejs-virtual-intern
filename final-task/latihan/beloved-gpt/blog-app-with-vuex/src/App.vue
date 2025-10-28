<template>
  <div id="app" class="container">
    <nav class="nav card">
      <router-link to="/">Home</router-link>
      <router-link to="/add">Add</router-link>
      <router-link to="/drafts">Drafts</router-link>
    </nav>

    <main style="margin-top:16px;">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
/* tambahan lokal kalau perlu */
</style>
