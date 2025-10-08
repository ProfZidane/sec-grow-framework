<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-dialog" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="material-icons">settings</i>
            Configuration du Contexte
          </h5>
          <button type="button" class="btn-close" @click="closeModal">
            <i class="material-icons">close</i>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveSettings">
            <!-- Informations Entreprise -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="material-icons">business</i>
                Informations Entreprise
              </h6>
              
              <div class="form-group">
                <label for="companyName">Nom de l'entreprise</label>
                <input 
                  type="text" 
                  id="companyName"
                  v-model="formData.companyName"
                  class="form-control"
                  placeholder="Ex: KOALOO"
                >
              </div>
              
              <div class="form-group">
                <label for="sector">Secteur d'activité</label>
                <select id="sector" v-model="formData.sector" class="form-control">
                  <option value="">Sélectionner un secteur</option>
                  <option value="fintech">Fintech</option>
                  <option value="esg">ESG/Sustainability</option>
                  <option value="saas">SaaS</option>
                  <option value="consulting">Conseil</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="mission">Mission/Objectif principal</label>
                <textarea 
                  id="mission"
                  v-model="formData.mission"
                  class="form-control"
                  rows="3"
                  placeholder="Ex: Améliorer le score ESG des entreprises corporates"
                ></textarea>
              </div>
            </div>

            <!-- Équipe -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="material-icons">group</i>
                Composition de l'équipe
              </h6>
              
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="teamSize">Taille de l'équipe opérationnelle</label>
                  <input 
                    type="number" 
                    id="teamSize"
                    v-model="formData.teamSize"
                    class="form-control"
                    min="1"
                    placeholder="Ex: 4"
                  >
                </div>
                
                <div class="form-group col-md-6">
                  <label for="boardSize">Nombre de membres du board</label>
                  <input 
                    type="number" 
                    id="boardSize"
                    v-model="formData.boardSize"
                    class="form-control"
                    min="0"
                    placeholder="Ex: 5"
                  >
                </div>
              </div>
              
              <div class="form-group">
                <label for="keyRoles">Rôles clés présents</label>
                <div class="checkbox-group">
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="formData.roles" value="ceo">
                    <span>CEO</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="formData.roles" value="cto">
                    <span>CTO</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="formData.roles" value="data-scientist">
                    <span>Data Scientist</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="formData.roles" value="security-officer">
                    <span>Security Officer</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Contexte Technique -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="material-icons">computer</i>
                Contexte Technique
              </h6>
              
              <div class="form-group">
                <label for="productType">Type de produit</label>
                <select id="productType" v-model="formData.productType" class="form-control">
                  <option value="">Sélectionner</option>
                  <option value="saas">SaaS Platform</option>
                  <option value="mobile-app">Application Mobile</option>
                  <option value="web-app">Application Web</option>
                  <option value="api">API/Service</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="mainFeatures">Fonctionnalités principales</label>
                <textarea 
                  id="mainFeatures"
                  v-model="formData.mainFeatures"
                  class="form-control"
                  rows="3"
                  placeholder="Ex: Tracking des KPIs ESG, Dashboard analytics, Reporting automatisé"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="dataTypes">Types de données traitées</label>
                <div class="checkbox-group">
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="formData.dataTypes" value="personal">
                    <span>Données personnelles</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="formData.dataTypes" value="financial">
                    <span>Données financières</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="formData.dataTypes" value="esg">
                    <span>Données ESG</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="formData.dataTypes" value="analytics">
                    <span>Analytics/Métriques</span>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Annuler
          </button>
          <button type="button" class="btn btn-primary" @click="saveSettings">
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'save'])

const formData = ref({
  companyName: '',
  sector: '',
  mission: '',
  teamSize: null,
  boardSize: null,
  roles: [],
  productType: '',
  mainFeatures: '',
  dataTypes: []
})

watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.assign(formData.value, newData)
  }
}, { immediate: true })

const closeModal = () => {
  emit('close')
}

const saveSettings = () => {
  emit('save', formData.value)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  animation: fadeIn 0.2s ease;
}

.modal-dialog {
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  animation: slideIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  background: var(--primary);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-800);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--gray-200);
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group.col-md-6 {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--gray-700);
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.checkbox-item:hover {
  background: var(--gray-50);
}

.checkbox-item input[type="checkbox"] {
  margin: 0;
}

.modal-footer {
  background: var(--gray-50);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary {
  background: var(--gray-200);
  color: var(--gray-700);
}

.btn-secondary:hover {
  background: var(--gray-300);
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .modal-dialog {
    width: 95%;
    margin: 1rem;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .checkbox-group {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}
</style>