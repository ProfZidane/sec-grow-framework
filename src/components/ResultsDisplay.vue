<template>
  <div class="results">

    <!-- Header -->
    <div class="results-header">
      <button class="back-btn" @click="$emit('back-to-diagnostic')">← Retour</button>
      <div class="header-meta">
        <span class="header-tag">[ SEC-GROW ]</span>
        <h1>Rapport de Maturité</h1>
        <p>{{ companyName }} · {{ selectedEvaluator.name }} · {{ today }}</p>
      </div>
      <div class="header-level" :style="{ '--mc': globalMaturity.color }">
        <span class="level-dot-pulse"></span>
        {{ globalMaturity.name }}
      </div>
    </div>

    <!-- Score global + piliers -->
    <div class="scores-section">
      <div class="global-score-block">
        <div class="donut-wrap">
          <svg class="score-ring" width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="66" stroke="#1a2420" stroke-width="10" fill="none"/>
            <circle
              cx="80" cy="80" r="66"
              :stroke="globalMaturity.color"
              stroke-width="10" fill="none"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="dashOffset"
              transform="rotate(-90 80 80)"
              class="ring-progress"
            />
          </svg>
          <div class="score-center">
            <span class="score-num">{{ globalScore }}</span>
            <span class="score-denom">/80</span>
          </div>
        </div>
        <div class="score-pct">{{ Math.round(globalScore / 80 * 100) }}%</div>
        <div class="score-badge" :style="{ background: globalMaturity.color }">
          {{ globalMaturity.name }}
        </div>
        <p class="score-desc">{{ globalMaturity.description }}</p>
      </div>

      <div class="pillars-block">
        <div
          v-for="(section, i) in sections"
          :key="section.id"
          class="pillar-row"
          :style="{ '--pc': pillarColors[i] }"
        >
          <div class="pillar-label">
            <span class="pillar-name">{{ section.title }}</span>
            <span class="pillar-score">{{ getSectionScore(i) }}/20</span>
          </div>
          <div class="pillar-bar-track">
            <div
              class="pillar-bar-fill"
              :style="{ width: (getSectionScore(i) / 20 * 100) + '%' }"
            ></div>
          </div>
          <span class="pillar-level" :style="{ color: pillarColors[i] }">
            {{ getSectionMaturity(i) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Normes applicables -->
    <div class="regulations-section">
      <div class="section-header">
        <span class="section-tag">[ 01 ]</span>
        <h2>Normes & Réglementations Applicables</h2>
        <p>Détectées automatiquement selon votre profil entreprise</p>
      </div>

      <div v-if="!contextStore.sector || !contextStore.geoZones?.length" class="regs-empty">
        <span>⚠</span>
        <p>Complétez votre profil entreprise (secteur, zone géographique) pour voir les normes applicables.</p>
      </div>

      <div v-else class="regs-grid">
        <div
          v-for="reg in applicableRegs.slice(0, 6)"
          :key="reg.id"
          class="reg-card"
          :class="{ 'reg-high': reg.relevanceScore >= 70 }"
        >
          <div class="reg-top">
            <span class="reg-name">{{ reg.name }}</span>
            <span class="reg-relevance" :style="{ color: getRelevanceColor(reg.relevanceScore) }">
              {{ reg.relevanceScore }}% pertinent
            </span>
          </div>
          <p class="reg-desc">{{ reg.description }}</p>
          <div class="reg-bars">
            <div class="reg-bar-row">
              <span>Pertinence</span>
              <div class="reg-track">
                <div class="reg-fill" :style="{ width: reg.relevanceScore + '%', background: getRelevanceColor(reg.relevanceScore) }"></div>
              </div>
              <span>{{ reg.relevanceScore }}%</span>
            </div>
            <div class="reg-bar-row">
              <span>Couverture SEC-GROW</span>
              <div class="reg-track">
                <div class="reg-fill" :style="{ width: getCoverage(reg.id) + '%', background: getCoverageColor(getCoverage(reg.id)) }"></div>
              </div>
              <span>{{ getCoverage(reg.id) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2 boutons d'action -->
    <div class="actions-section">
      <button class="action-report" @click="handleGenerateReport" :disabled="generatingPdf || llmLoading">
        <span class="action-icon">
          <Loader v-if="generatingPdf || llmLoading" :size="24" class="spin" />
          <FileText v-else :size="24" />
        </span>
        <div class="action-text">
          <strong>{{ generatingPdf ? 'Génération en cours...' : llmLoading ? 'Analyse IA en cours...' : 'Générer mon rapport' }}</strong>
          <span>PDF · Recommandations IA · OKRs · Normes incluses</span>
        </div>
      </button>

      <button class="action-further" @click="showGoFurther = true">
        <span class="action-icon">
          <component :is="Rocket" />
        </span>
        <div class="action-text">
          <strong>Aller plus loin avec SEC-GROW</strong>
          <span>Rapport détaillé · Plateforme complète · Accompagnement</span>
        </div>
        <span class="action-arrow">→</span>
      </button>
    </div>

    <!-- Modal Aller plus loin -->
    <div v-if="showGoFurther" class="modal-overlay" @click.self="showGoFurther = false">
      <div class="modal-go-further">
        <button class="modal-close" @click="showGoFurther = false">✕</button>

        <div class="modal-header">
          <span class="modal-tag">[ SEC-GROW PRO ]</span>
          <h2>Allez plus loin dans votre démarche</h2>
          <p>Ce diagnostic est une première étape. Voici ce que SEC-GROW peut faire pour vous.</p>
        </div>

        <div class="offers-grid">
          <div class="offer-card" v-for="offer in offers" :key="offer.title">
            <span class="offer-icon">{{ offer.icon }}</span>
            <h3>{{ offer.title }}</h3>
            <p>{{ offer.desc }}</p>
          </div>
        </div>

        <div class="modal-cta">
          <p class="modal-cta-text">
            Intéressé ? Envoyez-nous votre diagnostic et discutons de votre roadmap sécurité.
          </p>
          <a :href="mailtoLink" class="btn-contact">
            <span>✉</span> Contacter SEC-GROW
          </a>
          <button class="btn-restart" @click="$emit('restart')">
            Nouvelle évaluation
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { FileText, Loader, Rocket, Monitor, Target, ClipboardList } from 'lucide-vue-next'
import { MATURITY_LEVELS } from '@/data/questions'
import { getApplicableRegulations, getSecGrowCoverage } from '@/data/regulations'
import { generateReport } from '@/utils/reportGenerator'
import { useContextStore } from '@/stores/context'
import { generateFullAnalysis } from '@/services/llmService'

const props = defineProps({
  selectedEvaluator: { type: Object, required: true },
  responses:         { type: Object, required: true },
  sections:          { type: Array,  required: true },
  llmResults:        { type: Object, default: null },
  llmLoading:        { type: Boolean, default: false }
})

defineEmits(['restart', 'back-to-diagnostic'])

const contextStore = useContextStore()
const showGoFurther = ref(false)
const generatingPdf = ref(false)
const llmResults = ref(null)
const llmLoading = ref(false)
const llmError = ref(null)

onMounted(async () => {
  llmLoading.value = true
  try {
    const diagnosticData = {
      responses: props.responses,
      sections:  props.sections,
      evaluator: props.selectedEvaluator,
      context:   contextStore.$state,
    }
    llmResults.value = await generateFullAnalysis(diagnosticData)
  } catch (e) {
    llmError.value = e.message
  } finally {
    llmLoading.value = false
  }
})

const pillarColors = ['#00c8ff', '#00dc78', '#8b5cf6', '#f59e0b']

const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
const companyName = computed(() => contextStore.companyName || 'Votre entreprise')

// ── Scores ──
const getSectionScore = (i) => {
  return props.sections[i].questions.reduce((sum, q) => sum + (props.responses[q.id] ?? 0), 0)
}

const getSectionMaturity = (i) => {
  const s = getSectionScore(i)
  if (s <= 4)  return 'Ad Hoc'
  if (s <= 9)  return 'Bronze'
  if (s <= 14) return 'Silver'
  if (s <= 17) return 'Gold'
  return 'Platinum'
}

const globalScore = computed(() =>
  props.sections.reduce((sum, _, i) => sum + getSectionScore(i), 0)
)

const globalMaturityLevel = computed(() => {
  const s = globalScore.value
  if (s <= 16) return 0
  if (s <= 35) return 1
  if (s <= 55) return 2
  if (s <= 70) return 3
  return 4
})

const globalMaturity = computed(() => MATURITY_LEVELS[globalMaturityLevel.value])

const circumference = 2 * Math.PI * 66
const dashOffset = computed(() => circumference - (globalScore.value / 80) * circumference)

// ── Normes ──
const applicableRegs = computed(() => {
  const sector = contextStore.sector || 'other'
  const size   = contextStore.size || 'startup'
  const zones  = contextStore.geoZones || ['EU']
  return getApplicableRegulations(sector, size, zones)
})

const getCoverage = (regId) => getSecGrowCoverage(globalScore.value, regId)

const getRelevanceColor = (score) => {
  if (score >= 70) return '#ef4444'
  if (score >= 40) return '#f59e0b'
  return '#6b7280'
}

const getCoverageColor = (score) => {
  if (score >= 70) return '#00dc78'
  if (score >= 40) return '#eab308'
  return '#f97316'
}

// ── Rapport PDF ──
async function handleGenerateReport() {
  generatingPdf.value = true
  try {
    const pillarScores = {
      governance: getSectionScore(0),
      technical:  getSectionScore(1),
      processes:  getSectionScore(2),
      culture:    getSectionScore(3),
    }
    generateReport({
      companyName:   companyName.value,
      evaluatorRole: props.selectedEvaluator.name,
      sector:        contextStore.sector,
      companySize:   contextStore.size || 'startup',
      geoZones:      contextStore.geoZones || ['EU'],
      globalScore:   globalScore.value,
      maturityLevel: globalMaturity.value,
      pillarScores,
      sections:      props.sections,
      responses:     props.responses,
      llmResults:    llmResults.value,
    })
  } finally {
    setTimeout(() => { generatingPdf.value = false }, 1000)
  }
}

// ── Mailto ──
const mailtoLink = computed(() => {
  const email = import.meta.env.VITE_CONTACT_EMAIL || 'contact@sec-grow.com'
  const subject = encodeURIComponent(`Diagnostic SEC-GROW — ${companyName.value}`)
  const body = encodeURIComponent(
    `Bonjour,\n\nJe viens de réaliser mon diagnostic SEC-GROW.\n\n` +
    `Entreprise : ${companyName.value}\n` +
    `Évaluateur : ${props.selectedEvaluator.name}\n` +
    `Score global : ${globalScore.value}/80\n` +
    `Niveau de maturité : ${globalMaturity.value.name}\n\n` +
    `Je souhaite en savoir plus sur l'accompagnement SEC-GROW.\n\nCordialement`
  )
  return `mailto:${email}?subject=${subject}&body=${body}`
})

// ── Offres ──
const offers = [
  { icon: FileText, title: 'Rapport détaillé & personnalisé', desc: 'Un rapport complet avec votre logo, une analyse approfondie par pilier, des recommandations sur-mesure et une roadmap priorisée.' },
  { icon: Monitor, title: 'Plateforme de gestion continue', desc: 'Suivez votre progression dans le temps, comparez plusieurs évaluateurs, gérez vos OKRs sécuritaires et mesurez l\'impact de vos actions.' },
  { icon: Target, title: 'Accompagnement expert', desc: 'Un expert SEC-GROW vous accompagne dans la mise en œuvre de votre roadmap : ateliers, coaching, revues trimestrielles.' },
  { icon: ClipboardList, title: 'Conformité réglementaire', desc: 'Cartographie complète de vos obligations (RGPD, DORA, NIS2...) avec un plan d\'action pour atteindre la conformité.' },
]
</script>

<style scoped>
/* ─── Base ─── */
.results {
  background: #080c0a;
  color: #f0f2f0;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  min-height: 100vh;
  padding-bottom: 4rem;
}

/* ─── Header ─── */
.results-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.5rem 2rem;
  background: #0d1410;
  border-bottom: 1px solid rgba(0,220,120,.12);
  flex-wrap: wrap; gap: 1rem;
}
.back-btn {
  background: transparent; border: 1px solid rgba(255,255,255,.12);
  color: #8a9e92; padding: .45rem .9rem; border-radius: 2px;
  cursor: pointer; font-size: .82rem; transition: all .2s;
}
.back-btn:hover { color: #fff; border-color: rgba(255,255,255,.3); }
.header-meta { text-align: center; }
.header-tag { font-size: .68rem; letter-spacing: .15em; color: #00dc78; font-weight: 700; }
.header-meta h1 { font-size: 1.3rem; font-weight: 800; color: #fff; margin: .2rem 0; }
.header-meta p  { font-size: .8rem; color: #788a80; }
.header-level {
  display: flex; align-items: center; gap: .5rem;
  font-size: .85rem; font-weight: 700; color: var(--mc);
  border: 1px solid var(--mc); padding: .4rem .9rem; border-radius: 2px;
}
.level-dot-pulse {
  width: 7px; height: 7px; border-radius: 50%; background: var(--mc);
  animation: pdot 2s infinite;
}
@keyframes pdot { 0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,.3)} 50%{box-shadow:0 0 0 5px rgba(255,255,255,0)} }

/* ─── Scores ─── */
.scores-section {
  display: flex; gap: 3rem; align-items: center;
  padding: 3rem 2rem; flex-wrap: wrap;
  border-bottom: 1px solid rgba(0,220,120,.08);
}
.global-score-block { text-align: center; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: .4rem; }
.donut-wrap { position: relative; width: 160px; height: 160px; flex-shrink: 0; }
.score-ring { display: block; }
.ring-progress { transition: stroke-dashoffset 1s ease; }
.score-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.score-num   { display: block; font-size: 2.4rem; font-weight: 800; color: #fff; line-height: 1; }
.score-denom { display: block; font-size: .9rem; color: #788a80; }
.score-pct   { font-size: .8rem; color: #788a80; margin-top: .3rem; }
.score-badge {
  display: inline-block; padding: .35rem 1rem; border-radius: 2px;
  color: #080c0a; font-weight: 800; font-size: .82rem;
  letter-spacing: .06em; margin: .6rem 0 .4rem;
}
.score-desc { font-size: .78rem; color: #8a9e92; max-width: 160px; line-height: 1.5; }

.pillars-block { flex: 1; min-width: 280px; display: flex; flex-direction: column; gap: 1.2rem; }
.pillar-row { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: .5rem; }
.pillar-label { display: flex; justify-content: space-between; grid-column: 1 / -1; }
.pillar-name  { font-size: .88rem; font-weight: 600; color: #c8d4cc; }
.pillar-score { font-size: .88rem; font-weight: 700; color: #fff; }
.pillar-bar-track {
  height: 6px; background: #1a2420; border-radius: 3px; overflow: hidden;
  grid-column: 1;
}
.pillar-bar-fill {
  height: 100%; background: var(--pc); border-radius: 3px;
  transition: width 1s ease;
}
.pillar-level { font-size: .72rem; font-weight: 700; letter-spacing: .06em; }

/* ─── Normes ─── */
.regulations-section { padding: 3rem 2rem; border-bottom: 1px solid rgba(0,220,120,.08); }
.section-header { margin-bottom: 2rem; }
.section-tag { font-size: .68rem; letter-spacing: .15em; color: #00dc78; font-weight: 700; display: block; margin-bottom: .4rem; }
.section-header h2 { font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: .4rem; }
.section-header p  { font-size: .85rem; color: #8a9e92; }

.regs-empty {
  display: flex; align-items: center; gap: 1rem;
  padding: 1.5rem; background: #0d1410;
  border: 1px solid rgba(245,158,11,.2); border-radius: 4px;
  color: #8a9e92; font-size: .88rem;
}
.regs-empty span { font-size: 1.2rem; color: #f59e0b; }

.regs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
.reg-card {
  background: #0d1410; border: 1px solid rgba(255,255,255,.07);
  border-radius: 4px; padding: 1.2rem;
  transition: border-color .2s;
}
.reg-card.reg-high { border-color: rgba(239,68,68,.25); }
.reg-card:hover { border-color: rgba(0,220,120,.25); }
.reg-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: .5rem; }
.reg-name { font-size: .95rem; font-weight: 800; color: #fff; }
.reg-relevance { font-size: .72rem; font-weight: 700; letter-spacing: .04em; }
.reg-desc { font-size: .78rem; color: #8a9e92; line-height: 1.5; margin-bottom: .9rem; }
.reg-bars { display: flex; flex-direction: column; gap: .5rem; }
.reg-bar-row { display: grid; grid-template-columns: 110px 1fr 36px; align-items: center; gap: .5rem; font-size: .7rem; color: #788a80; }
.reg-track { height: 4px; background: #1a2420; border-radius: 2px; overflow: hidden; }
.reg-fill  { height: 100%; border-radius: 2px; transition: width .8s ease; }

/* ─── Actions ─── */
.actions-section {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
  padding: 3rem 2rem;
}
.action-report, .action-further {
  display: flex; align-items: center; gap: 1.2rem;
  padding: 1.5rem 1.8rem; border-radius: 4px; cursor: pointer;
  transition: all .25s; text-align: left; border: none;
}
.action-report {
  background: #00dc78; color: #080c0a;
}
.action-report:hover:not(:disabled) {
  background: #00ff8c; box-shadow: 0 0 30px rgba(0,220,120,.35);
  transform: translateY(-2px);
}
.action-report:disabled { opacity: .6; cursor: not-allowed; }
.action-further {
  background: #0d1410; color: #f0f2f0;
  border: 1px solid rgba(0,220,120,.25);
}
.action-further:hover {
  border-color: #00dc78; box-shadow: 0 0 20px rgba(0,220,120,.1);
  transform: translateY(-2px);
}
.action-icon { font-size: 1.6rem; flex-shrink: 0; display: flex; align-items: center; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.action-text { flex: 1; }
.action-text strong { display: block; font-size: .95rem; font-weight: 700; margin-bottom: .2rem; }
.action-text span   { font-size: .78rem; opacity: .7; }
.action-arrow { font-size: 1.2rem; color: #00dc78; }

/* ─── Modal ─── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,.75); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 1rem;
}
.modal-go-further {
  background: #0d1410; border: 1px solid rgba(0,220,120,.2);
  border-radius: 8px; padding: 2.5rem; max-width: 700px; width: 100%;
  position: relative; max-height: 90vh; overflow-y: auto;
}
.modal-close {
  position: absolute; top: 1rem; right: 1rem;
  background: transparent; border: none; color: #788a80;
  font-size: 1.1rem; cursor: pointer; transition: color .2s;
}
.modal-close:hover { color: #fff; }
.modal-header { margin-bottom: 2rem; }
.modal-tag { font-size: .68rem; letter-spacing: .15em; color: #00dc78; font-weight: 700; display: block; margin-bottom: .5rem; }
.modal-header h2 { font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: .5rem; }
.modal-header p  { font-size: .88rem; color: #8a9e92; }

.offers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.offer-card {
  background: #141a16; border: 1px solid rgba(255,255,255,.07);
  border-radius: 4px; padding: 1.3rem;
}
.offer-icon { font-size: 1.5rem; display: block; margin-bottom: .6rem; }
.offer-card h3 { font-size: .92rem; font-weight: 700; color: #fff; margin-bottom: .4rem; }
.offer-card p  { font-size: .8rem; color: #8a9e92; line-height: 1.6; }

.modal-cta { text-align: center; padding-top: 1.5rem; border-top: 1px solid rgba(0,220,120,.1); }
.modal-cta-text { font-size: .88rem; color: #8a9e92; margin-bottom: 1.2rem; }
.btn-contact {
  display: inline-flex; align-items: center; gap: .6rem;
  padding: .85rem 2rem; background: #00dc78; color: #080c0a;
  font-weight: 700; font-size: .9rem; border-radius: 2px;
  text-decoration: none; transition: all .22s; margin-right: 1rem;
}
.btn-contact:hover { background: #00ff8c; box-shadow: 0 0 24px rgba(0,220,120,.35); }
.btn-restart {
  background: transparent; border: 1px solid rgba(255,255,255,.15);
  color: #8a9e92; padding: .85rem 1.5rem; border-radius: 2px;
  cursor: pointer; font-size: .88rem; transition: all .2s;
}
.btn-restart:hover { color: #fff; border-color: rgba(255,255,255,.3); }

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .scores-section { flex-direction: column; padding: 2rem 1.2rem; }
  .actions-section { grid-template-columns: 1fr; padding: 2rem 1.2rem; }
  .regulations-section { padding: 2rem 1.2rem; }
  .results-header { padding: 1rem 1.2rem; }
  .reg-bar-row { grid-template-columns: 80px 1fr 30px; }
}
</style>
