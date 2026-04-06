import { jsPDF } from 'jspdf'
import { getApplicableRegulations, getSecGrowCoverage } from '@/data/regulations'

// ─── Dimensions & marges ────────────────────────────────────────────────────
const PW = 210        // page width mm
const PH = 297        // page height mm
const ML = 14         // margin left
const MR = 14         // margin right
const CW = PW - ML - MR  // content width = 182mm
const FOOTER_Y = PH - 20 // y du footer
const SAFE_BOTTOM = PH - 28 // y max avant footer

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  black:    [8,   12,  10],
  darkGray: [22,  28,  24],
  midGray:  [48,  54,  50],
  gray:     [90,  96,  92],
  silver:   [140, 146, 142],
  offWhite: [220, 224, 220],
  white:    [248, 250, 248],
  green:    [0,   210, 110],
  greenDim: [0,   140, 75],
  cyan:     [0,   190, 210],
  red:      [210, 55,  55],
  orange:   [225, 135, 35],
  yellow:   [210, 180, 35],
  purple:   [135, 85,  215],
}

const MATURITY_COLORS = {
  'Ad Hoc':   C.red,
  'Bronze':   C.orange,
  'Silver':   C.silver,
  'Gold':     C.yellow,
  'Platinum': C.purple,
}

const PILLAR_COLORS = {
  governance: C.cyan,
  technical:  C.green,
  processes:  C.purple,
  culture:    C.orange,
}

const PILLAR_LABELS = {
  governance: 'Gouvernance',
  technical:  'Technique',
  processes:  'Processus',
  culture:    'Culture',
}

// ─── Helpers de base ────────────────────────────────────────────────────────
const setFill   = (doc, c) => doc.setFillColor(...c)
const setStroke = (doc, c) => doc.setDrawColor(...c)
const setTxt    = (doc, c) => doc.setTextColor(...c)

function fillRect(doc, x, y, w, h, color) {
  setFill(doc, color)
  doc.rect(x, y, w, h, 'F')
}

function drawLine(doc, x1, y1, x2, y2, color, lw = 0.3) {
  setStroke(doc, color)
  doc.setLineWidth(lw)
  doc.line(x1, y1, x2, y2)
}

function s(t) {
  if (!t) return ''
  return String(t)
    .replace(/[\u00e0\u00e2\u00e4]/g,'a').replace(/[\u00c0\u00c2\u00c4]/g,'A')
    .replace(/[\u00e9\u00e8\u00ea\u00eb]/g,'e').replace(/[\u00c9\u00c8\u00ca\u00cb]/g,'E')
    .replace(/[\u00ee\u00ef]/g,'i').replace(/[\u00ce\u00cf]/g,'I')
    .replace(/[\u00f4\u00f6]/g,'o').replace(/[\u00d4\u00d6]/g,'O')
    .replace(/[\u00f9\u00fb\u00fc]/g,'u').replace(/[\u00d9\u00db\u00dc]/g,'U')
    .replace(/\u00e7/g,'c').replace(/\u00c7/g,'C')
    .replace(/\u0153/g,'oe').replace(/\u0152/g,'OE')
    .replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d\u00ab\u00bb]/g,'"')
    .replace(/[\u2013\u2014]/g,'-').replace(/\u2026/g,'...')
    .replace(/\u2192/g,'->').replace(/[\u2713\u25b2]/g,'*')
}

function txt(doc, text, x, y, size, color, align = 'left', bold = false) {
  doc.setFontSize(size)
  doc.setFont('helvetica', bold ? 'bold' : 'normal')
  setTxt(doc, color)
  doc.text(s(String(text)), x, y, { align })
}

function wrapLines(doc, text, maxW, size) {
  doc.setFontSize(size)
  return doc.splitTextToSize(s(String(text)), maxW)
}

// ─── Composants réutilisables ────────────────────────────────────────────────

function pageHeader(doc, companyName, sectionLabel, mc) {
  fillRect(doc, 0, 0, PW, PH, C.black)
  fillRect(doc, 0, 0, 3, PH, mc)
  fillRect(doc, 0, 0, PW, 26, C.darkGray)
  txt(doc, 'SEC-GROW', ML, 11, 8, C.green, 'left', true)
  txt(doc, companyName.toUpperCase(), ML, 21, 12, C.white, 'left', true)
  txt(doc, sectionLabel, PW - MR, 16, 7.5, C.silver, 'right', true)
}

