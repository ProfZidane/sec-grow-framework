<template>
  <div id="app">
    <!-- Header -->
    <AppHeader 
      :selected-evaluator="selectedEvaluator"
      @reset-evaluator="resetEvaluator"
      @open-settings="showSettingsModal = true"
    />

    <!-- Progress Bar -->
    <ProgressBar 
      v-if="selectedEvaluator"
      :answered="answeredQuestions"
      :total="totalQuestions"
      :progress="progressPercent"
    />

    <main class="main">
      <div class="container">
        
        <!-- Sélection de l'évaluateur -->
        <EvaluatorSelector 
          v-if="!selectedEvaluator"
          @evaluator-selected="selectEvaluator"
        />

        <!-- Interface de diagnostic -->
        <DiagnosticInterface
          v-else-if="!showResults"
          :selected-evaluator="selectedEvaluator"
          :currentSection="currentSection"
          :responses="responses"
          :sections="sections"
          @section-changed="currentSection = $event"
          @response-changed="handleResponseChange"
          @show-results="handleShowResults"
          @reset-evaluator="resetEvaluator"
        />

        <!-- Résultats -->
        <ResultsDisplay
          v-else
          :selected-evaluator="selectedEvaluator"
          :responses="responses"
          :sections="sections"
          :llm-results="llmResults"
          :llm-loading="llmLoading"
          @restart="restart"
          @back-to-diagnostic="showResults = false"
        />

      </div>
    </main>

    <!-- Modal de configuration -->
    <ContextSettingsModal
      :show="showSettingsModal"
      :initial-data="contextStore"
      @close="showSettingsModal = false"
      @save="saveContextSettings"
    />
  </div>
</template>

<script setup>
  import { SECTIONS } from '@/data/questions'
  import AppHeader from '@/components/AppHeader.vue'
  import ProgressBar from '@/components/ProgressBar.vue'
  import EvaluatorSelector from '@/components/EvaluatorSelector.vue'
  import DiagnosticInterface from '@/components/DiagnosticInterface.vue'
  import ResultsDisplay from '@/components/ResultsDisplay.vue'
  import ContextSettingsModal from '@/components/ContextSettingsModal.vue'
  import { useContextStore } from '@/stores/context'
  import { generateFullAnalysis } from '@/services/llmService'
  import { computed, onMounted, ref, watch, nextTick } from 'vue'

  const sections = SECTIONS;
  const selectedEvaluator = ref(null);
  const currentSection = ref(0)
  const responses = ref({})
  const showResults = ref(false)
  const sessionId = ref(null)
  const startTime = ref(null)
  const showSettingsModal = ref(false)
  const contextStore = useContextStore()
  const llmResults = ref(null)
  const llmLoading = ref(false)


  const answeredQuestions = computed(() => {
    return Object.keys(responses.value).length
  });
    
  const totalQuestions = computed(() => {
    return sections.reduce((total, section) => total + section.questions.length, 0)
  })
    
  const progressPercent = computed(() => {
    return (answeredQuestions.value / totalQuestions.value) * 100
  });

  const selectEvaluator = (role) => {
    selectedEvaluator.value = role
    sessionId.value = 'sec-grow-' + Date.now()
    startTime.value = new Date().toISOString()
    loadFromStorage()
  }

  const resetEvaluator = () => {
    if (confirm('Êtes-vous sûr de vouloir changer d\'évaluateur ? Les données seront sauvegardées.')) {
      saveToStorage()
      selectedEvaluator.value = null
      showResults.value = false
    }
  }
    
  const handleResponseChange = (questionId, value) => {
    responses.value[questionId] = value
    saveToStorage()
  }

  const restart = () => {
    if (confirm('Êtes-vous sûr de vouloir recommencer complètement ?')) {
      selectedEvaluator.value = null
      currentSection.value = 0
      responses.value = {}
      showResults.value = false
      localStorage.removeItem('sec-grow-koaloo')
    }
  }

  const saveToStorage = () => {
    const data = {
      selectedEvaluator: selectedEvaluator.value,
      currentSection: currentSection.value,
      responses: responses.value,
      sessionId: sessionId.value,
      startTime: startTime.value
    }
    localStorage.setItem('sec-grow-koaloo', JSON.stringify(data))
  }

  const loadFromStorage = () => {
    const saved = localStorage.getItem('sec-grow-koaloo')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        responses.value = data.responses || {}
        currentSection.value = data.currentSection || 0
      } catch (error) {
        console.error('Erreur chargement:', error)
      }
    }
  }

  const saveContextSettings = (newContextData) => {
    contextStore.updateContext(newContextData);
    showSettingsModal.value = false;
  }

  const handleShowResults = async () => {
    console.log('=== DIAGNOSTIC TERMINÉ ===');
    
    const diagnosticData = {
      responses: responses.value,
      context: {
        companyName: contextStore.companyName,
        sector: contextStore.sector,
        mission: contextStore.mission,
        teamSize: contextStore.teamSize,
        boardSize: contextStore.boardSize,
        roles: contextStore.roles,
        productType: contextStore.productType,
        mainFeatures: contextStore.mainFeatures,
        dataTypes: contextStore.dataTypes
      },
      evaluator: selectedEvaluator.value,
      sections: sections
    };
    
    // console.log('Données diagnostic:', diagnosticData);
    
    // Afficher les résultats immédiatement
    showResults.value = true;
    
    // Générer l'analyse LLM en arrière-plan
    llmLoading.value = true;
    try {
      console.log('Génération analyse LLM...');
      llmResults.value = await generateFullAnalysis(diagnosticData);
      console.log('Analyse LLM terminée:', llmResults.value);
    } catch (error) {
      console.error('Erreur analyse LLM:', error);
      llmResults.value = { errors: [error.message] };
    } finally {
      llmLoading.value = false;
    }
  }

  // Watcher pour scroll automatique lors des changements de vue
  watch([selectedEvaluator, showResults, currentSection], () => {
    nextTick(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  })

  onMounted(() => {
    // Auto-chargement si session en cours
    const saved = localStorage.getItem('sec-grow-koaloo')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.selectedEvaluator) {
          selectedEvaluator.value = data.selectedEvaluator
          loadFromStorage()
        }
      } catch (error) {
        console.error('Erreur auto-chargement:', error)
      }
    }
    
    // Charger le contexte sauvegardé
    contextStore.loadFromStorage()
  });

</script>

<style></style>