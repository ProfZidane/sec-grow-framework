<template>
  <div id="diagnostic-app">

    <EvaluatorSelector
      v-if="!selectedEvaluator"
      :start-at-role="startAtRole"
      @evaluator-selected="selectEvaluator"
    />

    <DiagnosticInterface
      v-else-if="!showResults"
      :selected-evaluator="selectedEvaluator"
      :current-section="currentSection"
      :responses="responses"
      :sections="sections"
      @section-changed="handleSectionChange"
      @response-changed="handleResponseChange"
      @show-results="showResults = true"
      @reset-evaluator="resetEvaluator"
    />

    <ResultsDisplay
      v-else
      :selected-evaluator="selectedEvaluator"
      :responses="responses"
      :sections="sections"
      @restart="restart"
      @back-to-diagnostic="showResults = false"
    />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { SECTIONS } from '@/data/questions'
import EvaluatorSelector from '@/components/EvaluatorSelector.vue'
import DiagnosticInterface from '@/components/DiagnosticInterface.vue'
import ResultsDisplay from '@/components/ResultsDisplay.vue'

const sections = SECTIONS
const selectedEvaluator = ref(null)
const currentSection = ref(0)
const responses = ref({})
const showResults = ref(false)

const startAtRole = ref(false)

function selectEvaluator(role) {
  selectedEvaluator.value = role
  loadFromStorage()
  saveToStorage()
}

// Remet selectedEvaluator à null → EvaluatorSelector s'affiche automatiquement
function resetEvaluator() {
  saveToStorage()
  selectedEvaluator.value = null
  showResults.value = false
  currentSection.value = 0
  startAtRole.value = true
}

function restart() {
  selectedEvaluator.value = null
  currentSection.value = 0
  responses.value = {}
  showResults.value = false
  startAtRole.value = false
  localStorage.removeItem('sec-grow-diagnostic')
}

function handleSectionChange(idx) {
  currentSection.value = idx
}

function handleResponseChange(questionId, value) {
  responses.value[questionId] = value
  saveToStorage()
}

function saveToStorage() {
  localStorage.setItem('sec-grow-diagnostic', JSON.stringify({
    selectedEvaluator: selectedEvaluator.value,
    currentSection: currentSection.value,
    responses: responses.value
  }))
}

function loadFromStorage() {
  const saved = localStorage.getItem('sec-grow-diagnostic')
  if (!saved) return
  try {
    const data = JSON.parse(saved)
    responses.value = data.responses || {}
    currentSection.value = data.currentSection || 0
  } catch (e) {}
}

onMounted(() => {
  const saved = localStorage.getItem('sec-grow-diagnostic')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      if (data.selectedEvaluator) {
        selectedEvaluator.value = data.selectedEvaluator
        loadFromStorage()
      }
    } catch (e) {}
  }
})
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  background: #080c0a;
  color: #f0f2f0;
  line-height: 1.6;
}
#diagnostic-app { min-height: 100vh; }
</style>
