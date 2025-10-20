<template>
  <div class="diagnostic-interface">
    
    <!-- Navigation des sections -->
    <div class="sections-nav">
      <div class="nav-header">
        <h3>Sections</h3>
        <button @click="$emit('reset-evaluator')" class="change-evaluator-btn">
          Changer d'évaluateur
        </button>
      </div>
      
      <div class="sections-list">
        <button
          v-for="(section, index) in sections"
          :key="section.id"
          @click="$emit('section-changed', index)"
          :class="['section-btn', { active: currentSection === index }]"
        >
          <!-- <span class="section-icon">{{ section.icon }}</span> -->
          <div class="section-info">
            <div class="section-title">{{ section.title }}</div>
            <div class="section-score">{{ getSectionScore(index) }}/20</div>
            <div class="section-maturity" :style="{ color: getSectionMaturity(index).color }">
              {{ getSectionMaturity(index).name }}
            </div>
          </div>
          <div class="section-progress">
            <div class="progress-circle">
              <div 
                class="progress-fill" 
                :style="{ 
                  strokeDasharray: `${getSectionProgress(index)}, 100`,
                  stroke: getSectionMaturity(index).color 
                }"
              ></div>
            </div>
          </div>
        </button>
      </div>

      <!-- Contexte dynamique -->
      <div class="koaloo-context">
        <h4>Contexte {{ contextStore.companyName }}</h4>
        <div class="context-details">
          <div><strong>Secteur:</strong> {{ contextStore.sector }}</div>
          <div><strong>Mission:</strong> {{ contextStore.mission }}</div>
          <div><strong>Équipe:</strong> {{ contextStore.teamDescription }}</div>
          <div><strong>Produit:</strong> {{ contextStore.productType }}</div>
        </div>
      </div>
    </div>

    <!-- Questions de la section courante -->
    <div class="questions-container">
      <div class="section-header">
        <h2>
          {{ sections[currentSection].title }}
        </h2>
        <div class="section-meta">
          <span class="section-number">Section {{ currentSection + 1 }}/4</span>
          <span class="questions-count">
            {{ getSectionAnswered(currentSection) }}/5 répondues
          </span>
        </div>
      </div>
      
      <div class="questions">
        <div 
          v-for="(question, qIndex) in sections[currentSection].questions" 
          :key="question.id"
          class="question-card"
        >
          <div class="question-number">{{ qIndex + 1 }}</div>
          <div class="question-content">
            <h3>{{ question.text }}</h3>
            <div class="question-help">
              <i class="material-icons text-light" style="transform: translateY(4px); font-size: 1.1rem;">info</i> 
              {{ question.help }}
            </div>
            
            <div class="options">
              <label 
                v-for="(option, optionIndex) in question.options" 
                :key="optionIndex"
                class="option"
                :class="{ selected: responses[question.id] === optionIndex }"
              >
                <input 
                  type="radio" 
                  :name="question.id"
                  :value="optionIndex"
                  :checked="responses[question.id] === optionIndex"
                  @change="handleResponseChange(question.id, optionIndex)"
                >
                <div class="option-content">
                  <span class="option-text">{{ option }}</span>
                  <div class="option-meta">
                    <span class="option-points">{{ optionIndex }} pts</span>
                    <span class="maturity-level">{{ getMaturityLabel(optionIndex) }}</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation sections -->
      <div class="section-navigation">
        <button 
          @click="previousSection" 
          :disabled="currentSection === 0"
          class="nav-btn secondary"
        >
          ← Section précédente
        </button>
        
        <div class="nav-center">
          <span class="completion-status">
            {{ getTotalAnswered() }}/20 questions répondues
          </span>
        </div>
        
        <button 
          v-if="currentSection < sections.length - 1"
          @click="nextSection"
          class="nav-btn primary"
        >
          Section suivante →
        </button>
        
        <button 
          v-else
          @click="$emit('show-results')"
          :disabled="!isComplete"
          class="nav-btn success"
          :class="{ pulse: isComplete }"
        >
          Voir les résultats
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MATURITY_LEVELS } from '@/data/questions'
import { useContextStore } from '@/stores/context'
import { computed } from 'vue'

const props = defineProps({
    selectedEvaluator: {
      type: Object,
      required: true
    },
    currentSection: {
      type: Number,
      required: true
    },
    responses: {
      type: Object,
      required: true
    },
    sections: {
      type: Array,
      required: true
    }
});

const $emit = defineEmits(['section-changed', 'response-changed', 'show-results', 'reset-evaluator']);

const maturityLevels = MATURITY_LEVELS;
const contextStore = useContextStore();

const isComplete = computed(() => getTotalAnswered() === 20);

const handleResponseChange = (questionId, value) => $emit('response-changed', questionId, value);

const getSectionScore = (sectionIndex) => {
  const section = props.sections[sectionIndex]
  let score = 0
  section.questions.forEach(question => {
  if (props.responses[question.id] !== undefined) {
      score += props.responses[question.id]
    }
  })
  return score;
}

const getSectionMaturity = (sectionIndex) => {
  const score = getSectionScore(sectionIndex)
  if (score <= 4) return maturityLevels[0]
  if (score <= 9) return maturityLevels[1]
  if (score <= 14) return maturityLevels[2]
  if (score <= 17) return maturityLevels[3]
  return maturityLevels[4]
}

const getSectionProgress = (sectionIndex) => {
  const section = props.sections[sectionIndex];
  const answered = section.questions.filter(q => props.responses[q.id] !== undefined).length;
  return Math.round((answered / section.questions.length) * 100);
}

const getSectionAnswered = (sectionIndex) => {
  const section = props.sections[sectionIndex];
  return section.questions.filter(q => props.responses[q.id] !== undefined).length
}

const getTotalAnswered = () => Object.keys(props.responses).length;

    
const getMaturityLabel = (optionIndex) => {
  const labels = ['Ad Hoc', 'Bronze', 'Silver', 'Gold', 'Platinum']
  return labels[optionIndex] || 'N/A'
}

const nextSection = () => {
    if (props.currentSection < props.sections.length - 1) $emit('section-changed', props.currentSection + 1);
}

const previousSection = () => {
  if (props.currentSection > 0) $emit('section-changed', props.currentSection - 1);
}

</script>

<style scoped src="@/assets/components/diagnostic-interface.css"></style>