function pageFooter(doc, pageNum, totalPages, companyName) {
  drawLine(doc, ML, FOOTER_Y, PW - MR, FOOTER_Y, C.midGray, 0.2)
  txt(doc, 'SEC-GROW Framework — Rapport de Maturité Cybersécurité', ML, FOOTER_Y + 5, 6.5, C.silver)
  txt(doc, companyName, PW / 2, FOOTER_Y + 5, 6.5, C.silver, 'center')
  txt(doc, `${pageNum} / ${totalPages}`, PW - MR, FOOTER_Y + 5, 6.5, C.silver, 'right')
}

function sectionTitle(doc, text, y) {
  txt(doc, text.toUpperCase(), ML, y, 7, C.green, 'left', true)
  drawLine(doc, ML, y + 2, PW - MR, y + 2, C.greenDim, 0.4)
  return y + 10
}

// Nouvelle page avec header standard
function addPage(doc, data, label) {
  doc.addPage()
  pageHeader(doc, data.companyName, label, MATURITY_COLORS[data.maturityLevel.name] || C.green)
  return 34  // y de départ après header
}

// Vérifie si on a assez de place, sinon nouvelle page
function checkY(doc, y, needed, data, label, pageNumRef) {
  if (y + needed > SAFE_BOTTOM) {
    pageFooter(doc, pageNumRef.n, 99, data.companyName)
    pageNumRef.n++
    return addPage(doc, data, label + ' (suite)')
  }
  return y
}

// ─── Helpers métier ──────────────────────────────────────────────────────────
function getPillarMaturity(score) {
  if (score <= 4)  return 'Ad Hoc'
  if (score <= 9)  return 'Bronze'
  if (score <= 14) return 'Silver'
  if (score <= 17) return 'Gold'
  return 'Platinum'
}

function getInterpretation(levelName) {
  const map = {
    'Ad Hoc':   'Sécurité non structurée. Des fondations solides doivent être posées en priorité.',
    'Bronze':   'Bases en place mais insuffisantes. Un effort structuré permettra de progresser rapidement.',
    'Silver':   'Sécurité organisée et suivie. L\'enjeu est d\'intégrer la sécurité dans les processus métier.',
    'Gold':     'Sécurité bien intégrée. Les efforts doivent porter sur l\'optimisation et la mesure continue.',
    'Platinum': 'Sécurité différenciante. L\'entreprise peut la démontrer à ses clients et partenaires.',
  }
  return map[levelName] || ''
}

export { C, MATURITY_COLORS, PILLAR_COLORS, PILLAR_LABELS, getPillarMaturity, pageFooter, sectionTitle, fillRect, drawLine, txt }

// ─── PAGE 1 : Couverture ─────────────────────────────────────────────────────
function drawCover(doc, data) {
  const mc = MATURITY_COLORS[data.maturityLevel.name] || C.green

  fillRect(doc, 0, 0, PW, PH, C.black)
  fillRect(doc, 0, 0, 3, PH, mc)

  // Grille subtile
  doc.setLineWidth(0.1)
  setStroke(doc, [18, 24, 20])
  for (let x = 12; x < PW; x += 14) doc.line(x, 0, x, PH)
  for (let y = 12; y < PH; y += 14) doc.line(0, y, PW, y)

  // Badge confidentiel
  fillRect(doc, PW - 52, 10, 40, 7, C.midGray)
  txt(doc, 'CONFIDENTIEL', PW - 32, 15, 6, C.silver, 'center', true)

  // Tag
  txt(doc, '[ SEC-GROW FRAMEWORK ]', ML, 28, 7.5, C.green, 'left', true)

  // Titre
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  setTxt(doc, C.white)
  doc.text('Rapport de Maturité', ML, 55)
  doc.text('Cybersécurité', ML, 70)
  fillRect(doc, ML, 75, 55, 1.5, mc)

  // Infos entreprise
  txt(doc, data.companyName.toUpperCase(), ML, 92, 16, mc, 'left', true)
  txt(doc, `Évalué par : ${data.evaluatorRole}`, ML, 104, 9, C.offWhite)
  txt(doc, new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }), ML, 113, 8, C.silver)

  // Score donut simplifié
  const cx = 158, cy = 128, r = 26
  doc.setFillColor(...C.darkGray)
  doc.circle(cx, cy, r + 3, 'F')

  const progress = data.globalScore / 80
  doc.setLineWidth(3)
  setStroke(doc, mc)
  const segs = 60
  for (let i = 0; i < segs * progress; i++) {
    const a1 = -Math.PI / 2 + (i / segs) * 2 * Math.PI
    const a2 = -Math.PI / 2 + ((i + 1) / segs) * 2 * Math.PI
    doc.line(cx + r * Math.cos(a1), cy + r * Math.sin(a1), cx + r * Math.cos(a2), cy + r * Math.sin(a2))
  }
  doc.setFillColor(...C.black)
  doc.circle(cx, cy, r - 3, 'F')
  txt(doc, String(data.globalScore), cx, cy + 2, 20, C.white, 'center', true)
  txt(doc, '/ 80', cx, cy + 9, 7.5, C.silver, 'center')

  fillRect(doc, cx - 22, cy + 14, 44, 9, mc)
  txt(doc, data.maturityLevel.name.toUpperCase(), cx, cy + 20, 7, C.black, 'center', true)

  // Piliers en bas
  const pillars = Object.entries(data.pillarScores)
  const colW = CW / pillars.length
  fillRect(doc, 0, PH - 62, PW, 62, C.darkGray)
  drawLine(doc, 0, PH - 62, PW, PH - 62, mc, 0.5)
  txt(doc, 'SCORES PAR PILIER', PW / 2, PH - 53, 6.5, C.green, 'center', true)

  pillars.forEach(([pillar, score], i) => {
    const x = ML + i * colW + colW / 2
    const color = PILLAR_COLORS[pillar] || C.green
    const pct = score / 20
    const bH = 16, bW = 18
    fillRect(doc, x - bW / 2, PH - 46, bW, bH, C.midGray)
    fillRect(doc, x - bW / 2, PH - 46 + bH * (1 - pct), bW, bH * pct, color)
    txt(doc, `${score}/20`, x, PH - 26, 7.5, C.white, 'center', true)
    txt(doc, PILLAR_LABELS[pillar], x, PH - 20, 6, C.silver, 'center')
  })

  drawLine(doc, ML, PH - 8, PW - MR, PH - 8, C.midGray, 0.2)
  txt(doc, 'SEC-GROW Framework — Document généré automatiquement', PW / 2, PH - 4, 5.5, C.midGray, 'center')
}

