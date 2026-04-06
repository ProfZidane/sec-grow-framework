<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-box">

      <div class="modal-head">
        <div>
          <span class="modal-tag">[ PARAMÈTRES ]</span>
          <h2>Configuration du contexte</h2>
        </div>
        <button class="modal-close-btn" @click="emit('close')">
          <X :size="18" />
        </button>
      </div>

      <div class="modal-body">

        <!-- Entreprise -->
        <div class="form-section">
          <div class="section-label">
            <Building2 :size="14" /> Entreprise
          </div>

          <div class="field">
            <label>Nom de l'entreprise</label>
            <input v-model="form.companyName" type="text" placeholder="Ex: KOALOO" class="field-input" />
          </div>

          <div class="field-row">
            <div class="field">
              <label>Secteur d'activité</label>
              <select v-model="form.sector" class="field-input">
                <option value="">Sélectionner...</option>
                <option v-for="s in SECTORS" :key="s.id" :value="s.id">{{ s.label }}</option>
              </select>
            </div>
            <div class="field">
              <label>Taille</label>
              <select v-model="form.size" class="field-input">
                <option value="">Sélectionner...</option>
                <option v-for="s in COMPANY_SIZES" :key="s.id" :value="s.id">{{ s.label }}</option>
              </select>
            </div>
          </div>

          <div class="field">
            <label>Mission principale</label>
            <textarea v-model="form.mission" rows="2" placeholder="Ex: Améliorer le score ESG des corporates" class="field-input"></textarea>
          </div>
        </div>

        <!-- Zones géo -->
        <div class="form-section">
          <div class="section-label">
            <Globe :size="14" /> Zones géographiques
          </div>
          <div class="zones-grid">
            <button
              v-for="z in GEO_ZONES"
              :key="z.id"
              type="button"
              class="zone-btn"
              :class="{ active: form.geoZones.includes(z.id) }"
              @click="toggleZone(z.id)"
            >{{ z.label }}</button>
          </div>
        </div>

        <!-- Équipe -->
        <div class="form-section">
          <div class="section-label">
            <Users :size="14" /> Équipe
          </div>
          <div class="field-row">
            <div class="field">
              <label>Équipe opérationnelle</label>
              <input v-model.number="form.teamSize" type="number" min="1" placeholder="4" class="field-input" />
            </div>
            <div class="field">
              <label>Membres du board</label>
              <input v-model.number="form.boardSize" type="number" min="0" placeholder="5" class="field-input" />
            </div>
          </div>
        </div>

        <!-- Technique -->
        <div class="form-section">
          <div class="section-label">
            <Code2 :size="14" /> Contexte technique
          </div>
          <div class="field">
            <label>Type de produit</label>
            <select v-model="form.productType" class="field-input">
              <option value="">Sélectionner...</option>
              <option value="saas">SaaS Platform</option>
              <option value="mobile-app">Application Mobile</option>
              <option value="web-app">Application Web</option>
              <option value="api">API/Service</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div class="field">
            <label>Types de données traitées</label>
            <div class="check-grid">
              <label v-for="dt in dataTypeOptions" :key="dt.id" class="check-item">
                <input type="checkbox" v-model="form.dataTypes" :value="dt.id" />
                <span>{{ dt.label }}</span>
              </label>
            </div>
          </div>
        </div>

      </div>

      <div class="modal-foot">
        <button class="btn-cancel" @click="emit('close')">Annuler</button>
        <button class="btn-save" @click="save">
          <Save :size="14" /> Sauvegarder
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X, Building2, Globe, Users, Code2, Save } from 'lucide-vue-next'
import { useContextStore } from '@/stores/context'
import { SECTORS, COMPANY_SIZES, GEO_ZONES } from '@/data/regulations'

const emit = defineEmits(['close'])
const contextStore = useContextStore()

const dataTypeOptions = [
  { id: 'personal',  label: 'Données personnelles' },
  { id: 'financial', label: 'Données financières' },
  { id: 'esg',       label: 'Données ESG' },
  { id: 'analytics', label: 'Analytics/Métriques' },
]

const form = ref({
  companyName:  contextStore.companyName  || '',
  sector:       contextStore.sector       || '',
  size:         contextStore.size         || '',
  geoZones:     contextStore.geoZones     ? [...contextStore.geoZones] : [],
  mission:      contextStore.mission      || '',
  teamSize:     contextStore.teamSize     || null,
  boardSize:    contextStore.boardSize    || null,
  productType:  contextStore.productType  || '',
  dataTypes:    contextStore.dataTypes    ? [...contextStore.dataTypes] : [],
})

