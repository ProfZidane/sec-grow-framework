// src/data/questions.js
export const SECTIONS = [
  {
    id: 'governance',
    title: 'Gouvernance et Organisation',
    icon: '🏢',
    color: '#3B82F6',
    questions: [
      {
        id: 'pol_sec',
        text: 'Politique de sécurité',
        help: 'Une politique claire est essentielle pour la conformité réglementaire',
        options: [
          'Nous n\'avons pas de politique de sécurité formalisée',
          'Nous avons quelques règles écrites mais non structurées', 
          'Nous avons une politique basique documentée (1-5 pages)',
          'Nous avons une politique complète, revue annuellement',
          'Nous avons une politique exhaustive intégrée à notre gouvernance'
        ]
      },
      {
        id: 'resp_sec',
        text: 'Responsabilité sécurité',
        help: 'Qui est responsable de la sécurité dans votre organisation ?',
        options: [
          'Personne n\'est spécifiquement responsable de la sécurité',
          'Un membre de l\'équipe gère la sécurité occasionnellement',
          'Nous avons un responsable sécurité identifié (même à temps partiel)',
          'Nous avons une matrice RACI sécurité et des rôles définis',
          'Nous avons un CISO ou équivalent (interne ou externe)'
        ]
      },
      {
        id: 'budget_sec',
        text: 'Budget sécurité',
        help: 'Investissement sécurité adapté à votre secteur d\'activité',
        options: [
          'Aucun budget spécifique pour la sécurité',
          'Budget ponctuel pour des besoins spécifiques',
          'Budget modeste mais identifié',
          'Budget formalisé et suivi',
          'Budget aligné sur les standards de l\'industrie (≥5-10% du budget IT)'
        ]
      },
      {
        id: 'formation',
        text: 'Sensibilisation et formation',
        help: 'Formation essentielle pour sensibiliser l\'équipe à la sécurité',
        options: [
          'Aucune formation ou sensibilisation à la sécurité',
          'Discussions informelles occasionnelles sur la sécurité',
          'Formation sécurité basique pour les nouveaux arrivants',
          'Programme de formation différencié par rôle',
          'Culture de sécurité mesurée et améliorée continuellement'
        ]
      },
      {
        id: 'integration_business',
        text: 'Intégration dans les décisions business',
        help: 'La sécurité peut devenir un avantage compétitif',
        options: [
          'La sécurité n\'est pas considérée dans les décisions business',
          'La sécurité est considérée après les décisions majeures',
          'La sécurité est un critère de décision parmi d\'autres',
          'La sécurité participe activement aux décisions stratégiques',
          'La sécurité est un avantage compétitif mis en avant'
        ]
      }
    ]
  },
  {
    id: 'technical',
    title: 'Sécurité Technique',
    icon: '🛡️',
    color: '#10B981',
    questions: [
      {
        id: 'auth_access',
        text: 'Authentification et contrôle d\'accès',
        help: 'Protéger l\'accès aux systèmes et aux données clients',
        options: [
          'Mots de passe simples, parfois partagés',
          'Politique de mots de passe basique en place',
          'MFA sur les systèmes critiques',
          'MFA généralisé et gestion des identités centralisée',
          'Approche Zero Trust en place'
        ]
      },
      {
        id: 'vuln_mgmt',
        text: 'Gestion des vulnérabilités',
        help: 'Maintenir la sécurité de votre plateforme face aux nouvelles menaces',
        options: [
          'Pas de processus défini pour les vulnérabilités',
          'Correction des vulnérabilités connues de manière ad hoc',
          'Processus documenté de gestion des vulnérabilités',
          'Scan régulier et processus de remédiation priorisé',
          'Gestion complète du cycle de vie des vulnérabilités avec metrics'
        ]
      },
      {
        id: 'code_security',
        text: 'Sécurité du code',
        help: 'Sécuriser le développement et éviter les failles',
        options: [
          'Pas d\'analyse de sécurité du code',
          'Revue de code ad hoc incluant la sécurité',
          'Utilisation d\'outils SAST/DAST basiques',
          'SAST/DAST intégrés dans la CI/CD',
          'Security as Code avec tests de sécurité automatisés'
        ]
      },
      {
        id: 'data_protection',
        text: 'Protection des données',
        help: 'Protection des données clients et respect du RGPD',
        options: [
          'Pas de mesures spécifiques pour protéger les données',
          'Quelques mesures basiques (backups, contrôles d\'accès)',
          'Chiffrement des données sensibles',
          'Classification des données et protection différenciée',
          'Protection complète du cycle de vie des données'
        ]
      },
      {
        id: 'monitoring',
        text: 'Surveillance et détection',
        help: 'Détecter les anomalies et protéger les données clients',
        options: [
          'Pas de surveillance ou logs minimaux',
          'Logs conservés mais peu analysés',
          'Centralisation des logs et alertes basiques',
          'SIEM ou équivalent avec analyse proactive',
          'Détection avancée avec IA et threat hunting'
        ]
      }
    ]
  },
  {
    id: 'processes',
    title: 'Processus et Conformité',
    icon: '📋',
    color: '#8B5CF6',
    questions: [
      {
        id: 'incident_mgmt',
        text: 'Gestion des incidents',
        help: 'Minimiser l\'impact des incidents sur vos clients et maintenir la confiance',
        options: [
          'Pas de processus défini pour les incidents',
          'Gestion réactive des incidents',
          'Processus documenté de gestion d\'incident',
          'Processus testé et amélioré régulièrement',
          'Capacité de réponse automatisée et exercée'
        ]
      },
      {
        id: 'third_party',
        text: 'Gestion des tiers et fournisseurs',
        help: 'Important pour les intégrations de services tiers',
        options: [
          'Pas d\'évaluation sécurité des fournisseurs',
          'Vérification ad hoc des fournisseurs critiques',
          'Processus basique d\'évaluation de sécurité des tiers',
          'Due diligence systématique et clauses contractuelles',
          'Programme complet de sécurité de la supply chain'
        ]
      },
      {
        id: 'compliance',
        text: 'Conformité et audits',
        help: 'Conformité réglementaire cruciale pour votre secteur',
        options: [
          'Pas de suivi de conformité spécifique',
          'Conformité vérifiée ponctuellement',
          'Suivi régulier des exigences de conformité',
          'Audits internes réguliers',
          'Certification externe (ISO 27001, SOC2, etc.)'
        ]
      },
      {
        id: 'business_continuity',
        text: 'Continuité d\'activité',
        help: 'Assurer la disponibilité de vos services pour vos clients',
        options: [
          'Pas de plan de continuité formalisé',
          'Sauvegardes régulières mais non testées',
          'Plan de continuité documenté pour systèmes critiques',
          'PCA testé régulièrement',
          'Stratégie complète de résilience business'
        ]
      },
      {
        id: 'testing',
        text: 'Tests et exercices',
        help: 'Tests de sécurité pour valider la robustesse de vos systèmes',
        options: [
          'Pas de tests de sécurité',
          'Tests ad hoc ou lors d\'incidents',
          'Tests d\'intrusion annuels',
          'Programme régulier de tests incluant red teaming',
          'Tests continus et automatisés (pentests, exercices)'
        ]
      }
    ]
  },
  {
    id: 'culture',
    title: 'Culture et Facteur Humain',
    icon: '👥',
    color: '#F59E0B',
    questions: [
      {
        id: 'leadership_engagement',
        text: 'Engagement de la direction',
        help: 'Implication de la direction dans la sécurité',
        options: [
          'Peu d\'intérêt de la direction pour la sécurité',
          'Intérêt réactif (après incidents)',
          'Soutien visible aux initiatives de sécurité',
          'La direction promeut activement la sécurité',
          'La sécurité est une valeur d\'entreprise défendue au plus haut niveau'
        ]
      },
      {
        id: 'collaboration',
        text: 'Collaboration inter-équipes',
        help: 'La collaboration inter-équipes est essentielle',
        options: [
          'La sécurité est isolée ou inexistante',
          'Consultation ponctuelle sur la sécurité',
          'Collaboration régulière avec les équipes techniques',
          'Security Champions dans chaque équipe',
          'Intégration complète de la sécurité dans tous les départements'
        ]
      },
      {
        id: 'reporting',
        text: 'Signalement et feedback',
        help: 'Canaux pour signaler les problèmes de sécurité',
        options: [
          'Pas de canal pour signaler les problèmes de sécurité',
          'Signalements informels',
          'Canal de signalement dédié',
          'Processus de feedback structuré avec suivi',
          'Programme de bug bounty interne ou externe'
        ]
      },
      {
        id: 'recognition',
        text: 'Recognition et incentives',
        help: 'Valorisation des bonnes pratiques sécurité',
        options: [
          'Aucune reconnaissance liée à la sécurité',
          'Reconnaissance informelle des bonnes pratiques',
          'Programme basique de reconnaissance',
          'Reconnaissance formelle des contributions sécurité',
          'La sécurité est intégrée dans les évaluations de performance'
        ]
      },
      {
        id: 'knowledge_sharing',
        text: 'Partage de connaissances',
        help: 'Diffusion des connaissances sécurité dans l\'équipe',
        options: [
          'Pas de partage de connaissances sur la sécurité',
          'Partage ad hoc d\'informations',
          'Sessions régulières de sensibilisation',
          'Programme structuré de formation continue',
          'Communauté d\'apprentissage active et participation externe'
        ]
      }
    ]
  }
];