// ─── PAGE 2 : Résumé exécutif ────────────────────────────────────────────────
function drawExecutiveSummary(doc, data, pageNum, totalPages) {
  const mc = MATURITY_COLORS[data.maturityLevel.name] || C.green
  pageHeader(doc, data.companyName, 'RÉSUMÉ EXÉCUTIF', mc)

  let y = 34
  y = sectionTitle(doc, '01 — Vue d\'ensemble', y)

  // Bloc score
  fillRect(doc, ML, y, 48, 36, C.darkGray)
  txt(doc, String(data.globalScore), ML + 24, y + 16, 26, C.white, 'center', true)
  txt(doc, '/ 80', ML + 24, y + 24, 7.5, C.silver, 'center')
  fillRect(doc, ML, y + 28, 48, 8, mc)
  txt(doc, data.maturityLevel.name.toUpperCase(), ML + 24, y + 33.5, 7, C.black, 'center', true)

  // Interprétation
  const interp = getInterpretation(data.maturityLevel.name)
  const interpLines = wrapLines(doc, interp, CW - 54, 8.5)
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  setTxt(doc, C.offWhite)
  doc.text(interpLines, ML + 52, y + 8)

  y += 46

  // Métriques
  y = sectionTitle(doc, '02 — Métriques clés', y)
  const metrics = [
    { label: 'Score global',      value: `${data.globalScore}/80`,                    sub: `${Math.round(data.globalScore / 80 * 100)}%` },
    { label: 'Niveau',            value: data.maturityLevel.name,                     sub: '' },
    { label: 'Réponses',          value: `${data.totalAnswered}/20`,                  sub: '4 piliers' },
    { label: 'Point fort',        value: PILLAR_LABELS[data.strongestPillar],         sub: `${data.pillarScores[data.strongestPillar]}/20` },
    { label: 'Priorité',          value: PILLAR_LABELS[data.weakestPillar],           sub: `${data.pillarScores[data.weakestPillar]}/20` },
  ]
  const mW = CW / metrics.length
  metrics.forEach((m, i) => {
    const mx = ML + i * mW
    fillRect(doc, mx, y, mW - 2, 26, C.darkGray)
    txt(doc, m.value, mx + (mW - 2) / 2, y + 10, 9, mc, 'center', true)
    if (m.sub) txt(doc, m.sub, mx + (mW - 2) / 2, y + 17, 6.5, C.silver, 'center')
    txt(doc, m.label, mx + (mW - 2) / 2, y + 23, 6, C.offWhite, 'center')
  })
  y += 34

  // Piliers
  y = sectionTitle(doc, '03 — Scores par pilier', y)
  Object.entries(data.pillarScores).forEach(([pillar, score]) => {
    const color = PILLAR_COLORS[pillar] || C.green
    const pct = score / 20
    fillRect(doc, ML, y, 3, 12, color)
    txt(doc, PILLAR_LABELS[pillar], ML + 6, y + 8, 8.5, C.white, 'left', true)
    txt(doc, `${score}/20`, ML + 70, y + 8, 8.5, C.white)
    fillRect(doc, ML + 88, y + 4, 72, 4, C.midGray)
    fillRect(doc, ML + 88, y + 4, 72 * pct, 4, color)
    txt(doc, getPillarMaturity(score), ML + 164, y + 8, 7, color, 'left', true)
    y += 16
  })

  pageFooter(doc, pageNum, totalPages, data.companyName)
}

