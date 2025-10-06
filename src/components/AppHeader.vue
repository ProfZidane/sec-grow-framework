<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <!-- <span class="shield">🛡️</span> -->
          <div>
            <h1>SEC-GROW Diagnostic</h1>
            <p>{{ contextStore.companyFullName }}</p>
          </div>
        </div>
        
        <div class="header-actions">
          <button @click="$emit('open-settings')" class="settings-btn">
            <i class="material-icons">settings</i>
          </button>
          
          <div class="evaluator-info" v-if="selectedEvaluator">
            <div class="evaluator">
              {{ selectedEvaluator.name }}
            </div>
            <button @click="$emit('reset-evaluator')" class="change-evaluator">
              Changer
            </button>
          </div>
        </div>        
      </div>
    </div>
  </header>
</template>

<script setup>
import { useContextStore } from '@/stores/context'

const props = defineProps({
  selectedEvaluator: {
    type: Object,
    default: null
  }
})

const contextStore = useContextStore()

defineEmits(['reset-evaluator', 'open-settings'])
</script>

<style scoped>
.header {
  background: oklch(60% 0.118 184.704);
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.settings-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.evaluator-info {
  text-align: center;
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
  
  .header-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .evaluator-info {
    align-items: center;
  }
}
</style>