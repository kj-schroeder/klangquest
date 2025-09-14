<script setup>
import { defineProps } from 'vue';
import IconButton from './IconButton.vue';
import { Modal } from 'bootstrap';

const props = defineProps({
    challengeTitle: { type: String, required: true }
})

function openModal() {
  const modalEl = document.querySelector('#infoModal')
  if (modalEl) {
    const modal = new Modal(modalEl)
    modal.show()
  }
}
</script>

<template>
    <div id="header" class="text-center justify-content-between">
        <div id="logo-container">
            <img src="/images/logo-klangquest-sqare-kontur-thin.png" alt="">
        </div>
        <div class="d-none d-md-flex" id="headerTitle">
            <h1>{{ challengeTitle }}</h1>
        </div>
        <IconButton icon="fa-solid fa-info" @click="openModal" />
    </div>
</template>