// ─── PAGE 3 : Détail par pilier ──────────────────────────────────────────────
function drawPillarDetails(doc, data, pageNum, totalPages) {
  const mc = MATURITY_COLORS[data.maturityLevel.name] || C.green
  const pRef = { n: pageNum }

  pageHeader(doc, data.companyName, 'ANALYSE PAR PILIER', mc)
  let y = 34

  const pillarData = [
    { key: 'governance', questions: data.sections[0]?.questions || [] },
    { key: 'technical',  questions: data.sections[1]?.questions || [] },
    { key: 'processes',  questions: data.sections[2]?.questions || [] },
    { key: 'culture',    questions: data.sections[3]?.questions || [] },
  ]

  pillarData.forEach(({ key, questions }) => {
    const score = data.pillarScores[key] || 0
    const color = PILLAR_COLORS[key] || C.green
    const pct   = score / 20

    // Header pilier : 22mm
    y = checkY(doc, y, 22, data, 'ANALYSE PAR PILIER', pRef)

    fillRect(doc, ML, y, CW, 11, C.darkGray)
    fillRect(doc, ML, y, 4,  11, color)
    txt(doc, PILLAR_LABELS[key].toUpperCase(), ML + 7, y + 7.5, 8.5, C.white, 'left', true)
    txt(doc, `${score}/20 — ${getPillarMaturity(score)}`, PW - MR, y + 7.5, 7.5, color, 'right', true)
    fillRect(doc, ML, y + 12, CW, 3, C.midGray)
    fillRect(doc, ML, y + 12, CW * pct, 3, color)
    y += 20

    questions.forEach((q, qi) => {
      const qScore = data.responses[q.id] ?? null
      if (qScore === null) return

      // Texte question max 100mm (laisse place à la barre + score)
      const qLines = wrapLines(doc, q.text, 100, 7.5)
      const rowH   = qLines.length * 5 + 4

      y = checkY(doc, y, rowH, data, 'ANALYSE PAR PILIER', pRef)

      const qColor = qScore <= 1 ? C.red : qScore === 2 ? C.orange : qScore === 3 ? C.yellow : C.green

      txt(doc, `${qi + 1}.`, ML + 1, y + 5, 7, C.silver)
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      setTxt(doc, C.offWhite)
      doc.text(qLines, ML + 8, y + 5)

      // Barre : x=118, w=36 → finit à 154
      fillRect(doc, 118, y + 2, 36, 4, C.midGray)
      fillRect(doc, 118, y + 2, 36 * (qScore / 4), 4, qColor)
      // Score : x=157
      txt(doc, `${qScore}/4`, 157, y + 5.5, 7, qColor, 'left', true)
      // Niveau : x=170, max 26mm → finit à 196
      txt(doc, ['Ad Hoc','Bronze','Silver','Gold','Platinum'][qScore], 170, y + 5.5, 6.5, qColor)

      y += rowH
    })

    y += 6
  })

  pageFooter(doc, pRef.n, totalPages, data.companyName)
  return pRef.n
}

