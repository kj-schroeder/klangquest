<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  result: { type: Object, required: true }
});
</script>

<template>
    <div id="resultBox" class="">
      {{ `Ergebnis: ${result.score} von ${result.total} richtig` }}
    </div>

</template>