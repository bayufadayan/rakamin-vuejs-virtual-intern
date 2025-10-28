<script>
export default {
    name: "TodoList",
    props: ["todos"],
};
</script>

<template>
    <ul>
        <li v-for="(todo, index) in todos" :key="index" @click="$emit('toggle', index)" :class="{ done: todo.done }">

            <span v-if="!todo.editing">
                {{ todo.text }}
            </span>

            <input 
            v-else
            v-model="todo.text"
            @keyup.enter="$emit('doneEdit', index)"
            @blur="$emit('doneEdit', index)"
            type="text"

            />

            <button @click="$emit('startEdit', index)">✏️</button>
            <button @click="$emit('remove', index)">❌</button>
        </li>
    </ul>
</template>

<style>
.done {
    text-decoration: line-through;
    opacity: 0.6;
}
</style>