<template>
  <div class="evaluator-page" ref="pageRef">

    <!-- Étape 1 : Setup entreprise -->
    <div v-if="step === 'setup'" class="step-setup">
      <div class="step-tag">[ ÉTAPE 1 / 2 ]</div>
      <h1>Votre entreprise</h1>
      <p class="step-sub">Ces informations permettent de détecter automatiquement vos normes applicables et de contextualiser votre diagnostic.</p>

      <div class="setup-form">
        <div class="form-row">
          <div class="form-group">
            <label>Nom de l'entreprise</label>
            <input
              v-model="setup.companyName"
              type="text"
              placeholder="Ex: KOALOO"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-row two-cols">
          <div class="form-group">
            <label>Secteur d'activité</label>
            <select v-model="setup.sector" class="form-input">
              <option value="">Sélectionner...</option>
              <option v-for="s in sectors" :key="s.id" :value="s.id">{{ s.label }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Taille de l'entreprise</label>
            <select v-model="setup.size" class="form-input">
              <option value="">Sélectionner...</option>
              <option v-for="s in sizes" :key="s.id" :value="s.id">{{ s.label }}</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Zone(s) géographique(s) d'opération</label>
          <div class="zones-grid">
            <button
              v-for="z in zones"
              :key="z.id"
              class="zone-btn"
              :class="{ active: setup.geoZones.includes(z.id) }"
              @click="toggleZone(z.id)"
              type="button"
            >
              {{ z.label }}
            </button>
          </div>
        </div>

        <!-- Aperçu normes -->
        <div v-if="previewRegs.length" class="regs-preview">
          <div class="preview-label">
            <span class="preview-dot"></span>
            {{ previewRegs.length }} normes détectées pour votre profil
          </div>
          <div class="preview-tags">
            <span
              v-for="reg in previewRegs.slice(0, 5)"
              :key="reg.id"
              class="reg-tag"
              :class="{ 'reg-tag-high': reg.relevanceScore >= 70 }"
            >
              {{ reg.name }}
            </span>
            <span v-if="previewRegs.length > 5" class="reg-tag reg-tag-more">
              +{{ previewRegs.length - 5 }}
            </span>
          </div>
        </div>

        <button
          class="btn-next"
          :disabled="!isSetupValid"
          @click="confirmSetup"
        >
          Continuer → Choisir mon rôle
        </button>
      </div>
    </div>

    <!-- Étape 2 : Sélection rôle -->
    <div v-else class="step-role">
      <button class="back-link" @click="step = 'setup'">← Modifier mon profil</button>

      <div class="step-tag">[ ÉTAPE 2 / 2 ]</div>
      <h1>Qui effectue cette évaluation ?</h1>
      <p class="step-sub">
        Votre rôle influence la lecture des résultats. Pour un diagnostic optimal,
        nous recommandons que le <strong>CEO et le CTO</strong> évaluent chacun de leur côté.
      </p>

      <div class="roles-grid">
        <button
          v-for="role in evaluatorRoles"
          :key="role.id"
          class="role-card"
          @click="selectRole(role)"
        >
          <div class="role-header">
            <span class="role-emoji">{{ role.emoji }}</span>
            <span class="role-arrow">→</span>
          </div>
          <h2>{{ role.name }}</h2>
          <p>{{ role.description }}</p>
          <div class="role-focus">
            <span v-for="tag in role.focus" :key="tag" class="focus-tag">{{ tag }}</span>
          </div>
          <div class="role-cta">Évaluer en tant que {{ role.name }}</div>
        </button>
      </div>

      <div class="info-block">
        <span class="info-icon">ℹ</span>
        <div>
          <strong>Durée estimée : 30 minutes</strong>
          <p>Vos réponses sont sauvegardées automatiquement. Vous pouvez reprendre à tout moment.</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { EVALUATOR_ROLES } from '@/data/questions'
import { SECTORS, COMPANY_SIZES, GEO_ZONES, getApplicableRegulations } from '@/data/regulations'
import { useContextStore } from '@/stores/context'

const emit = defineEmits(['evaluator-selected'])
const contextStore = useContextStore()

const props = defineProps({
  startAtRole: { type: Boolean, default: false }
})

const step = ref(props.startAtRole ? 'role' : 'setup')

const setup = ref({
  companyName: contextStore.companyName || '',
  sector:      contextStore.sector || '',
  size:        contextStore.size || '',
  geoZones:    contextStore.geoZones?.length ? [...contextStore.geoZones] : []
})

const sectors = SECTORS
const sizes   = COMPANY_SIZES
const zones   = GEO_ZONES

const roleFocus = {
  ceo:           ['Gouvernance', 'Stratégie', 'Budget'],
  cto:           ['Technique', 'Architecture', 'Processus'],
  datascientist: ['Données', 'Conformité', 'Analyse'],
}

const evaluatorRoles = EVALUATOR_ROLES.map(r => ({
  ...r,
  focus: roleFocus[r.id] || []
}))

const isSetupValid = computed(() =>
  setup.value.companyName.trim() &&
  setup.value.sector &&
  setup.value.size &&
  setup.value.geoZones.length > 0
)

const previewRegs = computed(() => {
  if (!setup.value.sector || !setup.value.size || !setup.value.geoZones.length) return []
  return getApplicableRegulations(setup.value.sector, setup.value.size, setup.value.geoZones)
    .filter(r => r.relevanceScore >= 40)
})

function toggleZone(id) {
  const idx = setup.value.geoZones.indexOf(id)
  if (idx === -1) setup.value.geoZones.push(id)
  else setup.value.geoZones.splice(idx, 1)
}

const pageRef = ref(null)

function scrollTop() {
  nextTick(() => {
    if (pageRef.value) pageRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

function confirmSetup() {
  contextStore.updateContext({
    companyName: setup.value.companyName,
    sector:      setup.value.sector,
    size:        setup.value.size,
    geoZones:    setup.value.geoZones
  })
  step.value = 'role'
  scrollTop()
}

function selectRole(role) {
  emit('evaluator-selected', role)
}
</script>

<style scoped>
/* ─── Base ─── */
.evaluator-page {
  background: #080c0a;
  color: #f0f2f0;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  min-height: 100vh;
  padding: 3rem 2rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.step-setup, .step-role {
  width: 100%;
  max-width: 720px;
}

.step-tag {
  font-size: .68rem;
  letter-spacing: .15em;
  color: #00dc78;
  font-weight: 700;
  margin-bottom: .8rem;
}

h1 {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  color: #fff;
  margin-bottom: .6rem;
}

.step-sub {
  font-size: .9rem;
  color: #8a9e92;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  max-width: 560px;
}
.step-sub strong { color: #c8d4cc; }

/* ─── Form ─── */
.setup-form { display: flex; flex-direction: column; gap: 1.5rem; }

.form-row { display: flex; flex-direction: column; gap: 1.5rem; }
.form-row.two-cols { flex-direction: row; gap: 1.2rem; }
.form-row.two-cols .form-group { flex: 1; }

.form-group { display: flex; flex-direction: column; gap: .5rem; }
.form-group label {
  font-size: .75rem;
  letter-spacing: .08em;
  color: #788a80;
  font-weight: 600;
  text-transform: uppercase;
}

.form-input {
  background: #0d1410;
  border: 1px solid rgba(0,220,120,.18);
  color: #f0f2f0;
  padding: .75rem 1rem;
  border-radius: 3px;
  font-size: .9rem;
  transition: border-color .2s, box-shadow .2s;
  outline: none;
  width: 100%;
}
.form-input:focus {
  border-color: #00dc78;
  box-shadow: 0 0 0 3px rgba(0,220,120,.1);
}
.form-input option { background: #0d1410; }

/* Zones */
.zones-grid { display: flex; flex-wrap: wrap; gap: .6rem; }
.zone-btn {
  padding: .45rem 1rem;
  background: #0d1410;
  border: 1px solid rgba(255,255,255,.1);
  color: #8a9e92;
  border-radius: 2px;
  cursor: pointer;
  font-size: .82rem;
  transition: all .2s;
}
.zone-btn:hover { border-color: rgba(0,220,120,.3); color: #c8d4cc; }
.zone-btn.active {
  background: rgba(0,220,120,.12);
  border-color: #00dc78;
  color: #00dc78;
  font-weight: 600;
}

/* Aperçu normes */
.regs-preview {
  background: #0d1410;
  border: 1px solid rgba(0,220,120,.15);
  border-radius: 3px;
  padding: 1rem 1.2rem;
}
.preview-label {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-size: .75rem;
  color: #00dc78;
  font-weight: 600;
  letter-spacing: .06em;
  margin-bottom: .7rem;
}
.preview-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #00dc78;
  animation: pdot 2s infinite;
}
@keyframes pdot { 0%,100%{box-shadow:0 0 0 0 rgba(0,220,120,.5)} 50%{box-shadow:0 0 0 5px rgba(0,220,120,0)} }
.preview-tags { display: flex; flex-wrap: wrap; gap: .5rem; }
.reg-tag {
  padding: .25rem .65rem;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 2px;
  font-size: .72rem;
  color: #8a9e92;
}
.reg-tag-high {
  background: rgba(239,68,68,.1);
  border-color: rgba(239,68,68,.3);
  color: #ef4444;
}
.reg-tag-more { color: #788a80; }

/* Bouton suivant */
.btn-next {
  padding: .9rem 2rem;
  background: #00dc78;
  color: #080c0a;
  font-weight: 700;
  font-size: .9rem;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: all .22s;
  align-self: flex-start;
  letter-spacing: .03em;
}
.btn-next:hover:not(:disabled) {
  background: #00ff8c;
  box-shadow: 0 0 24px rgba(0,220,120,.35);
  transform: translateY(-1px);
}
.btn-next:disabled { opacity: .4; cursor: not-allowed; }

/* ─── Rôles ─── */
.back-link {
  background: transparent;
  border: none;
  color: #788a80;
  font-size: .82rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.5rem;
  display: block;
  transition: color .2s;
}
.back-link:hover { color: #fff; }

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.role-card {
  background: #0d1410;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 4px;
  padding: 1.8rem 1.5rem;
  cursor: pointer;
  text-align: left;
  transition: all .25s;
  position: relative;
  overflow: hidden;
}
.role-card::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: #00dc78;
  transform: scaleX(0);
  transition: transform .25s;
}
.role-card:hover {
  border-color: rgba(0,220,120,.35);
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0,0,0,.4);
}
.role-card:hover::after { transform: scaleX(1); }

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.role-emoji { font-size: 1.8rem; }
.role-arrow {
  color: #00dc78;
  font-size: 1.1rem;
  opacity: 0;
  transform: translateX(-6px);
  transition: all .25s;
}
.role-card:hover .role-arrow { opacity: 1; transform: translateX(0); }

.role-card h2 {
  font-size: 1.15rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: .4rem;
}
.role-card p {
  font-size: .82rem;
  color: #8a9e92;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.role-focus { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: 1.2rem; }
.focus-tag {
  font-size: .68rem;
  padding: .2rem .55rem;
  background: rgba(0,220,120,.08);
  border: 1px solid rgba(0,220,120,.2);
  color: #00dc78;
  border-radius: 2px;
  letter-spacing: .04em;
}

.role-cta {
  font-size: .78rem;
  color: #788a80;
  font-weight: 600;
  transition: color .2s;
}
.role-card:hover .role-cta { color: #00dc78; }

/* Info block */
.info-block {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.2rem 1.5rem;
  background: #0d1410;
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 3px;
}
.info-icon { font-size: 1rem; color: #00dc78; flex-shrink: 0; margin-top: .1rem; }
.info-block strong { display: block; font-size: .88rem; color: #c8d4cc; margin-bottom: .3rem; }
.info-block p { font-size: .8rem; color: #8a9e92; line-height: 1.5; margin: 0; }

/* ─── Responsive ─── */
@media (max-width: 600px) {
  .evaluator-page { padding: 2rem 1.2rem; }
  .form-row.two-cols { flex-direction: column; }
  .roles-grid { grid-template-columns: 1fr; }
  .btn-next { width: 100%; text-align: center; }
}
</style>
