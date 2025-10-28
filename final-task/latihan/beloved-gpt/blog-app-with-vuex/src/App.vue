<template>
  <div id="app">
    <h1>Blog App</h1>
    <PostList />
  </div>
</template>

<script>
import PostList from './components/PostList.vue';

export default {
  components: {
    PostList,
  },
};
</script>

<style scoped></style>