// ─── PAGE 4 : Normes & Réglementations ───────────────────────────────────────
function drawRegulations(doc, data, pageNum, totalPages) {
  const mc = MATURITY_COLORS[data.maturityLevel.name] || C.green
  pageHeader(doc, data.companyName, 'NORMES & RÉGLEMENTATIONS', mc)

  let y = 34
  y = sectionTitle(doc, '04 — Cadre réglementaire applicable', y)

  // Contexte
  fillRect(doc, ML, y, CW, 13, C.darkGray)
  txt(doc, `Secteur : ${data.sector || 'N/A'}`,                          ML + 4, y + 5.5, 7.5, C.offWhite)
  txt(doc, `Taille : ${data.companySize || 'N/A'}`,                      ML + 62, y + 5.5, 7.5, C.offWhite)
  txt(doc, `Zone(s) : ${(data.geoZones || []).join(', ') || 'N/A'}`,     ML + 118, y + 5.5, 7.5, C.offWhite)
  txt(doc, 'Couverture = conformité estimée par votre niveau SEC-GROW',  ML + 4, y + 10.5, 6, C.silver)
  y += 18

  // Colonnes fixes :
  // Norme     : x=14  → 60mm  (largeur 60)
  // Pertinence: x=76  barre 34mm → x=110  % x=112
  // Couverture: x=124 barre 34mm → x=158  % x=160
  const X = { norm: ML, relBar: 76, relPct: 112, covBar: 124, covPct: 160 }
  const BAR = 34

  // En-tête
  fillRect(doc, ML, y, CW, 8, C.midGray)
  txt(doc, 'Norme',              X.norm + 3,   y + 5.5, 7, C.white, 'left', true)
  txt(doc, 'Pertinence',         X.relBar,     y + 5.5, 7, C.white, 'left', true)
  txt(doc, 'Couverture SEC-GROW',X.covBar,     y + 5.5, 7, C.white, 'left', true)
  y += 10

  const regs = getApplicableRegulations(data.sector, data.companySize, data.geoZones || ['EU'])

  regs.forEach((reg, i) => {
    if (y + 14 > SAFE_BOTTOM) return
    const coverage  = getSecGrowCoverage(data.globalScore, reg.id)
    const relevance = reg.relevanceScore
    const rowBg     = i % 2 === 0 ? C.darkGray : C.black
    const relColor  = relevance >= 70 ? C.red    : relevance >= 40 ? C.orange : C.silver
    const covColor  = coverage  >= 70 ? C.green  : coverage  >= 40 ? C.yellow : C.orange

    fillRect(doc, ML, y, CW, 13, rowBg)

    // Norme (max 58mm)
    txt(doc, reg.name, X.norm + 3, y + 5.5, 8, C.white, 'left', true)
    const desc = s(doc.splitTextToSize(reg.description, 56)[0])
    doc.setFontSize(6)
    doc.setFont('helvetica', 'normal')
    setTxt(doc, C.silver)
    doc.text(desc, X.norm + 3, y + 10.5)

    // Barre pertinence + %
    fillRect(doc, X.relBar, y + 3.5, BAR, 4, C.midGray)
    fillRect(doc, X.relBar, y + 3.5, BAR * (relevance / 100), 4, relColor)
    txt(doc, `${relevance}%`, X.relPct + 2, y + 7.5, 7, relColor, 'left', true)

    // Barre couverture + %
    fillRect(doc, X.covBar, y + 3.5, BAR, 4, C.midGray)
    fillRect(doc, X.covBar, y + 3.5, BAR * (coverage / 100), 4, covColor)
    txt(doc, `${coverage}%`, X.covPct + 2, y + 7.5, 7, covColor, 'left', true)

    y += 14
  })

  if (y + 10 < SAFE_BOTTOM) {
    y += 4
    drawLine(doc, ML, y, PW - MR, y, C.midGray, 0.2)
    txt(doc, '* Pertinence : obligation selon votre profil.   * Couverture : conformité estimée par votre niveau SEC-GROW.', ML, y + 5, 6, C.silver)
  }

  pageFooter(doc, pageNum, totalPages, data.companyName)
}

