<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    disabled: { type: Boolean, required: true },
    label: { type: String, required: true }
});
</script>

<template>
    <button 
        type="submit" 
        class="btn btn-primary rounded-circle iconButton" 
        :disabled="disabled">
        <i class="fa-solid fa-check"></i>
    </button>
</template>