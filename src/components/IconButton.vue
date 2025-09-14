<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    icon: { type: String, required: true },
    btnClass: { type: String, default: 'btn btn-primary rounded-circle' }
});

const emit = defineEmits(['click']);

const handleClick = (event) => {
  emit('click', event);
};
</script>

<template>
    <button 
        @click="handleClick" 
        type="button"
        class="iconButton"
        :class="btnClass">
        <i :class="icon"></i>
    </button>
</template>