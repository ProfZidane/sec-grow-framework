<template>
  <div class="diagnostic" :class="{ 'sidebar-collapsed': sidebarCollapsed }">

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-top">
        <div class="sidebar-brand" v-if="!sidebarCollapsed">
          <span class="brand-bracket">[</span>SEC<span class="brand-dash">—</span>GROW<span class="brand-bracket">]</span>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed" :title="sidebarCollapsed ? 'Ouvrir' : 'Réduire'">
          <PanelLeftClose v-if="!sidebarCollapsed" :size="16" />
          <PanelLeftOpen v-else :size="16" />
        </button>
      </div>

      <div class="sidebar-evaluator" v-if="!sidebarCollapsed">
        <span class="eval-dot"></span>
        <span class="eval-name">{{ selectedEvaluator?.name ?? '—' }}</span>
        <button class="eval-change" @click="showChangeConfirm = true">Changer</button>
      </div>
      <div class="sidebar-evaluator-mini" v-else :title="selectedEvaluator?.name ?? ''">
        <span class="eval-dot"></span>
      </div>

      <!-- Confirm changer évaluateur -->
      <Teleport to="body">
        <div v-if="showChangeConfirm" class="confirm-overlay" @click.self="showChangeConfirm = false">
          <div class="confirm-box">
            <p class="confirm-title">Changer d'évaluateur ?</p>
            <p class="confirm-sub">Vos réponses seront conservées.</p>
            <div class="confirm-actions">
              <button class="confirm-cancel" @click="showChangeConfirm = false">Annuler</button>
              <button class="confirm-ok" @click="doReset">Confirmer</button>
            </div>
          </div>
        </div>
      </Teleport>

      <nav class="sidebar-nav">
        <button
          v-for="(section, i) in sections"
          :key="section.id"
          class="nav-item"
          :class="{ active: currentSection === i, completed: getSectionProgress(i) === 100 }"
          @click="$emit('section-changed', i)"
          :title="sidebarCollapsed ? section.title : ''"
        >
          <div class="nav-item-left">
            <div class="nav-indicator">
              <CheckCircle v-if="getSectionProgress(i) === 100" :size="14" class="nav-check-icon" />
              <component v-else :is="pillarIcons[i]" :size="14" class="nav-pillar-icon" />
            </div>
            <div class="nav-info" v-if="!sidebarCollapsed">
              <span class="nav-title">{{ section.title }}</span>
              <span class="nav-score">{{ getSectionScore(i) }}/20</span>
            </div>
          </div>
          <div class="nav-bar-wrap" v-if="!sidebarCollapsed">
            <div class="nav-bar-fill" :style="{ width: getSectionProgress(i) + '%', background: section.color }"></div>
          </div>
        </button>
      </nav>

      <div class="sidebar-bottom">
        <div v-if="!sidebarCollapsed">
          <div class="global-mini">
            <span class="global-mini-label">Score total</span>
            <span class="global-mini-value">{{ globalScore }}<small>/80</small></span>
          </div>
          <div class="global-mini-bar">
            <div class="global-mini-fill" :style="{ width: (globalScore / 80 * 100) + '%' }"></div>
          </div>
        </div>
        <div v-else class="score-mini-collapsed" :title="`${globalScore}/80`">
          <span>{{ globalScore }}</span>
        </div>

        <button class="settings-btn" @click="showSettings = true" :title="'Paramètres'">
          <Settings :size="16" />
          <span v-if="!sidebarCollapsed">Paramètres</span>
        </button>
      </div>
    </aside>

    <!-- Zone principale -->
    <main class="diagnostic-main" ref="mainRef">

      <div class="section-header">
        <div class="section-meta">
          <span class="section-tag" :style="{ color: sections[currentSection].color }">
            [ {{ currentSection + 1 }} / {{ sections.length }} ]
          </span>
          <h2>{{ sections[currentSection].title }}</h2>
        </div>
        <div class="section-progress-info">
          <span class="answered-count">{{ getSectionAnswered(currentSection) }}/5 répondues</span>
          <div class="section-progress-bar">
            <div
              class="section-progress-fill"
              :style="{ width: getSectionProgress(currentSection) + '%', background: sections[currentSection].color }"
            ></div>
          </div>
        </div>
      </div>

      <div class="questions-list">
        <div
          v-for="(question, qi) in sections[currentSection].questions"
          :key="question.id"
          class="question-card"
          :class="{ answered: responses[question.id] !== undefined }"
          :ref="el => { if (el) questionCards[qi] = el }"
        >
          <div class="question-top">
            <span class="question-num">{{ qi + 1 }}</span>
            <div class="question-body">
              <h3>{{ question.text }}</h3>
              <p class="question-help">
                <Info :size="13" class="help-icon" />
                {{ question.help }}
              </p>
            </div>
            <div v-if="responses[question.id] !== undefined" class="question-badge" :style="{ background: getScoreColor(responses[question.id]) }">
              {{ responses[question.id] }}/4
            </div>
          </div>

          <div class="options-list">
            <label
              v-for="(option, oi) in question.options"
              :key="oi"
              class="option"
              :class="{ selected: responses[question.id] === oi }"
            >
              <input type="radio" :name="question.id" :value="oi" :checked="responses[question.id] === oi" @change="onAnswer(question.id, oi, qi)" />
              <div class="option-content">
                <div class="option-left">
                  <span class="option-radio"></span>
                  <span class="option-text">{{ option }}</span>
                </div>
                <div class="option-right">
                  <span class="option-pts">{{ oi }} pts</span>
                  <span class="option-level" :style="{ color: levelColors[oi] }">{{ levelNames[oi] }}</span>
                </div>
              </div>
            </label>
          </div>

          <!-- Scroll to next question -->
          <button
            v-if="qi < sections[currentSection].questions.length - 1"
            class="scroll-next-btn"
            :ref="el => { if (el) scrollBtns[qi] = el }"
            @click="scrollToQuestion(qi + 1)"
            tabindex="-1"
          >
            <ChevronDown :size="14" />
          </button>
        </div>
      </div>

      <div class="nav-footer">
        <button class="nav-btn nav-prev" :disabled="currentSection === 0" @click="navigate(currentSection - 1)">
          <ChevronLeft :size="16" /> Précédent
        </button>

        <div class="nav-center">
          <span class="total-progress">{{ totalAnswered }}/20 questions</span>
          <div class="total-bar">
            <div class="total-fill" :style="{ width: (totalAnswered / 20 * 100) + '%' }"></div>
          </div>
        </div>

        <button v-if="currentSection < sections.length - 1" class="nav-btn nav-next" @click="navigate(currentSection + 1)">
          Suivant <ChevronRight :size="16" />
        </button>

        <button v-else class="nav-btn nav-finish" :class="{ ready: isComplete }" :disabled="!isComplete" @click="$emit('show-results')">
          <span v-if="!isComplete">{{ 20 - totalAnswered }} manquantes</span>
          <span v-else>Voir mes résultats <ArrowRight :size="16" /></span>
        </button>
      </div>
    </main>

    <!-- Modal Paramètres -->
    <ContextSettingsModal v-if="showSettings" @close="showSettings = false" />
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { MATURITY_LEVELS } from '@/data/questions'
import {
  Shield, Code2, ClipboardList, Users,
  CheckCircle, ChevronLeft, ChevronRight, ChevronDown, ArrowRight,
  PanelLeftClose, PanelLeftOpen, Settings, Info
} from 'lucide-vue-next'
import ContextSettingsModal from '@/components/ContextSettingsModal.vue'

