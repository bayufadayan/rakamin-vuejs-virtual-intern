<script>
export default {
  data() {
    return {
      newTodo: "",
      todos: [],
    };
  },
  methods: {
    addTodo() {
      if (this.newTodo.trim() !== "") {
        this.todos.push({
          text: this.newTodo,
          done: false,
        });
        this.newTodo = "";
      }
    },
    toggleDone(index) {
      this.todos[index].done = !this.todos[index].done;
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
    },
  },
};
</script>

<template>
  <div id="app">
    <h1>Todo App</h1>

    <input
      v-model="newTodo"
      @keyup.enter="addTodo"
      placeholder="Tambah Todo Baru..."
    />

    <button @click="addTodo">Tambah</button>

    <ul>
      <li
        v-for="(todo, index) in todos"
        :key="index"
        @click="toggleDone(index)"
        :class="{ done: todo.done }"
      >
        {{ todo.text }}
        <button @click.stop="removeTodo(index)">❌</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
#app {
  width: 400px;
  margin: 50px auto;
  text-align: center;
  display: block;
}

.done {
  text-decoration: line-through;
  opacity: 0.6;
}

button {
  margin-left: 10px;
  cursor: pointer;
}
</style>
