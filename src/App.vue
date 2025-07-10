<template>
  <div id="app">
    <!-- Header -->
    <AppHeader 
      :selected-evaluator="selectedEvaluator"
      @reset-evaluator="resetEvaluator"
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
          :current-section="currentSection"
          :responses="responses"
          :sections="sections"
          @section-changed="currentSection = $event"
          @response-changed="handleResponseChange"
          @show-results="showResults = true"
          @reset-evaluator="resetEvaluator"
        />

        <!-- Résultats -->
        <ResultsDisplay
          v-else
          :selected-evaluator="selectedEvaluator"
          :responses="responses"
          :sections="sections"
          @restart="restart"
          @back-to-diagnostic="showResults = false"
        />

      </div>
    </main>
  </div>
</template>

<script>
import { SECTIONS } from '@/data/questions'
import AppHeader from '@/components/AppHeader.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import EvaluatorSelector from '@/components/EvaluatorSelector.vue'
import DiagnosticInterface from '@/components/DiagnosticInterface.vue'
import ResultsDisplay from '@/components/ResultsDisplay.vue'

export default {
  name: 'SecGrowApp',
  
  components: {
    AppHeader,
    ProgressBar,
    EvaluatorSelector,
    DiagnosticInterface,
    ResultsDisplay
  },
  
  data() {
    return {
      sections: SECTIONS,
      selectedEvaluator: null,
      currentSection: 0,
      responses: {},
      showResults: false,
      sessionId: null,
      startTime: null
    }
  },
  
  computed: {
    answeredQuestions() {
      return Object.keys(this.responses).length
    },
    
    totalQuestions() {
      return this.sections.reduce((total, section) => total + section.questions.length, 0)
    },
    
    progressPercent() {
      return (this.answeredQuestions / this.totalQuestions) * 100
    }
  },
  
  methods: {
    selectEvaluator(role) {
      this.selectedEvaluator = role
      this.sessionId = 'sec-grow-' + Date.now()
      this.startTime = new Date().toISOString()
      this.loadFromStorage()
    },
    
    resetEvaluator() {
      if (confirm('Êtes-vous sûr de vouloir changer d\'évaluateur ? Les données seront sauvegardées.')) {
        this.saveToStorage()
        this.selectedEvaluator = null
        this.showResults = false
      }
    },
    
    handleResponseChange(questionId, value) {
      this.responses[questionId] = value
      this.saveToStorage()
    },
    
    restart() {
      if (confirm('Êtes-vous sûr de vouloir recommencer complètement ?')) {
        this.selectedEvaluator = null
        this.currentSection = 0
        this.responses = {}
        this.showResults = false
        localStorage.removeItem('sec-grow-koaloo')
      }
    },
    
    saveToStorage() {
      const data = {
        selectedEvaluator: this.selectedEvaluator,
        currentSection: this.currentSection,
        responses: this.responses,
        sessionId: this.sessionId,
        startTime: this.startTime
      }
      localStorage.setItem('sec-grow-koaloo', JSON.stringify(data))
    },
    
    loadFromStorage() {
      const saved = localStorage.getItem('sec-grow-koaloo')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          this.responses = data.responses || {}
          this.currentSection = data.currentSection || 0
        } catch (error) {
          console.error('Erreur chargement:', error)
        }
      }
    }
  },
  
  mounted() {
    // Auto-chargement si session en cours
    const saved = localStorage.getItem('sec-grow-koaloo')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.selectedEvaluator) {
          this.selectedEvaluator = data.selectedEvaluator
          this.loadFromStorage()
        }
      } catch (error) {
        console.error('Erreur auto-chargement:', error)
      }
    }
  }
}
</script>

<style>
/* Variables CSS */
:root {
  --primary: #3B82F6;
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  --purple: #8B5CF6;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
}

/* Reset et base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--gray-900);
  background: var(--gray-50);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.main {
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .main {
    padding: 1rem 0;
  }
}
</style>