const props = defineProps({
  selectedEvaluator: { type: Object, required: true },
  currentSection:    { type: Number, required: true },
  responses:         { type: Object, required: true },
  sections:          { type: Array,  required: true }
})

const sidebarCollapsed = ref(false)
const showSettings = ref(false)
const showChangeConfirm = ref(false)
const mainRef = ref(null)
const questionCards = ref([])
const scrollBtns = ref([])

watch(() => props.currentSection, () => {
  questionCards.value = []
  scrollBtns.value = []
})

const pillarIcons = [Shield, Code2, ClipboardList, Users]
const levelNames  = ['Ad Hoc', 'Bronze', 'Silver', 'Gold', 'Platinum']
const levelColors = ['#ef4444', '#f97316', '#94a3b8', '#eab308', '#8b5cf6']

const getSectionScore    = (i) => props.sections[i].questions.reduce((sum, q) => sum + (props.responses[q.id] ?? 0), 0)
const getSectionAnswered = (i) => props.sections[i].questions.filter(q => props.responses[q.id] !== undefined).length
const getSectionProgress = (i) => Math.round((getSectionAnswered(i) / props.sections[i].questions.length) * 100)

const totalAnswered = computed(() => Object.keys(props.responses).length)
const globalScore   = computed(() => props.sections.reduce((sum, _, i) => sum + getSectionScore(i), 0))
const isComplete    = computed(() => totalAnswered.value === 20)
const getScoreColor = (score) => levelColors[score] || '#6b7280'

