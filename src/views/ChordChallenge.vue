<script setup>
import { computed, onMounted } from 'vue';

// COMPOSABLES, MODELS, SERVICES
import { Piano } from '@/js/models/Piano';
import { useChallenge } from '@/composables/useChallenge';
import { useSelectNote } from '@/composables/useSelectNote';

// COMPONENTS
import SelectNoteButton from '@/components/SelectNoteButton.vue';
import SelectNoteModal from '@/components/SelectNoteModal.vue';
import SolutionButton from '@/components/SolutionButton.vue';
import PlayChordButton from '@/components/playChordButton.vue';
import IconButton from '@/components/IconButton.vue';
import SolutionToggleButton from '@/components/SolutionToggleButton.vue';
import ResultBox from '@/components/ResultBox.vue';
import SubmitButton from '@/components/SubmitButton.vue';

// VARIABLEN
const { challenge, showLoading, error, loadChallenge, evaluateChallenge } = useChallenge();
const { activeRow, hasActiveRow, openSelectModal, closeSelectModal, handleModalClosed, selectNoteForActiveRow } = useSelectNote();

// SUBMIT & AUSWERTUNG
const allValid = computed(() => {
  return challenge.value.rows.every(row => Piano.notes.includes(row.selectedNote));
});
const getResultRow = (id) => challenge.value.result?.rows.find(resultRow => resultRow.id === id)

// LÖSUNGEN ANZEIGEN
let displaySolutions = false;

const handleDisplaySolutions = () => {
  displaySolutions = displaySolutions ? false : true;
}

const handleLoadChallenge = () => {
  displaySolutions = false;
  loadChallenge(true);
}

onMounted(() => {
  if (!challenge.value) {
    loadChallenge();
  }
});

</script>

<template>
  <div id="challengeContainer" class="bg-light text-dark">
    <div v-if="showLoading">Lade Challenge...</div>

    <div v-else-if="error">{{ error }}</div>

    <div v-else>

      <!-- Übergeordnetes v-if für alle challenge-abhängigen Elemente -->
      <template v-if="challenge && challenge.rows">
        <form id="chordForm" @submit.prevent="evaluateChallenge">
          <table class="table table-primary table-hover">
            <thead>
              <tr>
                <th class="d-none d-md-table-cell align-middle" scope="col">Tonlage</th>

                <!-- Akkord 1 -->
                <th scope="col">
                  <div class="d-flex flex-column flex-md-row align-items-center justify-content-center">
                    <span class="me-md-3 mb-1 mb-md-0 text-center text-md-start">Akkord 1</span>
                    <PlayChordButton :chord="challenge.chord1.pitchedNotes" />
                  </div>
                </th>

                <!-- Akkord 2 -->
                <th scope="col">
                  <div class="d-flex flex-column flex-md-row align-items-center justify-content-center">
                    <span class="me-md-3 mb-1 mb-md-0 text-center text-md-start">Akkord 2</span>
                    <PlayChordButton :chord="challenge.chord2.pitchedNotes" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="row in challenge.rows" :key="row.id" :id="row.id" :data-title="row.title">
                <th scope="row" class="d-none d-md-table-cell align-middle">{{ row.title }}</th>

                <!-- Akkord 1 -->
                <td class="align-middle text-center">{{ row.chord1.slice(0, -1) }}</td>

                <!-- Akkord 2 -->
                <td v-if="!challenge.result" class="align-middle text-center">
                  <div class="d-flex justify-content-center align-items-center">
                    <SelectNoteButton :row="row" :label="row.selectedNote || ''" @open="openSelectModal(row)" />
                  </div>
                </td>

                <td v-else class="align-middle text-center">
                  <div class="d-flex justify-content-center align-items-center">
                    <SolutionButton :row="getResultRow(row.id)" :displaySolution="displaySolutions" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- MODAL -->
          <div>
            <SelectNoteModal :show="!!hasActiveRow" :row="activeRow" @close="closeSelectModal" @closed="handleModalClosed"
              @select="selectNoteForActiveRow" />
          </div>

          <!-- AUSWERTUNG UND LÖSUNGSANZEIGE -->
          <div class="container">
            <div class="row g-3 align-items-center">
              <div class="col">
                <div v-if="challenge.result">
                  <ResultBox :result="challenge.result" />
                </div>
              </div>

              <div class="col-2 text-center">

                <!-- Submit-Button -->
                <div v-if="!challenge.result" class="toggleBtnContainer">
                  <SubmitButton :disabled="!allValid" label="Ergebnis auswerten" />
                </div>

                <!-- Lösung Anzeige Button -->
                <div v-else-if="challenge.result" class="toggleBtnContainer">
                  <SolutionToggleButton :displaySolutions="displaySolutions" @toggle="handleDisplaySolutions" />
                </div>

              </div>

              <!-- LOAD NEW CHALLENGE BUTTON -->
              <div class="col-2 col-md-1">
                <div class="">
                  <IconButton icon="fa-solid fa-arrow-rotate-right" @click="handleLoadChallenge" />
                </div>
              </div>

            </div>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>