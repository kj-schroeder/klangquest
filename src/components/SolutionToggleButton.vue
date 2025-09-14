<script setup>
import { ref } from 'vue';

defineProps({
  displaySolutions: Boolean
});
const emit = defineEmits(['toggle']);

const solutionBtn = ref(null);

function handleClick() {
  emit('toggle');
  // Fokus entfernen
  setTimeout(() => {
    solutionBtn.value?.blur();
  }, 0);
}
</script>

<template>
  <button
  id="showSolutionBtn"
  ref="solutionBtn"
  class="solutionToggleBtn rounded-pill btn"
  :class="{ active: displaySolutions }"
  @click="handleClick"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="32" height="32">
    <!-- Glühbirne -->
    <path
      class="bulb"
      d="M420.9 448C428.2 425.7 442.8 405.5 459.3 388.1C492 353.7 512 307.2 512 256C512 150 426 64 320 64C214 64 128 150 128 256C128 307.2 148 353.7 180.7 388.1C197.2 405.5 211.9 425.7 219.1 448H420.8zM416 496H224V512C224 556.2 259.8 592 304 592H336C380.2 592 416 556.2 416 512V496zM312 176C272.2 176 240 208.2 240 248C240 261.3 229.3 272 216 272C202.7 272 192 261.3 192 248C192 181.7 245.7 128 312 128C325.3 128 336 138.7 336 152C336 165.3 325.3 176 312 176z"
    />
    <!-- Strahlen -->
    <g class="light-rays">
      <line x1="552" y1="256" x2="612" y2="256" />
      <line x1="88" y1="256" x2="28" y2="256" />
      <line x1="540" y1="140" x2="590" y2="100" />
      <line x1="540" y1="372" x2="590" y2="412" />
      <line x1="100" y1="140" x2="50" y2="100" />
      <line x1="100" y1="372" x2="50" y2="412" />
    </g>
  </svg>
</button>
</template>