// ─── PAGE 5 : Recommandations ────────────────────────────────────────────────
function drawRecommendations(doc, data, pageNum, totalPages) {
  const mc   = MATURITY_COLORS[data.maturityLevel.name] || C.green
  const pRef = { n: pageNum }
  const TW   = CW - 8   // text width dans un bloc (x=ML+8 → PW-MR-4)

  pageHeader(doc, data.companyName, 'RECOMMANDATIONS', mc)
  let y = 34
  y = sectionTitle(doc, '05 — Plan d\'action prioritaire', y)

  const aiRecs = data.llmResults?.recommendations?.recommendations
  const recs   = aiRecs?.length ? aiRecs : buildRecommendations(data)
  const isAI   = !!(aiRecs?.length)

  txt(doc, isAI ? '[ IA SEC-GROW ]' : '[ Analyse auto ]', PW - MR, y - 4, 6, isAI ? C.cyan : C.silver, 'right')

  // Intro
  const intro = `Diagnostic SEC-GROW — score ${data.globalScore}/80, niveau ${data.maturityLevel.name}. ${isAI ? 'Recommandations générées par IA.' : 'Recommandations basées sur les piliers les plus faibles.'}`
  const introL = wrapLines(doc, intro, CW, 8)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  setTxt(doc, C.offWhite)
  doc.text(introL, ML, y)
  y += introL.length * 5 + 6

  const PRIORITY_COLORS = [C.red, C.orange, C.cyan, C.green, C.silver]

  recs.forEach((rec, i) => {
    const color    = PRIORITY_COLORS[Math.min(i, PRIORITY_COLORS.length - 1)]
    const pLabel   = rec.priority === 1 ? 'HAUTE' : rec.priority === 2 ? 'MOYENNE' : 'NORMALE'
    const pillar   = rec.pillar || 'general'
    const titleL   = wrapLines(doc, rec.title,       TW, 9)
    const descL    = wrapLines(doc, rec.description, TW, 7.5)
    const ctxL     = rec.context ? wrapLines(doc, `→ ${rec.context}`, TW, 7) : []

    const blockH = 10                           // header
      + titleL.length * 5.5 + 3                // titre
      + descL.length  * 4.5 + 2                // desc
      + (ctxL.length  ? ctxL.length * 4 + 2 : 0)  // ctx
      + (rec.impact || rec.timeline ? 5 : 0)   // meta
      + 4                                       // padding bas

    y = checkY(doc, y, blockH, data, 'RECOMMANDATIONS', pRef)

    // Bande gauche + fond
    fillRect(doc, ML,     y, 4,    blockH, color)
    fillRect(doc, ML + 4, y, CW-4, blockH, C.darkGray)

    // Header ligne
    fillRect(doc, ML + 4, y, 32, 10, color)
    txt(doc, `P.${pLabel}`, ML + 20, y + 7, 5.5, C.black, 'center', true)
    txt(doc, `[ ${PILLAR_LABELS[pillar]?.toUpperCase() || 'GÉNÉRAL'} ]`, ML + 40, y + 7, 6, color, 'left', true)
    if (rec.impact)   txt(doc, `Impact : ${rec.impact}`,   PW - MR - 40, y + 7, 6, C.silver)
    if (rec.timeline) txt(doc, rec.timeline,               PW - MR,      y + 7, 6, C.silver, 'right')

    let ty = y + 13

    // Titre
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    setTxt(doc, C.white)
    doc.text(titleL, ML + 8, ty)
    ty += titleL.length * 5.5 + 3

    // Description
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    setTxt(doc, C.offWhite)
    doc.text(descL, ML + 8, ty)
    ty += descL.length * 4.5 + 2

    // Contexte IA
    if (ctxL.length) {
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      setTxt(doc, C.cyan)
      doc.text(ctxL, ML + 8, ty)
    }

    y += blockH + 4
  })

  pageFooter(doc, pRef.n, totalPages, data.companyName)
  return pRef.n
}

// ─── PAGE 6 : Forces & Faiblesses ────────────────────────────────────────────
function drawStrengthsWeaknesses(doc, data, pageNum, totalPages) {
  const mc   = MATURITY_COLORS[data.maturityLevel.name] || C.green
  const pRef = { n: pageNum }
  const TW   = CW - 8

  pageHeader(doc, data.companyName, 'FORCES & FAIBLESSES', mc)
  let y = 34
  y = sectionTitle(doc, '06 — Analyse Forces & Faiblesses', y)

  const analysis = data.llmResults?.analysis
  if (!analysis?.strengths?.length && !analysis?.weaknesses?.length) {
    fillRect(doc, ML, y, CW, 16, C.darkGray)
    txt(doc, 'Analyse non disponible — clé API Groq requise.', ML + 4, y + 10, 8, C.silver)
    pageFooter(doc, pRef.n, totalPages, data.companyName)
    return pRef.n
  }

  txt(doc, '[ IA SEC-GROW ]', PW - MR, y - 4, 6, C.cyan, 'right')

  // ── Forces ──
  if (analysis.strengths?.length) {
    y = checkY(doc, y, 12, data, 'FORCES & FAIBLESSES', pRef)
    y = sectionTitle(doc, 'Points forts', y)

    analysis.strengths.forEach((s) => {
      const descL   = wrapLines(doc, s.description, TW, 7.5)
      const impactL = s.business_impact ? wrapLines(doc, `Impact : ${s.business_impact}`, TW, 7) : []
      const blockH  = 10 + descL.length * 5 + (impactL.length ? impactL.length * 4.5 + 2 : 0) + 4

      y = checkY(doc, y, blockH, data, 'FORCES & FAIBLESSES', pRef)

      fillRect(doc, ML,     y, 4,    blockH, C.green)
      fillRect(doc, ML + 4, y, CW-4, blockH, C.darkGray)
      txt(doc, s.title, ML + 8, y + 8, 8.5, C.white, 'left', true)

      let ty = y + 13
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      setTxt(doc, C.offWhite)
      doc.text(descL, ML + 8, ty)
      ty += descL.length * 5 + 2

      if (impactL.length) {
        doc.setFontSize(7)
        setTxt(doc, C.green)
        doc.text(impactL, ML + 8, ty)
      }

      y += blockH + 4
    })
  }

  y += 4

  // ── Faiblesses ──
  if (analysis.weaknesses?.length) {
    y = checkY(doc, y, 12, data, 'FORCES & FAIBLESSES', pRef)
    y = sectionTitle(doc, 'Axes d\'amélioration', y)

    analysis.weaknesses.forEach((w) => {
      const descL = wrapLines(doc, w.description, TW, 7.5)
      const riskL = w.risk ? wrapLines(doc, `Risque : ${w.risk}`, TW, 7) : []
      const blockH = 10 + descL.length * 5 + (riskL.length ? riskL.length * 4.5 + 2 : 0) + 4

      y = checkY(doc, y, blockH, data, 'FORCES & FAIBLESSES', pRef)

      const uc = w.urgency === 'high' ? C.red : w.urgency === 'medium' ? C.orange : C.yellow
      fillRect(doc, ML,     y, 4,    blockH, uc)
      fillRect(doc, ML + 4, y, CW-4, blockH, C.darkGray)
      txt(doc, w.title, ML + 8, y + 8, 8.5, C.white, 'left', true)
      if (w.urgency) txt(doc, w.urgency.toUpperCase(), PW - MR, y + 8, 6.5, uc, 'right', true)

      let ty = y + 13
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      setTxt(doc, C.offWhite)
      doc.text(descL, ML + 8, ty)
      ty += descL.length * 5 + 2

      if (riskL.length) {
        doc.setFontSize(7)
        setTxt(doc, uc)
        doc.text(riskL, ML + 8, ty)
      }

      y += blockH + 4
    })
  }

  pageFooter(doc, pRef.n, totalPages, data.companyName)
  return pRef.n
}