function toggleZone(id) {
  const idx = form.value.geoZones.indexOf(id)
  if (idx === -1) form.value.geoZones.push(id)
  else form.value.geoZones.splice(idx, 1)
}

function save() {
  contextStore.updateContext(form.value)
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0,0,0,.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-box {
  background: #0d1410;
  border: 1px solid rgba(0,220,120,.2);
  border-radius: 6px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideIn .2s ease;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-12px) scale(.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.4rem 1.6rem 1rem;
  border-bottom: 1px solid rgba(0,220,120,.08);
  flex-shrink: 0;
}
.modal-tag {
  font-size: .65rem;
  letter-spacing: .15em;
  color: #00dc78;
  font-weight: 700;
  display: block;
  margin-bottom: .3rem;
}
.modal-head h2 {
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
}
.modal-close-btn {
  background: transparent;
  border: none;
  color: #788a80;
  cursor: pointer;
  padding: .3rem;
  border-radius: 3px;
  display: flex;
  transition: color .2s;
}
.modal-close-btn:hover { color: #fff; }

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.2rem 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.form-section { display: flex; flex-direction: column; gap: .8rem; }

.section-label {
  display: flex;
  align-items: center;
  gap: .4rem;
  font-size: .7rem;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #00dc78;
  font-weight: 700;
  padding-bottom: .5rem;
  border-bottom: 1px solid rgba(0,220,120,.1);
}

.field { display: flex; flex-direction: column; gap: .35rem; }
.field-row { display: flex; gap: .8rem; }
.field-row .field { flex: 1; }

.field label {
  font-size: .72rem;
  color: #788a80;
  font-weight: 600;
  letter-spacing: .05em;
}

.field-input {
  background: #141a16;
  border: 1px solid rgba(0,220,120,.15);
  color: #f0f2f0;
  padding: .6rem .85rem;
  border-radius: 3px;
  font-size: .85rem;
  outline: none;
  width: 100%;
  transition: border-color .2s, box-shadow .2s;
  font-family: inherit;
  resize: vertical;
}
.field-input:focus {
  border-color: #00dc78;
  box-shadow: 0 0 0 3px rgba(0,220,120,.1);
}
.field-input option { background: #141a16; }

.zones-grid { display: flex; flex-wrap: wrap; gap: .5rem; }
.zone-btn {
  padding: .35rem .85rem;
  background: #141a16;
  border: 1px solid rgba(255,255,255,.1);
  color: #8a9e92;
  border-radius: 2px;
  cursor: pointer;
  font-size: .8rem;
  transition: all .2s;
}
.zone-btn:hover  { border-color: rgba(0,220,120,.3); color: #c8d4cc; }
.zone-btn.active { background: rgba(0,220,120,.12); border-color: #00dc78; color: #00dc78; font-weight: 600; }

.check-grid { display: flex; flex-wrap: wrap; gap: .5rem; }
.check-item {
  display: flex;
  align-items: center;
  gap: .4rem;
  font-size: .8rem;
  color: #8a9e92;
  cursor: pointer;
  padding: .3rem .7rem;
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 2px;
  transition: all .2s;
}
.check-item:hover { border-color: rgba(0,220,120,.2); color: #c8d4cc; }
.check-item input { accent-color: #00dc78; }

.modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: .8rem;
  padding: 1rem 1.6rem;
  border-top: 1px solid rgba(0,220,120,.08);
  flex-shrink: 0;
}
.btn-cancel {
  background: transparent;
  border: 1px solid rgba(255,255,255,.1);
  color: #8a9e92;
  padding: .55rem 1.2rem;
  border-radius: 2px;
  cursor: pointer;
  font-size: .85rem;
  transition: all .2s;
}
.btn-cancel:hover { color: #fff; border-color: rgba(255,255,255,.3); }

.btn-save {
  display: flex;
  align-items: center;
  gap: .4rem;
  background: #00dc78;
  border: none;
  color: #080c0a;
  padding: .55rem 1.4rem;
  border-radius: 2px;
  cursor: pointer;
  font-size: .85rem;
  font-weight: 700;
  transition: all .2s;
}
.btn-save:hover { background: #00ff8c; box-shadow: 0 0 16px rgba(0,220,120,.3); }

@media (max-width: 600px) {
  .field-row { flex-direction: column; }
}
</style>
