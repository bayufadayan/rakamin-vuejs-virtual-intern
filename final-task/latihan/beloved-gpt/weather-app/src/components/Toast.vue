<script>
export default {
    name: "ToastMini",
    computed: {
        toast() {
            return this.$store.state.toast;
        },
        classes() {
            return [
                "toast",
                this.toast.type === "error" ? "toast--error" : "",
                this.toast.type === "success" ? "toast--success" : "",
                this.toast.type === "info" ? "toast--info" : ""
            ].join(" ");
        }
    }
};
</script>

<template>
    <transition name="toast-fade">
        <div v-if="toast.visible" :class="classes" role="status" aria-live="polite">
            {{ toast.message }}
        </div>
    </transition>
</template>