// ─── PAGE 7 : OKRs ───────────────────────────────────────────────────────────
function drawOKRs(doc, data, pageNum, totalPages) {
  const mc   = MATURITY_COLORS[data.maturityLevel.name] || C.green
  const pRef = { n: pageNum }
  const TW   = CW - 8

  pageHeader(doc, data.companyName, 'OKRs SÉCURITÉ', mc)
  let y = 34
  y = sectionTitle(doc, '07 — Objectives & Key Results', y)

  const okrs = data.llmResults?.okrs?.okrs
  if (!okrs?.length) {
    fillRect(doc, ML, y, CW, 16, C.darkGray)
    txt(doc, 'OKRs non disponibles — clé API Groq requise.', ML + 4, y + 10, 8, C.silver)
    pageFooter(doc, pRef.n, totalPages, data.companyName)
    return pRef.n
  }

  txt(doc, '[ IA SEC-GROW — Trimestre en cours ]', PW - MR, y - 4, 6, C.cyan, 'right')

  okrs.forEach((okr, oi) => {
    const pc       = PILLAR_COLORS[okr.pillar] || C.green
    const objL     = wrapLines(doc, okr.objective, TW - 38, 9)
    const ratL     = okr.rationale ? wrapLines(doc, okr.rationale, TW, 7) : []

    const krsH = (okr.key_results || []).reduce((sum, kr) => {
      const kL = wrapLines(doc, kr.description, TW - 12, 7.5)
      const mL = [kr.target && `Cible : ${kr.target}`, kr.baseline && `Base : ${kr.baseline}`].filter(Boolean)
      return sum + kL.length * 5 + (mL.length ? mL.length * 4 + 2 : 0) + 8
    }, 0)

    const blockH = 10 + objL.length * 5.5 + (ratL.length ? ratL.length * 4.5 + 3 : 0) + krsH + 6

    y = checkY(doc, y, blockH, data, 'OKRs SÉCURITÉ', pRef)

    fillRect(doc, ML,     y, 4,    blockH, pc)
    fillRect(doc, ML + 4, y, CW-4, blockH, C.darkGray)

    // Badge pilier
    fillRect(doc, ML + 4, y, 34, 10, pc)
    txt(doc, `O${oi + 1} — ${PILLAR_LABELS[okr.pillar]?.slice(0,4).toUpperCase() || 'GEN'}`, ML + 21, y + 7, 6, C.black, 'center', true)

    // Objective
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    setTxt(doc, C.white)
    doc.text(objL, ML + 42, y + 7)

    let ty = y + 10 + objL.length * 5.5

    // Rationale
    if (ratL.length) {
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      setTxt(doc, C.silver)
      doc.text(ratL, ML + 8, ty)
      ty += ratL.length * 4.5 + 3
    }

    // Key Results
    ;(okr.key_results || []).forEach((kr, ki) => {
      const kL  = wrapLines(doc, kr.description, TW - 12, 7.5)
      const meta = [kr.target && `Cible : ${kr.target}`, kr.baseline && `Base : ${kr.baseline}`].filter(Boolean)
      const krH  = kL.length * 5 + (meta.length ? meta.length * 4 + 2 : 0) + 7

      fillRect(doc, ML + 8,  ty, 3,    krH, pc)
      fillRect(doc, ML + 11, ty, CW-15, krH, [16, 22, 18])

      txt(doc, `KR${ki + 1}`, ML + 14, ty + 5.5, 7, C.cyan, 'left', true)
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      setTxt(doc, C.offWhite)
      doc.text(kL, ML + 26, ty + 5.5)

      if (meta.length) {
        doc.setFontSize(6.5)
        setTxt(doc, C.silver)
        doc.text(meta.join('   '), ML + 26, ty + 5.5 + kL.length * 5 + 1)
      }

      if (kr.metric) txt(doc, kr.metric, PW - MR, ty + 5.5, 6, C.cyan, 'right')

      ty += krH + 2
    })

    y += blockH + 5
  })

  pageFooter(doc, pRef.n, totalPages, data.companyName)
  return pRef.n
}

