<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    label: { type: String, default: '' },
    row: { type: Object, required: true }
});

const emit = defineEmits(['open']);

const open = () => {
    emit('open', props.row);
};
</script>

<template>
    <!-- Button trigger modal -->
    <button 
        @click="open"
        type="button" 
        :id="`chord2_${row.id}`" 
        class="btn selectNoteButton"
        :class="label === '' ? 'btn-custom-yellow' : 'btn-secondary'"
        :data-row-id="`${row.id}`"
        :data-correct="`${row.chord2.slice(0, -1)}`">
        <span v-if="label">
            {{ label }}
        </span>
        <i v-else class="fa-solid fa-question"></i>
    </button>
</template>