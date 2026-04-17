export const GALAXIES = [
  {
    id: 'school',
    title: 'School Life',
    subtitle: 'The Foundation',
    position: [-100, 0, 60],   // Pushed wide and forward
    type: 'whirlpool',
    color: '#f472b6',
  },
  {
    id: 'college',
    title: 'College Life',
    subtitle: 'The Shift',
    position: [0, 0, -120],    // Back center
    type: 'milkyway',
    color: '#fbbf24',
  },
  {
    id: 'corporate',
    title: 'Corporate Life',
    subtitle: 'Coming Soon',
    position: [100, 0, 60],    // Pushed wide and forward
    type: 'andromeda',
    color: '#00d4ff',
    isComingSoon: true,
  },
];

export const CORE_IDENTITY = {
  id: 'core_identity',
  title: 'Ankan Chatterjee',
  subtitle: 'Full-Stack · AI/ML',
  type: 'sun',
  hashId: 'core',
  orbitRadius: 0,
  orbitSpeed: 0,
  orbitOffset: 0,
  yOffset: 0,
  size: 14.5, // Massive Red Giant
  color: '#b91c1c', // Deep crimson red core
  accentColor: '#fca5a5',
  techTags: ['REACT', 'REACT NATIVE', 'PYTHON', 'AI/ML', 'NODE.JS', 'JAVA'],
  metrics: ['System Architect', 'Algorithm Engineer', 'Product Builder'],
  story: {
    challenge: 'To constantly bridge the gap between heavy AI backend processing and buttery-smooth frontend user experiences.',
    solution: 'Mastered both the rigorous logic of Machine Learning models and the creative engineering of modern client applications.',
    impact: 'Capable of engineering entire product lifecycles end-to-end—from the SQL database up to the interactive 3D UI.',
  },
};

export const SCHOOL_NODES = [
  {
    id: 'sainik_sun',
    title: 'Sainik School Purulia',
    subtitle: 'The Foundation',
    type: 'sun',
    hashId: 'sainik',
    orbitRadius: 0,
    orbitSpeed: 0,
    orbitOffset: 0,
    yOffset: 0,
    size: 2.5,
    color: '#1a1a2e',
    accentColor: '#f472b6',
    techTags: ['DISCIPLINE', 'LEADERSHIP', 'NDA PREP'],
    metrics: ['7 Years of Rigor', 'Foundation'],
    story: {
      challenge:
        'Forging discipline and leadership in one of India\'s premier military schools, where physical and mental rigor are non-negotiable.',
      solution:
        'Thrived in the highly competitive environment, taking on leadership roles and participating in intense physical and academic training.',
      impact:
        'Built an unbreakable foundation of discipline, time management, and resilience that underpins all future technical and personal endeavors.',
    },
  },
  {
    id: 'parade',
    title: '5x Parade Winner',
    subtitle: 'Republic Day Trainer',
    type: 'sphere',
    hashId: 'parade',
    orbitRadius: 8.0,
    orbitSpeed: 0.31,
    orbitOffset: 0,
    yOffset: 0,
    size: 0.9,
    color: '#4c0519',
    accentColor: '#f43f5e',
    techTags: ['LEADERSHIP', 'DRILL', 'STRATEGY'],
    metrics: ['5x Winner', '200+ Cadets Trained'],
    story: {
      challenge: 'Orchestrating 200+ cadets through complex drill formations requiring perfect synchronization.',
      solution: 'Became the primary trainer, designing rigorous practice schedules and executing flawless formations.',
      impact: 'Secured the Republic Day Parade championship 5 times, demonstrating exceptional team coordination and leadership.',
    },
  },
  {
    id: 'mun',
    title: 'MUN Organizer',
    subtitle: 'Class 11th',
    type: 'sphere',
    hashId: 'mun',
    orbitRadius: 11.0,
    orbitSpeed: 0.14,
    orbitOffset: 1.5,
    yOffset: -0.2,
    size: 0.85,
    color: '#1e3a8a',
    accentColor: '#3b82f6',
    techTags: ['DEBATE', 'DIPLOMACY', 'MANAGEMENT'],
    metrics: ['Event Organizer', 'Policy Debate'],
    story: {
      challenge: 'Managing a complex diplomatic simulation event for numerous student delegates.',
      solution: 'Organized the Model United Nations in 11th grade, coordinating committees, agendas, and delegate logistics.',
      impact: 'Fostered critical thinking and public speaking skills among peers while honing event management capabilities.',
    },
  },
  {
    id: 'capf',
    title: 'CAPF NCC Camp',
    subtitle: 'Advanced Training',
    type: 'sphere',
    hashId: 'capf',
    orbitRadius: 14.0,
    orbitSpeed: 0.28,
    orbitOffset: 3.0,
    yOffset: 0.3,
    size: 0.75,
    color: '#064e3b',
    accentColor: '#10b981',
    techTags: ['FITNESS', 'ENDURANCE', 'TACTICS'],
    metrics: ['National Level', 'CAPF Attachments'],
    story: {
      challenge: 'Enduring grueling physical and tactical training at a national-level Central Armed Police Forces camp.',
      solution: 'Completed rigorous drills, obstacle courses, and arms training under professional military guidance.',
      impact: 'Awarded the prestigious CAPF NCC Camp Certificate, proving extreme physical endurance and tactical proficiency.',
    },
  },
  {
    id: 'ncc_a',
    title: 'NCC A Certificate',
    subtitle: 'Junior Division',
    type: 'sphere',
    hashId: 'ncca',
    orbitRadius: 12.0,
    orbitSpeed: 0.11,
    orbitOffset: 4.5,
    yOffset: -0.1,
    size: 0.75,
    color: '#451a03',
    accentColor: '#f59e0b',
    techTags: ['MILITARY PREP', 'CADETRY'],
    metrics: ['A Grade', 'First Level Clearance'],
    story: {
      challenge: 'Clearing the first tier of the National Cadet Corps certification with high proficiency.',
      solution: 'Mastered basic military subjects, weapon training, and social service protocols over 2 years.',
      impact: 'Achieved the NCC A Certificate, marking the successful completion of Junior Division training.',
    },
  },
];

