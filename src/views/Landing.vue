<template>
  <div class="landing">

    <!-- Nav -->
    <nav class="nav">
      <div class="nav-logo">
        <span class="nav-logo-bracket">[</span>
        SEC<span class="nav-logo-accent">—</span>GROW
        <span class="nav-logo-bracket">]</span>
      </div>
      <div class="nav-status">
        <span class="status-dot"></span>
        <span class="status-text">FRAMEWORK ACTIF</span>
      </div>
      <button class="nav-cta" @click="goToDiagnostic">
        Démarrer l'évaluation <span class="nav-cta-arrow">→</span>
      </button>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="grid-bg"></div>
      <div class="particles">
        <span v-for="n in 24" :key="n" class="particle" :style="particleStyle(n)"></span>
      </div>
      <div class="scan-line scan-1"></div>
      <div class="scan-line scan-2"></div>

      <div class="hero-content">
        <div class="hero-tag">
          <span class="tag-dot"></span>
          Framework de Maturité Cybersécurité · v2.0
        </div>

        <h1 class="hero-title">
          <span class="line-1">Votre startup grandit.</span>
          <span class="line-2">Vos risques <span class="typewriter" ref="typewriterEl"></span></span>
        </h1>

        <p class="hero-sub">
          SEC-GROW évalue votre maturité sécuritaire en 20 questions structurées
          autour de 4 piliers. Obtenez un diagnostic actionnable en 30 minutes.
        </p>

        <div class="hero-actions">
          <button class="btn-primary" @click="goToDiagnostic">
            <span>▶</span> Démarrer mon diagnostic
          </button>
          <a class="btn-ghost" href="#framework">Découvrir le framework</a>
        </div>

        <div class="hero-stats">
          <div class="stat">
            <span class="stat-val" ref="s1">0</span>
            <span class="stat-lbl">Questions</span>
          </div>
          <span class="stat-sep">·</span>
          <div class="stat">
            <span class="stat-val" ref="s2">0</span>
            <span class="stat-lbl">Piliers</span>
          </div>
          <span class="stat-sep">·</span>
          <div class="stat">
            <span class="stat-val" ref="s3">0</span>
            <span class="stat-lbl">Niveaux</span>
          </div>
          <span class="stat-sep">·</span>
          <div class="stat">
            <span class="stat-val">30<small>min</small></span>
            <span class="stat-lbl">Durée</span>
          </div>
        </div>
      </div>

      <div class="hero-terminal">
        <div class="term-header">
          <span class="td red"></span><span class="td orange"></span><span class="td green"></span>
          <span class="term-title">sec-grow — diagnostic.sh</span>
        </div>
        <div class="term-body">
          <div class="tl"><span class="tp">$</span> <span class="tc">sec-grow init --company</span></div>
          <div class="tl to">✓ Framework SEC-GROW v2.0 chargé</div>
          <div class="tl to">✓ 4 piliers détectés</div>
          <div class="tl to">✓ 20 questions prêtes</div>
          <div class="tl"><span class="tp">$</span> <span class="tc">sec-grow assess --pillar all</span></div>
          <div class="tl to tg">▋ En attente de votre évaluation...</div>
        </div>
      </div>
    </section>

    <!-- Section Framework -->
    <section class="section-framework" id="framework">
      <div class="section-inner">
        <div class="section-tag">[ 01 ]</div>
        <h2 class="section-title">Pourquoi SEC-GROW ?</h2>
        <p class="section-sub">Un framework conçu pour les startups qui veulent structurer leur sécurité sans complexité inutile.</p>

        <div class="why-grid">
          <div class="why-card" v-for="(item, i) in whyItems" :key="i">
            <div class="why-num">[ 0{{ i+1 }} ]</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Piliers -->
    <section class="section-pillars">
      <div class="section-inner">
        <div class="section-tag">[ 02 ]</div>
        <h2 class="section-title">Les 4 Piliers SEC-GROW</h2>
        <p class="section-sub">Chaque pilier couvre un domaine critique de votre posture sécuritaire.</p>

        <div class="pillars-grid">
          <div class="pillar-card" v-for="p in pillars" :key="p.id" :style="{'--pc': p.color}">
            <div class="pillar-icon">{{ p.icon }}</div>
            <h3>{{ p.title }}</h3>
            <p>{{ p.desc }}</p>
            <div class="pillar-count">5 questions</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Niveaux -->
    <section class="section-levels">
      <div class="section-inner">
        <div class="section-tag">[ 03 ]</div>
        <h2 class="section-title">5 Niveaux de Maturité</h2>
        <p class="section-sub">De l'absence totale de structure à la sécurité comme avantage compétitif.</p>

        <div class="levels-timeline">
          <div class="level-item" v-for="(lvl, i) in levels" :key="i" :style="{'--lc': lvl.color}">
            <div class="level-dot"></div>
            <div class="level-content">
              <div class="level-name">{{ lvl.name }}</div>
              <div class="level-range">{{ lvl.range }}</div>
              <div class="level-desc">{{ lvl.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="section-cta">
      <div class="cta-grid-bg"></div>
      <div class="section-inner cta-inner">
        <div class="cta-badge">
          <span class="status-dot"></span> DIAGNOSTIC GRATUIT
        </div>
        <h2 class="cta-title">Prêt à mesurer votre maturité ?</h2>
        <p class="cta-sub">30 minutes. 20 questions. Un rapport complet avec vos normes applicables et vos recommandations prioritaires.</p>
        <button class="btn-primary btn-large" @click="goToDiagnostic">
          <span>▶</span> Démarrer maintenant
        </button>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const typewriterEl = ref(null)
const s1 = ref(null)
const s2 = ref(null)
const s3 = ref(null)

const whyItems = [
  { title: 'Structuré pour les startups', desc: 'Conçu pour des équipes de 2 à 50 personnes. Pas de jargon inutile, des questions concrètes adaptées à votre réalité.' },
  { title: 'Résultats actionnables', desc: 'Chaque réponse génère un score, un niveau de maturité et des recommandations priorisées. Pas de rapport creux.' },
  { title: 'Conformité intégrée', desc: 'Détection automatique des normes applicables (RGPD, DORA, NIS2, SOC2...) selon votre secteur et votre zone géographique.' },
]

const pillars = [
  { id: 'gov', icon: '🏛', title: 'Gouvernance', desc: 'Politique de sécurité, responsabilités, budget, formation et intégration dans les décisions business.', color: '#00c8ff' },
  { id: 'tec', icon: '🛡', title: 'Technique', desc: 'Authentification, gestion des vulnérabilités, sécurité du code, protection des données et monitoring.', color: '#00dc78' },
  { id: 'pro', icon: '📋', title: 'Processus', desc: 'Gestion des incidents, évaluation des tiers, conformité, continuité d\'activité et tests réguliers.', color: '#8b5cf6' },
  { id: 'cul', icon: '👥', title: 'Culture', desc: 'Engagement de la direction, collaboration, signalement, reconnaissance et partage de connaissances.', color: '#f59e0b' },
]

const levels = [
  { name: 'Ad Hoc',   range: '0 – 16 pts',  desc: 'Sécurité non structurée, réactive.',              color: '#ef4444' },
  { name: 'Bronze',   range: '17 – 35 pts', desc: 'Bases établies, efforts ponctuels.',               color: '#f97316' },
  { name: 'Silver',   range: '36 – 55 pts', desc: 'Sécurité organisée et suivie.',                    color: '#94a3b8' },
  { name: 'Gold',     range: '56 – 70 pts', desc: 'Sécurité intégrée aux processus métier.',          color: '#eab308' },
  { name: 'Platinum', range: '71 – 80 pts', desc: 'Sécurité différenciante, avantage compétitif.',    color: '#8b5cf6' },
]

function goToDiagnostic() {
  router.push('/diagnostic')
}

function particleStyle(n) {
  const s = n * 137.508
  return {
    left: `${s % 100}%`,
    top: `${(s * 1.3) % 100}%`,
    animationDelay: `${(n % 5) * 0.8}s`,
    animationDuration: `${4 + (n % 4)}s`,
    width: `${1 + (n % 3)}px`,
    height: `${1 + (n % 3)}px`,
  }
}

function countUp(el, target) {
  if (!el) return
  const start = performance.now()
  const tick = (now) => {
    const p = Math.min((now - start) / 1200, 1)
    el.textContent = Math.round(p * target)
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function startTypewriter() {
  const words = ['aussi.', 'explosent.', 'vous exposent.', 'aussi.']
  let wi = 0, ci = 0, del = false
  const el = typewriterEl.value
  if (!el) return
  const tick = () => {
    const w = words[wi]
    if (!del) {
      el.textContent = w.slice(0, ++ci)
      if (ci === w.length) { del = true; setTimeout(tick, 1800); return }
    } else {
      el.textContent = w.slice(0, --ci)
      if (ci === 0) { del = false; wi = (wi + 1) % words.length }
    }
    setTimeout(tick, del ? 55 : 95)
  }
  tick()
}

onMounted(() => {
  setTimeout(() => {
    countUp(s1.value, 20)
    countUp(s2.value, 4)
    countUp(s3.value, 5)
    startTypewriter()
  }, 500)

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
  }, { threshold: 0.15 })
  document.querySelectorAll('.why-card, .pillar-card, .level-item').forEach(el => observer.observe(el))
})
</script>

<style scoped>
/* ─── Reset & base ─── */
* { box-sizing: border-box; margin: 0; padding: 0; }
.landing {
  background: #080c0a;
  color: #f0f2f0;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ─── Nav ─── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 2.5rem;
  background: rgba(8,12,10,0.88);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(0,220,120,0.1);
}
.nav-logo { font-size: 1rem; font-weight: 800; letter-spacing: 0.18em; color: #fff; }
.nav-logo-bracket { color: rgba(0,220,120,0.4); }
.nav-logo-accent  { color: #00dc78; }
.nav-status { display: flex; align-items: center; gap: 0.5rem; font-size: 0.68rem; letter-spacing: 0.12em; color: #788a80; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: #00dc78; animation: pdot 2s infinite; }
@keyframes pdot { 0%,100%{box-shadow:0 0 0 0 rgba(0,220,120,.5)} 50%{box-shadow:0 0 0 5px rgba(0,220,120,0)} }
.nav-cta {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1.1rem;
  background: transparent; border: 1px solid rgba(0,220,120,0.45);
  color: #00dc78; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.04em;
  cursor: pointer; border-radius: 2px; transition: all .22s;
}
.nav-cta:hover { background: rgba(0,220,120,.1); border-color: #00dc78; box-shadow: 0 0 18px rgba(0,220,120,.2); }
.nav-cta-arrow { transition: transform .2s; }
.nav-cta:hover .nav-cta-arrow { transform: translateX(3px); }

/* ─── Hero ─── */
.hero {
  position: relative; min-height: 100vh;
  display: flex; align-items: center; gap: 3rem;
  padding: 7rem 2.5rem 4rem; overflow: hidden;
}
.grid-bg {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(0,220,120,.04) 60px),
    repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(0,220,120,.04) 60px);
}
.particles { position: absolute; inset: 0; pointer-events: none; }
.particle {
  position: absolute; border-radius: 50%; background: #00dc78; opacity: 0.25;
  animation: fp linear infinite;
}
@keyframes fp { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-28px) scale(1.4)} }
.scan-line {
  position: absolute; left: 0; right: 0; height: 1px; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(0,220,120,.35), transparent);
}
.scan-1 { animation: scan 9s linear infinite; }
.scan-2 { animation: scan 13s linear infinite 5s; }
@keyframes scan { 0%{top:-2px;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100%;opacity:0} }

.hero-content { position: relative; z-index: 2; flex: 1; max-width: 600px; }

.hero-tag {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-size: 0.7rem; letter-spacing: 0.1em; color: #788a80;
  border: 1px solid rgba(0,220,120,.18); padding: 0.3rem 0.75rem;
  border-radius: 2px; margin-bottom: 1.8rem;
  animation: fadeup .8s ease both;
}
.tag-dot { width: 5px; height: 5px; border-radius: 50%; background: #00dc78; }

.hero-title {
  font-size: clamp(2rem, 4.5vw, 3.4rem); font-weight: 800;
  line-height: 1.1; letter-spacing: -.02em; margin-bottom: 1.4rem;
}
.line-1 { display: block; color: #b0c0b8; animation: fadeup .8s ease .1s both; }
.line-2 { display: block; color: #fff; animation: fadeup .8s ease .2s both; }
.typewriter {
  color: #00dc78;
  border-right: 2px solid #00dc78;
  padding-right: 2px;
  animation: blink .8s step-end infinite;
}
@keyframes blink { 50%{border-color:transparent} }

.hero-sub {
  font-size: .95rem; color: #8a9e92; line-height: 1.75;
  max-width: 480px; margin-bottom: 2.2rem;
  animation: fadeup .8s ease .3s both;
}

.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.8rem; animation: fadeup .8s ease .4s both; }

.btn-primary {
  display: flex; align-items: center; gap: 0.6rem;
  padding: .85rem 1.8rem; background: #00dc78; color: #080c0a;
  font-weight: 700; font-size: .88rem; border: none; cursor: pointer;
  border-radius: 2px; transition: all .22s; letter-spacing: .03em;
}
.btn-primary:hover { background: #00ff8c; box-shadow: 0 0 28px rgba(0,220,120,.4); transform: translateY(-1px); }
.btn-large { padding: 1rem 2.4rem; font-size: 1rem; }

.btn-ghost {
  display: flex; align-items: center; padding: .85rem 1.4rem;
  background: transparent; color: #8a9e92; font-size: .88rem;
  border: 1px solid rgba(255,255,255,.1); cursor: pointer;
  border-radius: 2px; text-decoration: none; transition: all .22s;
}
.btn-ghost:hover { color: #fff; border-color: rgba(255,255,255,.3); }

.hero-stats { display: flex; align-items: center; gap: 1.4rem; animation: fadeup .8s ease .5s both; }
.stat { text-align: center; }
.stat-val { display: block; font-size: 1.5rem; font-weight: 800; color: #fff; }
.stat-val small { font-size: .65em; }
.stat-lbl { display: block; font-size: .62rem; letter-spacing: .1em; color: #788a80; text-transform: uppercase; }
.stat-sep { color: rgba(0,220,120,.3); font-size: 1.1rem; }

/* Terminal */
.hero-terminal {
  position: relative; z-index: 2; flex-shrink: 0; width: 320px;
  background: #0d1410; border: 1px solid rgba(0,220,120,.18);
  border-radius: 6px; overflow: hidden;
  box-shadow: 0 0 50px rgba(0,220,120,.07), 0 20px 50px rgba(0,0,0,.5);
  animation: fadeup .8s ease .6s both;
}
.term-header {
  display: flex; align-items: center; gap: .4rem;
  padding: .65rem 1rem; background: #141a16;
  border-bottom: 1px solid rgba(0,220,120,.1);
}
.td { width: 10px; height: 10px; border-radius: 50%; }
.td.red    { background: #ff5f57; }
.td.orange { background: #febc2e; }
.td.green  { background: #28c840; }
.term-title { margin-left: .5rem; font-size: .68rem; color: #788a80; letter-spacing: .05em; }
.term-body { padding: .9rem 1.1rem; font-family: 'Fira Code','Courier New',monospace; font-size: .76rem; line-height: 1.9; }
.tl { display: flex; gap: .5rem; }
.tp { color: #00dc78; }
.tc { color: #c8d4cc; }
.to { color: #788a80; padding-left: 1rem; }
.tg { color: #00dc78; animation: blink 1.2s step-end infinite; }

/* ─── Sections communes ─── */
.section-inner { max-width: 1100px; margin: 0 auto; padding: 0 2.5rem; }
.section-tag { font-size: .7rem; letter-spacing: .15em; color: #00dc78; margin-bottom: .8rem; font-weight: 700; }
.section-title { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 800; color: #fff; margin-bottom: .8rem; }
.section-sub { font-size: .95rem; color: #8a9e92; max-width: 520px; line-height: 1.7; margin-bottom: 3rem; }

/* ─── Pourquoi ─── */
.section-framework { padding: 6rem 0; border-top: 1px solid rgba(0,220,120,.08); }
.why-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.why-card {
  background: #0d1410; border: 1px solid rgba(0,220,120,.12);
  padding: 2rem; border-radius: 4px;
  opacity: 0; transform: translateY(24px);
  transition: opacity .6s ease, transform .6s ease, border-color .25s;
}
.why-card.visible { opacity: 1; transform: translateY(0); }
.why-card:hover { border-color: rgba(0,220,120,.35); }
.why-num { font-size: .68rem; letter-spacing: .15em; color: #00dc78; margin-bottom: .8rem; font-weight: 700; }
.why-card h3 { font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: .6rem; }
.why-card p  { font-size: .85rem; color: #8a9e92; line-height: 1.7; }

/* ─── Piliers ─── */
.section-pillars { padding: 6rem 0; background: #060a08; }
.pillars-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.5rem; }
.pillar-card {
  background: #0d1410; border: 1px solid rgba(255,255,255,.06);
  border-top: 2px solid var(--pc); padding: 1.8rem; border-radius: 4px;
  opacity: 0; transform: translateY(24px);
  transition: opacity .6s ease, transform .6s ease, box-shadow .25s;
}
.pillar-card.visible { opacity: 1; transform: translateY(0); }
.pillar-card:hover { box-shadow: 0 0 24px rgba(0,0,0,.4), 0 0 0 1px var(--pc); }
.pillar-icon { font-size: 1.8rem; margin-bottom: 1rem; }
.pillar-card h3 { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: .5rem; }
.pillar-card p  { font-size: .82rem; color: #8a9e92; line-height: 1.65; margin-bottom: 1rem; }
.pillar-count { font-size: .68rem; letter-spacing: .1em; color: var(--pc); font-weight: 600; }

/* ─── Niveaux ─── */
.section-levels { padding: 6rem 0; }
.levels-timeline { display: flex; gap: 0; position: relative; }
.levels-timeline::before {
  content: ''; position: absolute; top: 10px; left: 10px; right: 10px; height: 1px;
  background: linear-gradient(90deg, #ef4444, #f97316, #94a3b8, #eab308, #8b5cf6);
}
.level-item {
  flex: 1; padding-top: 2.5rem; padding-right: 1rem; position: relative;
  opacity: 0; transform: translateY(20px);
  transition: opacity .6s ease, transform .6s ease;
}
.level-item.visible { opacity: 1; transform: translateY(0); }
.level-dot {
  position: absolute; top: 4px; left: 0;
  width: 12px; height: 12px; border-radius: 50%;
  background: var(--lc); box-shadow: 0 0 10px var(--lc);
}
.level-name  { font-size: .9rem; font-weight: 800; color: var(--lc); margin-bottom: .2rem; }
.level-range { font-size: .68rem; color: #788a80; letter-spacing: .06em; margin-bottom: .4rem; }
.level-desc  { font-size: .78rem; color: #8a9e92; line-height: 1.5; }

/* ─── CTA Final ─── */
.section-cta {
  position: relative; padding: 7rem 0;
  border-top: 1px solid rgba(0,220,120,.08);
  text-align: center; overflow: hidden;
}
.cta-grid-bg {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,220,120,.03) 40px),
    repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,220,120,.03) 40px);
}
.cta-inner { position: relative; z-index: 1; }
.cta-badge {
  display: inline-flex; align-items: center; gap: .5rem;
  font-size: .68rem; letter-spacing: .14em; color: #00dc78;
  border: 1px solid rgba(0,220,120,.25); padding: .3rem .8rem;
  border-radius: 2px; margin-bottom: 1.5rem;
}
.cta-title { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; color: #fff; margin-bottom: 1rem; }
.cta-sub { font-size: .95rem; color: #8a9e92; max-width: 480px; margin: 0 auto 2.5rem; line-height: 1.7; }

/* ─── Animations ─── */
@keyframes fadeup { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

/* ─── Responsive ─── */
@media (max-width: 900px) {
  .hero { flex-direction: column; padding-top: 6rem; }
  .hero-terminal { width: 100%; max-width: 420px; }
  .nav-status { display: none; }
  .levels-timeline { flex-direction: column; gap: 2rem; }
  .levels-timeline::before { display: none; }
  .level-item { padding-top: 0; padding-left: 1.8rem; }
  .level-dot { top: 2px; }
}
@media (max-width: 480px) {
  .nav { padding: 1rem 1.2rem; }
  .hero { padding: 5rem 1.2rem 3rem; }
  .section-inner { padding: 0 1.2rem; }
}
</style>
