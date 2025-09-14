<script setup>
import { defineProps } from 'vue';
import { useAudioPlayer } from '@/composables/useAudioPlayer.js';

const { playChord, stopChord, isPlaying } = useAudioPlayer();

const props = defineProps({
    chord: { type: Array, required: true }
});

</script>

<template>
    <button 
        type="button" 
        @click="!isPlaying ? playChord(props.chord) : stopChord()"
        class="play btn btn-primary">
        <i v-if="!isPlaying" class="fa-solid fa-play"></i>
        <i v-else class="fa-solid fa-stop"></i>
    </button>
</template>