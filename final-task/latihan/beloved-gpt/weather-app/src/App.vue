<script>
import Toast from "./components/Toast.vue";
export default {
  name: "AppRoot",
  components: { Toast }
};
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/" exact-active-class="active" class="nav-item">
        <font-awesome-icon icon="home" class="nav-icon" />
        <span>Home</span>
      </router-link>

      <router-link to="/favorites" exact-active-class="active" class="nav-item">
        <font-awesome-icon icon="star" class="nav-icon" />
        <span>Favorites</span>
      </router-link>
    </nav>
    <router-view />
    <Toast />
  </div>
</template>

<style scoped></style>
