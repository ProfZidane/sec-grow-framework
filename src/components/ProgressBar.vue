<template>
  <div class="progress-container">
    <div class="container">
      <div class="progress-info">
        <span>{{ answered }}/{{ total }} questions répondues</span>
        <span>{{ Math.round(progress) }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="progress-context">
        Phase préliminaire - Semaine 3 du planning SEC-GROW
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    answered: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    progress: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.progress-container {
  background: white;
  border-bottom: 1px solid var(--gray-200);
  padding: 1rem 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--gray-600);
  font-weight: 500;
}

.progress-bar {
  height: 8px;
  background: var(--gray-200);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--success), var(--primary));
  transition: width 0.3s ease;
}

.progress-context {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--gray-500);
  text-align: center;
}

@media (max-width: 768px) {
  .progress-info {
    font-size: 0.8rem;
  }
  
  .progress-context {
    font-size: 0.7rem;
  }
}
</style>