export const COLLEGE_NODES = [
  {
    id: 'kiit',
    title: 'KIIT University',
    subtitle: 'The Sun — The Shift',
    type: 'sun',
    hashId: 'kiit',
    orbitRadius: 0,
    orbitSpeed: 0,
    orbitOffset: 0,
    yOffset: 0,
    size: 2.8,
    color: '#1e1b4b',
    accentColor: '#fbbf24',
    techTags: ['CS ENGINEERING', 'AI/ML', 'FULL-STACK'],
    metrics: ['B.Tech CSE', 'AI Specialization'],
    story: {
      challenge:
        'Transitioning from a structured military environment to the open-ended world of computer science and self-directed learning.',
      solution:
        'Immersed in AI/ML research, full-stack development, and competitive programming — building real products from day one.',
      impact:
        'Evolved from disciplined executor to creative technologist. Every project below is a direct result of this pivot.',
    },
  },
  {
    id: 'veritas',
    title: 'Veritas AI',
    subtitle: 'Narrative Drift Detection',
    type: 'sphere',
    hashId: 'col_veritas',
    orbitRadius: 10.0,
    orbitSpeed: 0.29,
    orbitOffset: 0.5,
    yOffset: 0.2,
    size: 1.1,
    color: '#083344',
    accentColor: '#00d4ff',
    techTags: ['FINBERT', 'COSINE SIMILARITY', 'FASTAPI', 'CELERY', 'REDIS', 'REACT'],
    metrics: ['Sub-100ms Search', '8 Quarters Analyzed', 'Async NLP Pipeline'],
    story: {
      challenge:
        'Earnings calls contain subtle narrative shifts that signal changes in corporate strategy — but these drifts are invisible to traditional keyword analysis.',
      solution:
        'Built a FinBERT-powered semantic analysis engine with cosine similarity scoring across temporal windows. Async processing via Celery + Redis for real-time speed.',
      impact:
        'Quantified semantic shifts in earnings calls across 8 quarters. High-speed asynchronous NLP pipeline with sub-100ms search latency.',
    },
  },
  {
    id: 'pathforge',
    title: 'PathForge-AI',
    subtitle: 'Explainable Career Roadmaps',
    type: 'sphere',
    hashId: 'col_pathforge',
    orbitRadius: 13.5,
    orbitSpeed: 0.08,
    orbitOffset: 1.2,
    yOffset: -0.15,
    size: 1.2,
    color: '#2e1065',
    accentColor: '#a855f7',
    techTags: ['REACT 18', 'TYPESCRIPT', 'FASTAPI', 'SUPABASE', 'TF-IDF', 'SVD', 'XGBOOST', 'SHAP'],
    metrics: ['End-to-End Team Lead', 'Explainable AI', 'Secure RLS & CI/CD'],
    story: {
      challenge:
        'Career guidance tools are opaque black boxes — users get recommendations with zero insight into why a path is suggested.',
      solution:
        'Led end-to-end development of an XGBoost + SHAP pipeline that generates transparent, explainable career roadmaps. TF-IDF and SVD for skill matching.',
      impact:
        'Full team lead. Explainable AI for career roadmaps with SHAP visualizations. Production-grade with Supabase RLS, CI/CD, and TypeScript throughout.',
    },
  },
  {
    id: 'kuberai',
    title: 'KuberAI',
    subtitle: 'Financial Manager',
    type: 'sphere',
    hashId: 'col_kuberai',
    orbitRadius: 12.0,
    orbitSpeed: 0.24,
    orbitOffset: 2.5,
    yOffset: 0.1,
    size: 1.05,
    color: '#451a03',
    accentColor: '#f59e0b',
    techTags: ['REACT NATIVE', 'EXPO/EAS', 'GEMINI API', 'MONGODB', 'FIREBASE'],
    metrics: ['90% Data Entry Reduction', 'Automated Invoice Scanning', 'Vision AI'],
    story: {
      challenge:
        'Manual financial data entry is tedious, error-prone, and consumes hours — especially for small businesses managing paper invoices.',
      solution:
        'Built a React Native app with Gemini API Vision for automated invoice scanning. MongoDB aggregation pipelines for real-time financial insights.',
      impact:
        'Reduced data entry by 90% via automated invoice scanning. Real-time financial dashboards with Firebase auth and push notifications.',
    },
  },
  {
    id: 'klarity',
    title: 'Klarity AI',
    subtitle: 'Knowledge Base',
    type: 'sphere',
    hashId: 'col_klarity',
    orbitRadius: 20.5,
    orbitSpeed: 0.19,
    orbitOffset: 4.0,
    yOffset: -0.25,
    size: 1.1,
    color: '#052e16',
    accentColor: '#10b981',
    techTags: ['MERN', 'PINECONE', 'GROQ API', 'LLAMA 3', 'RAG'],
    metrics: ['Sub-100ms Search', 'Chat with Your Content', 'Semantic RAG'],
    story: {
      challenge:
        'Personal knowledge is scattered across documents, notes, and bookmarks — finding relevant information requires manual digging.',
      solution:
        'Built a MERN + Pinecone RAG system powered by Groq API (Llama 3). Semantic vector search with "Chat with Your Content" conversational interface.',
      impact:
        'High-speed semantic search with sub-100ms latency. Chat-based retrieval over personal libraries using retrieval-augmented generation.',
    },
  },
  {
    id: 'cineiq',
    title: 'CineIQ',
    subtitle: 'Movie App',
    type: 'sphere',
    hashId: 'col_cineiq',
    orbitRadius: 24.0,
    orbitSpeed: 0.33,
    orbitOffset: 5.5,
    yOffset: 0.15,
    size: 0.95,
    color: '#4c0519',
    accentColor: '#f43f5e',
    techTags: ['REACT NATIVE', 'TYPESCRIPT', 'APPWRITE'],
    metrics: ['Real-Time Trending', 'Personalized Recommendations', 'Cross-Platform'],
    story: {
      challenge:
        'Movie discovery apps lack personalization — they show the same trending lists to everyone without learning preferences.',
      solution:
        'Built a React Native + TypeScript app with Appwrite backend. Custom recommendation algorithm that learns from viewing patterns and ratings.',
      impact:
        'Real-time trending data with personalized recommendation logic. Cross-platform mobile experience with TypeScript type safety.',
    },
  },
];

export const ORBIT_RADII_SCHOOL = [8.0, 11.0, 14.0, 17.0];
export const ORBIT_RADII_COLLEGE = [10.0, 13.5, 17.0, 20.5, 24.0];

export const GALAXY_REFS = {};

export const SOCIAL_LINKS = {
  github: { label: 'GitHub', url: 'https://github.com/CodeWithAnkan', icon: 'github' },
  linkedin: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ankan-chatterjee-4208a8187/', icon: 'linkedin' },
  resume: { label: 'Resume', url: '/resume.pdf', icon: 'file' },
  email: { label: 'Email', url: 'mailto:ankanchatterjee4855@gmail.com', icon: 'mail' },
};
