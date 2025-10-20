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

const contextStore = useContextStore();

defineEmits(['reset-evaluator', 'open-settings']);
</script>

<style scoped src="@/assets/components/app-header.css"></style>