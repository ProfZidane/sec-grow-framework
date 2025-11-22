<template>
  <div class="evaluator-selection">
    <div class="selection-header">
      <h2>Qui effectue cette évaluation ?</h2>
      <p>Diagnostic SEC-GROW - Semaine 3 du planning</p>
      <div class="koaloo-context">
        <span class="context-badge">KOALOO</span>
        <span class="context-badge">Fintech ESG</span>
        <span class="context-badge">👥 4 ops + 5 board</span>
      </div>
    </div>
    
    <div class="evaluator-grid">
      <button 
        v-for="role in evaluatorRoles" 
        :key="role.id"
        @click="selectEvaluator(role)"
        class="evaluator-card"
      >
        <!-- <div class="evaluator-emoji">{{ role.emoji }}</div> -->
        <h2>{{ role.name }}</h2>
        <p>{{ role.description }}</p>
        <div class="card-footer">
          <span class="select-text">Sélectionner →</span>
        </div>
      </button>
    </div>
    
    <div class="selection-info">
      <div class="info-box">
        <h4>Information importante</h4>
        <p>L'évaluation prend environ <strong>30 minutes</strong>. Vous pouvez la mettre en pause et reprendre plus tard.</p>
        <p>Pour un diagnostic optimal, nous recommandons que le <strong>CEO et le CTO</strong> fassent chacun leur évaluation.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { EVALUATOR_ROLES } from '@/data/questions'

const evaluatorRoles = EVALUATOR_ROLES;
const emit = defineEmits(['evaluator-selected']);

const selectEvaluator = (role) => emit('evaluator-selected', role);

</script>

<style scoped src="@/assets/components/evaluator-selector.css"></style>