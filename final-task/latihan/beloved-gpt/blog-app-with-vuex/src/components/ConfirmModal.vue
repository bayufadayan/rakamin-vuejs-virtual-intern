<template>
    <div v-if="open" class="backdrop" @click.self="$emit('close')">
        <div class="modal card">
            <h3 class="title">Hapus postingan?</h3>
            <p class="msg">Aksi ini gak bisa di-undo.</p>
            <div class="actions">
                <button class="btn btn--danger" @click="$emit('confirm')">Hapus</button>
                <button class="btn btn--ghost" @click="$emit('close')">Batal</button>
            </div>
        </div>
    </div>
</template>

<script>
export default { props: { open: { type: Boolean, default: false } } };
</script>

<style scoped>
.backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: grid;
    place-items: center;
    z-index: 50;

    /* ini yang bikin blur di belakang doang */
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.modal {
    width: 100%;
    max-width: 420px;
    padding: 20px
}

.title {
    margin: 0 0 8px
}

.msg {
    color: var(--muted);
    margin: 0 0 16px
}

.actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end
}
</style>
