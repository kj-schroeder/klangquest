<script setup>
import { ref, watch, defineProps, computed, onMounted, onBeforeUnmount } from 'vue';
import { Modal } from 'bootstrap';
import { Piano } from '@/js/models/Piano';

const props = defineProps({
  show: { type: Boolean, default: false },
  row: { type: Object, default: null }
});

const emit = defineEmits(['close', 'select', 'closed']);

// Modal-Referenz & Bootstrap-Instanz
const modalRef = ref(null);
let modalInstance = null;

// Bootstrap Modal initialisieren, wenn das Element gerendert ist
onMounted(() => {
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value, { backdrop: 'static' });
    
    // Event Listener für vollständig geschlossenes Modal
    modalRef.value.addEventListener('hidden.bs.modal', () => {
      emit('closed');
    });

    if (props.show) modalInstance.show();
  }
});

// Modal-Instanz sauber entfernen, wenn Component zerstört wird
onBeforeUnmount(() => {
  if (modalInstance) modalInstance.dispose();
});

// Reagiere auf show-Prop-Änderung
watch(
  () => props.show,
  (newVal) => {
    if (modalInstance) {
      newVal ? modalInstance.show() : modalInstance.hide();
    }
  }
);

// Titel & aktuelle Note
const activeRowTitle = computed(() => props.row?.title || 'Keine Auswahl');
const selectedNoteForActiveRow = computed(() => props.row?.selectedNote || '');

function handleSelect(note) {
  modalInstance?.hide();
  emit('select', note);
}

function handleClose() {
  document.activeElement.blur();
  modalInstance?.hide();
  emit('close');

  // Fokus zurücksetzen
  const trigger = document.querySelector('#openSelectNoteButton'); // z.B. dein IconButton
  trigger?.focus();
}
</script>

<template>
  <!-- Modal -->
  <div class="modal fade modal-light modal-fullscreen-sm-down" id="selectNoteModal" tabindex="-1"
       aria-labelledby="selectNoteModalLabel" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header position-relative">
          <h2 class="modal-title text-center w-100" id="selectNoteModalTitle">
            {{ activeRowTitle }}
          </h2>
          <button @click="handleClose" type="button" class="btn-close position-absolute end-0 me-2" 
                  data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="selectNoteModalBody" class="modal-body d-grid gap-2">
          <button
            v-for="note in Piano.notes"
            :key="note"
            type="button"
            @click="handleSelect(note)"
            class="btn"
            :class="note === selectedNoteForActiveRow ? 'btn-secondary opacity-50' : 'btn-secondary'"
            :disabled="note === selectedNoteForActiveRow"
          >
            {{ note }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>