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
});

const emit = defineEmits(['close', 'save']);

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
});

const closeModal = () => emit('close');

const saveSettings = () => emit('save', formData.value);

watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.assign(formData.value, newData)
  }
}, { immediate: true });

</script>

<style scoped src="@/assets/components/context-settings.css"></style>