const emit = defineEmits(['section-changed', 'response-changed', 'show-results', 'reset-evaluator'])

function doReset() {
  showChangeConfirm.value = false
  emit('reset-evaluator')
}

function scrollToQuestion(idx) {
  const card = questionCards.value[idx]
  if (card && mainRef.value) {
    const cardTop = card.offsetTop - 24
    mainRef.value.scrollTo({ top: cardTop, behavior: 'smooth' })
  }
}

function onAnswer(questionId, value, qi) {
  emit('response-changed', questionId, value)
  // Auto-scroll to next question after a short delay
  if (qi < props.sections[props.currentSection].questions.length - 1) {
    setTimeout(() => scrollToQuestion(qi + 1), 200)
  }
}

function navigate(idx) {
  emit('section-changed', idx)
  nextTick(() => {
    if (mainRef.value) mainRef.value.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

watch(() => props.currentSection, () => {
  nextTick(() => {
    if (mainRef.value) mainRef.value.scrollTo({ top: 0, behavior: 'smooth' })
  })
})
</script>

<style scoped>
.diagnostic {
  display: flex;
  height: 100vh;
  background: #080c0a;
  color: #f0f2f0;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  overflow: hidden;
}

/* ─── Sidebar ─── */
.sidebar {
  width: 260px;
  flex-shrink: 0;
  background: #0d1410;
  border-right: 1px solid rgba(0,220,120,.1);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  transition: width .25s ease;
}
.sidebar-collapsed .sidebar { width: 60px; }

.sidebar-top {
  padding: 1.2rem 1rem;
  border-bottom: 1px solid rgba(0,220,120,.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
}
.sidebar-brand {
  font-size: .82rem;
  font-weight: 800;
  letter-spacing: .18em;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
}
.brand-bracket { color: rgba(0,220,120,.4); }
.brand-dash    { color: #00dc78; }

.collapse-btn {
  background: transparent;
  border: none;
  color: #788a80;
  cursor: pointer;
  padding: .3rem;
  border-radius: 3px;
  display: flex;
  align-items: center;
  transition: color .2s, background .2s;
  flex-shrink: 0;
}
.collapse-btn:hover { color: #00dc78; background: rgba(0,220,120,.08); }

.sidebar-evaluator {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .8rem 1rem;
  border-bottom: 1px solid rgba(0,220,120,.06);
  font-size: .78rem;
}
.sidebar-evaluator-mini {
  display: flex;
  justify-content: center;
  padding: .8rem 0;
  border-bottom: 1px solid rgba(0,220,120,.06);
}
.eval-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #00dc78;
  flex-shrink: 0;
  animation: pdot 2s infinite;
}
@keyframes pdot { 0%,100%{box-shadow:0 0 0 0 rgba(0,220,120,.5)} 50%{box-shadow:0 0 0 4px rgba(0,220,120,0)} }
.eval-name  { color: #c8d4cc; font-weight: 600; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.eval-change { background: transparent; border: none; color: #788a80; font-size: .7rem; cursor: pointer; transition: color .2s; padding: 0; flex-shrink: 0; }
.eval-change:hover { color: #00dc78; }

/* Nav */
.sidebar-nav { flex: 1; padding: .6rem 0; }

.nav-item {
  width: 100%;
  background: transparent;
  border: none;
  padding: .65rem 1rem;
  cursor: pointer;
  text-align: left;
  transition: background .2s;
  display: flex;
  flex-direction: column;
  gap: .35rem;
}
.sidebar-collapsed .nav-item { align-items: center; padding: .75rem 0; justify-content: center; }
.nav-item:hover  { background: rgba(255,255,255,.03); }
.nav-item.active { background: rgba(0,220,120,.06); }

.nav-item-left { display: flex; align-items: center; gap: .65rem; }
.sidebar-collapsed .nav-item-left { gap: 0; }

.nav-indicator {
  width: 26px; height: 26px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,.15);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all .2s;
  color: #788a80;
}
.nav-item.active .nav-indicator { border-color: #00dc78; background: rgba(0,220,120,.1); color: #00dc78; }
.nav-item.completed .nav-indicator { border-color: #00dc78; background: rgba(0,220,120,.15); }
.nav-check-icon { color: #00dc78; }
.nav-pillar-icon { }

.nav-info { display: flex; flex-direction: column; gap: .1rem; overflow: hidden; }
.nav-title { font-size: .8rem; font-weight: 600; color: #c8d4cc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nav-item.active .nav-title { color: #fff; }
.nav-score { font-size: .68rem; color: #788a80; }

.nav-bar-wrap { height: 2px; background: rgba(255,255,255,.06); border-radius: 1px; overflow: hidden; margin-left: 31px; }
.nav-bar-fill { height: 100%; border-radius: 1px; transition: width .4s ease; }

/* Sidebar bottom */
.sidebar-bottom {
  padding: .9rem 1rem;
  border-top: 1px solid rgba(0,220,120,.08);
  display: flex;
  flex-direction: column;
  gap: .8rem;
}
.global-mini { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: .4rem; }
.global-mini-label { font-size: .68rem; color: #788a80; letter-spacing: .08em; text-transform: uppercase; }
.global-mini-value { font-size: 1.1rem; font-weight: 800; color: #fff; }
.global-mini-value small { font-size: .6em; color: #788a80; }
.global-mini-bar { height: 3px; background: rgba(255,255,255,.06); border-radius: 2px; overflow: hidden; }
.global-mini-fill { height: 100%; background: linear-gradient(90deg, #00dc78, #00c8ff); border-radius: 2px; transition: width .5s ease; }

.score-mini-collapsed {
  text-align: center;
  font-size: .85rem;
  font-weight: 800;
  color: #00dc78;
}

.settings-btn {
  display: flex;
  align-items: center;
  gap: .5rem;
  background: transparent;
  border: 1px solid rgba(255,255,255,.08);
  color: #788a80;
  padding: .5rem .75rem;
  border-radius: 3px;
  cursor: pointer;
  font-size: .78rem;
  transition: all .2s;
  width: 100%;
  justify-content: center;
}
.settings-btn:hover { color: #00dc78; border-color: rgba(0,220,120,.3); background: rgba(0,220,120,.05); }

/* ─── Main ─── */
.diagnostic-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
}

.section-header {
  padding: 2rem 2.5rem 1.5rem;
  border-bottom: 1px solid rgba(0,220,120,.08);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
}
.section-tag { font-size: .68rem; letter-spacing: .15em; font-weight: 700; display: block; margin-bottom: .3rem; }
.section-meta h2 { font-size: 1.4rem; font-weight: 800; color: #fff; margin: 0; }
.section-progress-info { text-align: right; }
.answered-count { display: block; font-size: .75rem; color: #788a80; margin-bottom: .4rem; }
.section-progress-bar { width: 140px; height: 3px; background: rgba(255,255,255,.06); border-radius: 2px; overflow: hidden; }
.section-progress-fill { height: 100%; border-radius: 2px; transition: width .4s ease; }

/* Questions */
.questions-list { flex: 1; padding: 2rem 2.5rem; display: flex; flex-direction: column; gap: 1.5rem; }

.question-card {
  background: #0d1410;
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 4px;
  padding: 1.5rem;
  transition: border-color .2s;
}
.question-card.answered { border-color: rgba(0,220,120,.2); }

.question-top { display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.2rem; }
.question-num {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  display: flex; align-items: center; justify-content: center;
  font-size: .78rem; font-weight: 700; color: #788a80;
  flex-shrink: 0;
}
.question-card.answered .question-num { background: rgba(0,220,120,.1); border-color: rgba(0,220,120,.3); color: #00dc78; }
.question-body { flex: 1; }
.question-body h3 { font-size: .95rem; font-weight: 700; color: #fff; margin-bottom: .4rem; line-height: 1.4; }
.question-help { display: flex; align-items: flex-start; gap: .4rem; font-size: .78rem; color: #788a80; line-height: 1.5; }
.help-icon { color: #00dc78; flex-shrink: 0; margin-top: 2px; }
.question-badge { padding: .25rem .6rem; border-radius: 2px; font-size: .72rem; font-weight: 700; color: #080c0a; flex-shrink: 0; }

.options-list { display: flex; flex-direction: column; gap: .5rem; }
.option { display: block; cursor: pointer; }
.option input { display: none; }
.option-content {
  display: flex; justify-content: space-between; align-items: center;
  padding: .7rem 1rem;
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 3px;
  transition: all .18s;
  gap: 1rem;
}
.option:hover .option-content { border-color: rgba(0,220,120,.25); background: rgba(0,220,120,.04); }
.option.selected .option-content { border-color: #00dc78; background: rgba(0,220,120,.08); }
.option-left { display: flex; align-items: center; gap: .75rem; flex: 1; }
.option-radio {
  width: 14px; height: 14px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,.2);
  flex-shrink: 0;
  transition: all .18s;
}
.option.selected .option-radio { border-color: #00dc78; background: #00dc78; box-shadow: 0 0 8px rgba(0,220,120,.4); }
.option-text { font-size: .83rem; color: #c8d4cc; line-height: 1.4; }
.option.selected .option-text { color: #fff; }
.option-right { display: flex; align-items: center; gap: .6rem; flex-shrink: 0; }
.option-pts { font-size: .7rem; color: #788a80; font-weight: 600; }
.option-level { font-size: .68rem; font-weight: 700; letter-spacing: .06em; min-width: 52px; text-align: right; }

.scroll-next-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: .8rem auto 0;
  width: 28px; height: 28px;
  border-radius: 50%;
  background: rgba(0,220,120,.08);
  border: 1px solid rgba(0,220,120,.2);
  color: #00dc78;
  cursor: pointer;
  transition: all .2s;
  animation: bounce 2s infinite;
}
.scroll-next-btn:hover {
  background: rgba(0,220,120,.18);
  border-color: #00dc78;
  transform: translateY(2px);
  animation: none;
}
@keyframes bounce {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(4px); }
}

/* Nav footer */
.nav-footer {
  display: flex; align-items: center; gap: 1.5rem;
  padding: 1.5rem 2.5rem;
  border-top: 1px solid rgba(0,220,120,.08);
  background: #0d1410;
}
.nav-btn {
  display: flex; align-items: center; gap: .4rem;
  padding: .7rem 1.4rem;
  border-radius: 2px;
  font-size: .85rem; font-weight: 600;
  cursor: pointer; transition: all .2s; border: none; flex-shrink: 0;
}
.nav-prev { background: transparent; border: 1px solid rgba(255,255,255,.1); color: #8a9e92; }
.nav-prev:hover:not(:disabled) { color: #fff; border-color: rgba(255,255,255,.3); }
.nav-prev:disabled { opacity: .3; cursor: not-allowed; }
.nav-next { background: rgba(0,220,120,.12); border: 1px solid rgba(0,220,120,.3); color: #00dc78; }
.nav-next:hover { background: rgba(0,220,120,.2); }
.nav-finish { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); color: #788a80; }
.nav-finish.ready { background: #00dc78; border-color: #00dc78; color: #080c0a; animation: pulse-btn 2s infinite; }
.nav-finish.ready:hover { background: #00ff8c; box-shadow: 0 0 24px rgba(0,220,120,.4); }
.nav-finish:disabled:not(.ready) { cursor: not-allowed; }
@keyframes pulse-btn { 0%,100%{box-shadow:0 0 0 0 rgba(0,220,120,.4)} 50%{box-shadow:0 0 0 8px rgba(0,220,120,0)} }

.nav-center { flex: 1; }
.total-progress { display: block; font-size: .72rem; color: #788a80; margin-bottom: .3rem; text-align: center; }
.total-bar { height: 3px; background: rgba(255,255,255,.06); border-radius: 2px; overflow: hidden; }
.total-fill { height: 100%; background: linear-gradient(90deg, #00dc78, #00c8ff); border-radius: 2px; transition: width .4s ease; }

/* ─── Confirm overlay ─── */
.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 400;
  background: rgba(0,0,0,.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.confirm-box {
  background: #0d1410;
  border: 1px solid rgba(0,220,120,.25);
  border-radius: 6px;
  padding: 1.6rem 1.8rem;
  width: 280px;
  animation: cfadeIn .18s ease;
}
@keyframes cfadeIn {
  from { opacity: 0; transform: scale(.95); }
  to   { opacity: 1; transform: scale(1); }
}
.confirm-title { font-size: .95rem; font-weight: 700; color: #fff; margin-bottom: .4rem; }
.confirm-sub   { font-size: .8rem; color: #788a80; margin-bottom: 1.2rem; }
.confirm-actions { display: flex; gap: .7rem; justify-content: flex-end; }
.confirm-cancel {
  background: transparent;
  border: 1px solid rgba(255,255,255,.12);
  color: #8a9e92; padding: .45rem 1rem;
  border-radius: 2px; cursor: pointer; font-size: .82rem; transition: all .2s;
}
.confirm-cancel:hover { color: #fff; border-color: rgba(255,255,255,.3); }
.confirm-ok {
  background: #00dc78; border: none;
  color: #080c0a; padding: .45rem 1rem;
  border-radius: 2px; cursor: pointer; font-size: .82rem; font-weight: 700; transition: all .2s;
}
.confirm-ok:hover { background: #00ff8c; }

/* Responsive */
@media (max-width: 768px) {
  .diagnostic { flex-direction: column; }
  .sidebar { width: 100% !important; height: auto; position: static; flex-direction: row; overflow-x: auto; border-right: none; border-bottom: 1px solid rgba(0,220,120,.1); }
  .sidebar-top { display: none; }
  .sidebar-evaluator { display: none; }
  .sidebar-nav { display: flex; flex-direction: row; padding: 0; flex: 1; }
  .sidebar-bottom { display: none; }
  .nav-item { min-width: 80px; padding: .8rem .5rem; align-items: center; }
  .nav-info { display: none; }
  .nav-bar-wrap { display: none; }
  .section-header { padding: 1.2rem; }
  .questions-list { padding: 1.2rem; }
  .nav-footer { padding: 1rem 1.2rem; gap: .8rem; }
}
</style>