export const MATURITY_LEVELS = {
  0: { name: 'Ad Hoc', color: '#EF4444', description: 'Sécurité non structurée' },
  1: { name: 'Bronze', color: '#F97316', description: 'Bases de sécurité établies' },
  2: { name: 'Silver', color: '#6B7280', description: 'Sécurité organisée et suivie' },
  3: { name: 'Gold', color: '#EAB308', description: 'Sécurité intégrée aux processus' },
  4: { name: 'Platinum', color: '#8B5CF6', description: 'Sécurité avancée et différenciante' }
};

export const EVALUATOR_ROLES = [
  {
    id: 'ceo',
    name: 'CEO',
    emoji: '👔',
    description: 'Vision stratégique et gouvernance'
  },
  {
    id: 'cto',
    name: 'CTO', 
    emoji: '💻',
    description: 'Architecture technique et processus'
  },
  {
    id: 'datascientist',
    name: 'Data Scientist',
    emoji: '📊',
    description: 'Analyse et implémentation SEC-GROW'
  }
];

export const KOALOO_CONTEXT = {
  company: 'KOALOO',
  sector: 'Fintech ESG/Sustainability',
  mission: 'Améliorer le score ESG des corporates via leurs fournisseurs',
  team: {
    operational: 4,
    board: 5,
    roles: ['Chairman', 'CEO', 'CTO', 'Data Scientist']
  },
  product: 'SaaS de tracking KPIs ESG',
  challenges: [
    'Conformité réglementaire fintech',
    'Protection données ESG sensibles', 
    'Confiance des clients corporates',
    'Sécurisation des intégrations API'
  ]
};