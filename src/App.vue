<script setup>
import Header from './components/Header.vue';
import ChordChallenge from './views/ChordChallenge.vue';
import InfoModal from './components/InfoModal.vue';
</script>

<template>

  <body class="bg-light text-dark">
    <div id="wrapper" class="container py-2 py-md-4">
      <Header challengeTitle="AkkordChallenge" />
      <ChordChallenge />
      <InfoModal />
    </div>
  </body>

</template>

<style scoped></style>
