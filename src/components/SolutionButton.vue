<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
    row: { type: Object, required: true },
    displaySolution: { type: Boolean, required: true }
});

const answerButtonClass = computed(() => {
    if (props.row.isCorrect) {
    return 'btn-success';
  } else if (props.displaySolution) {
    return 'btn-success btn-success-half border-success';
  } else {
    return 'btn-danger-half';
  }
});

const answerButtonText = computed(() => {
    if (props.row.isCorrect) return props.row.userAnswer;
  return props.displaySolution ? props.row.correctAnswer : props.row.userAnswer;
});
</script>

<template>
    <!-- Solution Button-->
    <button 
        type="button"
        :id="`chord2_${row.id}`" 
        class="btn solutionButton"
        :class="answerButtonClass"
        :data-row-id="`${row.id}`"
        >
        {{ 
            answerButtonText 
        }}
    </button>
</template>