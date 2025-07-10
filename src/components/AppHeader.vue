<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <span class="shield">🛡️</span>
          <div>
            <h1>SEC-GROW Diagnostic</h1>
            <p>KOALOO - Fintech ESG</p>
          </div>
        </div>
        
        <div class="evaluator-info" v-if="selectedEvaluator">
          <div class="evaluator">
            {{ selectedEvaluator.emoji }} {{ selectedEvaluator.name }}
          </div>
          <button @click="$emit('reset-evaluator')" class="change-evaluator">
            🔄 Changer
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    selectedEvaluator: {
      type: Object,
      default: null
    }
  },
  emits: ['reset-evaluator']
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, var(--primary), var(--purple));
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.shield {
  font-size: 2rem;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.logo p {
  opacity: 0.9;
  font-size: 0.9rem;
}

.evaluator-info {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.evaluator {
  font-size: 1.1rem;
  font-weight: 600;
}

.change-evaluator {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.change-evaluator:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .evaluator-info {
    align-items: center;
  }
}
</style>