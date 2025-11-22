/**
 * @fileoverview Utilitaires d'export des résultats de diagnostic
 * @module utils/export
 */

/**
 * Exporte les résultats au format CSV
 * @param {Object} data - Données à exporter
 */
export const exportToCSV = (data) => {
  const csvData = [
    ['Entreprise', escapeCSV(data.companyName)],
    ['Evaluateur', escapeCSV(data.evaluatorName)],
    ['Date', new Date().toLocaleDateString('fr-FR')],
    ['Score Global', `${data.globalScore}/80`],
    ['Niveau Maturite', escapeCSV(data.globalMaturity)],
    [''],
    ['=== DETAIL PAR PILIER ==='],
    ['Pilier', 'Score', 'Niveau'],
    ...data.sections.map(section => [
      escapeCSV(section.title),
      `${section.score}/20`,
      escapeCSV(section.maturity)
    ])
  ]
  
  // Ajout des détails des questions
  data.sections.forEach(section => {
    csvData.push([''])
    csvData.push([`=== ${escapeCSV(section.title)} ===`])
    csvData.push(['Question', 'Score', 'Reponse'])
    section.questions.forEach(q => {
      csvData.push([
        escapeCSV(q.text),
        q.response,
        escapeCSV(q.responseText)
      ])
    })
  })
  
  // Ajout des points forts
  if (data.strengths.length > 0) {
    csvData.push([''])
    csvData.push(['=== POINTS FORTS (IA) ==='])
    csvData.push(['Titre', 'Description'])
    data.strengths.forEach(s => {
      csvData.push([escapeCSV(s.title), escapeCSV(s.description)])
    })
  }
  
  // Ajout des faiblesses
  if (data.weaknesses.length > 0) {
    csvData.push([''])
    csvData.push(['=== AXES AMELIORATION (IA) ==='])
    csvData.push(['Titre', 'Description'])
    data.weaknesses.forEach(w => {
      csvData.push([escapeCSV(w.title), escapeCSV(w.description)])
    })
  }
  
  // Ajout des recommandations
  if (data.recommendations.length > 0) {
    csvData.push([''])
    csvData.push(['=== RECOMMANDATIONS (IA) ==='])
    csvData.push(['Priorite', 'Titre', 'Description', 'Impact'])
    data.recommendations.forEach(r => {
      csvData.push([
        r.priority,
        escapeCSV(r.title),
        escapeCSV(r.description),
        escapeCSV(r.impact || '')
      ])
    })
  }
  
  // Ajout des OKRs
  if (data.okrs.length > 0) {
    csvData.push([''])
    csvData.push(['=== OKRS (IA) ==='])
    csvData.push(['Objectif', 'Pilier', 'Rationale'])
    data.okrs.forEach(okr => {
      csvData.push([
        escapeCSV(okr.objective),
        escapeCSV(okr.pillar),
        escapeCSV(okr.rationale)
      ])
      okr.key_results.forEach(kr => {
        csvData.push([
          '',
          'KR:',
          escapeCSV(`${kr.description} - Cible: ${kr.target}`)
        ])
      })
    })
  }
  
  const csvContent = csvData.map(row => row.join(';')).join('\n')
  downloadFile('\uFEFF' + csvContent, `SEC-GROW-${sanitizeFilename(data.companyName)}-${getCurrentDate()}.csv`, 'text/csv;charset=utf-8;')
}

/**
 * Exporte les résultats au format Excel
 * @param {Object} data - Données à exporter
 */
export const exportToExcel = (data) => {
  const excelData = [
    ['SEC-GROW - Diagnostic Cybersecurite'],
    [''],
    ['Entreprise:', data.companyName],
    ['Evaluateur:', data.evaluatorName],
    ['Date:', new Date().toLocaleDateString('fr-FR')],
    ['Score Global:', `${data.globalScore}/80`],
    ['Niveau Maturite:', data.globalMaturity],
    [''],
    ['DETAIL PAR PILIER'],
    ['Pilier', 'Score', 'Niveau de Maturite'],
    ...data.sections.map(section => [
      section.title,
      `${section.score}/20`,
      section.maturity
    ])
  ]
  
  // Ajout des détails complets comme pour CSV
  data.sections.forEach(section => {
    excelData.push([])
    excelData.push([section.title])
    excelData.push(['Question', 'Score', 'Reponse'])
    section.questions.forEach(q => {
      excelData.push([q.text, q.response, q.responseText])
    })
  })
  
  if (data.strengths.length > 0) {
    excelData.push([])
    excelData.push(['POINTS FORTS (IA)'])
    data.strengths.forEach(s => {
      excelData.push([s.title, s.description])
    })
  }
  
  if (data.weaknesses.length > 0) {
    excelData.push([])
    excelData.push(['AXES AMELIORATION (IA)'])
    data.weaknesses.forEach(w => {
      excelData.push([w.title, w.description])
    })
  }
  
  if (data.recommendations.length > 0) {
    excelData.push([])
    excelData.push(['RECOMMANDATIONS (IA)'])
    data.recommendations.forEach(r => {
      excelData.push([`P${r.priority}`, r.title, r.description])
    })
  }
  
  if (data.okrs.length > 0) {
    excelData.push([])
    excelData.push(['OKRS (IA)'])
    data.okrs.forEach(okr => {
      excelData.push([okr.objective, okr.pillar])
      okr.key_results.forEach(kr => {
        excelData.push(['', `KR: ${kr.description} - Cible: ${kr.target}`])
      })
    })
  }
  
  const worksheet = excelData.map(row => row.join('\t')).join('\n')
  downloadFile('\uFEFF' + worksheet, `SEC-GROW-${sanitizeFilename(data.companyName)}-${getCurrentDate()}.xls`, 'application/vnd.ms-excel')
}

/**
 * Télécharge un fichier
 * @private
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Échappe les caractères spéciaux pour CSV
 * @private
 */
const escapeCSV = (str) => {
  if (!str) return ''
  const escaped = str.toString()
    .replace(/"/g, '""')
    .replace(/[\r\n]/g, ' ')
  return escaped.includes(';') || escaped.includes('"') || escaped.includes('\n') 
    ? `"${escaped}"` 
    : escaped
}

/**
 * Nettoie le nom de fichier
 * @private
 */
const sanitizeFilename = (str) => {
  return str.replace(/[^a-zA-Z0-9-_]/g, '-')
}

/**
 * Retourne la date actuelle au format YYYY-MM-DD
 * @private
 */
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0]
}