<script setup>
import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue'

const movies = ref([
  "Inception",
  "Interstellar",
  "The Dark Knight"
])

const newMovie = ref("")
const editIndex = ref(null)
const editTitle = ref("")

function addMovie() {
  if (newMovie.value.trim() !== "") {
    movies.value.push(newMovie.value.trim())
    newMovie.value = "";
  }
}

function deleteMovie(index) {
  movies.value.splice(index, 1)
}

async function startEdit(index, currentTitle) {
  editIndex.value = index
  editTitle.value = currentTitle
}

function saveEdit(index) {
  if (editTitle.value.trim() !== "") {
    movies.value[index] = editTitle.value.trim()
    cancelEdit()
  }
}

function cancelEdit() {
  editIndex.value = null
  editTitle.value = ""
}
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_bFlank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <hr>
  </hr>

  <h2>Daftar Film Favorit</h2>
  <ul>
    <li v-for="(movie, i) in movies" :key="movie">

      <template v-if="editIndex === i">
        <input v-model="editTitle" @keyup.enter="saveEdit(i)" />
        <button @click="saveEdit(i)">Simpan</button>
        <button @click="cancelEdit">Batal</button>
      </template>

      <template v-else>
        {{ movie }}
        <div>
          <button @click="startEdit(i, movie)">Edit</button>
          <button @click="deleteMovie(i)">❌</button>
        </div>

      </template>
    </li>
  </ul>

  <input v-model="newMovie" placeholder="Tambah Film ..." @keyup.enter="addMovie" />
  <button @click="addMovie">Tambah</button>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

h2 {
  margin-bottom: 10px;
  color: #42b883;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 8px 0;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

button {
  margin-left: 6px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}

input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.input {
  margin-top: 12px;
}

button:nth-of-type(1) {
  background: #42b883;
  color: white;
}

button:nth-of-type(2) {
  background: #ff5555;
  color: white;
}
</style>