// ─── Fallback recommandations statiques ──────────────────────────────────────
function buildRecommendations(data) {
  const recs = {
    governance: { title: 'Formaliser la politique de sécurité', description: 'Documenter une politique de sécurité adaptée. Désigner un responsable sécurité. Allouer un budget minimal et le suivre trimestriellement.', pillar: 'governance' },
    technical:  { title: 'Renforcer les contrôles techniques',  description: 'Déployer le MFA sur tous les accès critiques. Mettre en place un scan de vulnérabilités régulier. Chiffrer les données sensibles.', pillar: 'technical' },
    processes:  { title: 'Structurer la réponse aux incidents', description: 'Créer un plan de réponse aux incidents documenté et testé. Évaluer les fournisseurs tiers. Planifier des tests de sécurité annuels.', pillar: 'processes' },
    culture:    { title: 'Développer la culture sécurité',      description: 'Organiser des sessions de sensibilisation régulières. Mettre en place un canal de signalement. Intégrer la sécurité dans les évaluations.', pillar: 'culture' },
  }
  return Object.entries(data.pillarScores)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)
    .map(([pillar], i) => ({ ...recs[pillar], priority: i + 1 }))
}

// ─── EXPORT PRINCIPAL ─────────────────────────────────────────────────────────
export function generateReport(rawData) {
  const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const data = prepareData(rawData)

  // Page 1 — Couverture
  drawCover(doc, data)

  // Page 2 — Résumé exécutif
  doc.addPage()
  drawExecutiveSummary(doc, data, 2, 99)

  // Page 3+ — Piliers
  doc.addPage()
  const lastPillar = drawPillarDetails(doc, data, 3, 99)

  // Normes
  doc.addPage()
  drawRegulations(doc, data, lastPillar + 1, 99)

  // Recommandations
  doc.addPage()
  const lastReco = drawRecommendations(doc, data, lastPillar + 2, 99)

  // Forces & Faiblesses
  let lastSW = lastReco
  if (data.llmResults?.analysis) {
    doc.addPage()
    lastSW = drawStrengthsWeaknesses(doc, data, lastReco + 1, 99)
  }

  // OKRs
  if (data.llmResults?.okrs?.okrs?.length) {
    doc.addPage()
    drawOKRs(doc, data, lastSW + 1, 99)
  }

  doc.save(`SEC-GROW_${data.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`)
}

function prepareData(raw) {
  const pillarScores = {}
  raw.sections.forEach((section, i) => {
    const key = ['governance', 'technical', 'processes', 'culture'][i]
    pillarScores[key] = section.questions.reduce((sum, q) => sum + (raw.responses[q.id] ?? 0), 0)
  })
  const globalScore    = Object.values(pillarScores).reduce((a, b) => a + b, 0)
  const sorted         = Object.entries(pillarScores).sort(([, a], [, b]) => a - b)
  const totalAnswered  = Object.keys(raw.responses).length

  return {
    companyName:    raw.companyName    || 'Entreprise',
    evaluatorRole:  raw.evaluatorRole  || 'Évaluateur',
    sector:         raw.sector         || 'N/A',
    companySize:    raw.companySize    || 'startup',
    geoZones:       raw.geoZones       || ['EU'],
    globalScore,
    maturityLevel:  raw.maturityLevel,
    pillarScores,
    weakestPillar:  sorted[0][0],
    strongestPillar:sorted[sorted.length - 1][0],
    totalAnswered,
    sections:       raw.sections,
    responses:      raw.responses,
    llmResults:     raw.llmResults || null,
  }
}
