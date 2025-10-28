<script>
import TodoList from './components/TodoList.vue';

export default {
  components: {
    TodoList,
  },
  data() {
    return {
      newTodo: "",
      todos: [],
    };
  },

  created() {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
    }
  },

  methods: {
    saveTodos() {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    },
    addTodo() {
      if (this.newTodo.trim() !== "") {
        this.todos.push({
          text: this.newTodo,
          done: false,
          editing: false,
        });
        this.newTodo = "";
      }
      this.saveTodos();
    },
    toggleDone(index) {
      this.todos[index].done = !this.todos[index].done;
      this.saveTodos();
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
      this.saveTodos();
    },
    startEdit(index) {
      this.todos[index].editing = true;
    },
    doneEdit(index) {
      this.todos[index].editing = false;
      this.saveTodos();
    }
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

    <TodoList 
      :todos="todos" 
      @remove="removeTodo" 
      @toggle="toggleDone"
      @startEdit="startEdit"
      @doneEdit="doneEdit"
    />
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
