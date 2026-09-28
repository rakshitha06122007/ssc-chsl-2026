// Subject Specific Learning Tools Data: Speed Math, Formulas, Grammar Rules, Vocab, Polity, Typing Passages

export const SPEED_MATH_DATA = {
  fractionToPercentage: [
    { fraction: '1/2', percentage: '50%', decimal: '0.5' },
    { fraction: '1/3', percentage: '33.33% (33 1/3%)', decimal: '0.333' },
    { fraction: '1/4', percentage: '25%', decimal: '0.25' },
    { fraction: '1/5', percentage: '20%', decimal: '0.2' },
    { fraction: '1/6', percentage: '16.66% (16 2/3%)', decimal: '0.166' },
    { fraction: '1/7', percentage: '14.28% (14 2/7%)', decimal: '0.1428' },
    { fraction: '1/8', percentage: '12.5% (12 1/2%)', decimal: '0.125' },
    { fraction: '1/9', percentage: '11.11% (11 1/9%)', decimal: '0.111' },
    { fraction: '1/10', percentage: '10%', decimal: '0.1' },
    { fraction: '1/11', percentage: '9.09% (9 1/11%)', decimal: '0.0909' },
    { fraction: '1/12', percentage: '8.33% (8 1/3%)', decimal: '0.0833' },
    { fraction: '1/13', percentage: '7.69% (7 9/13%)', decimal: '0.0769' },
    { fraction: '1/14', percentage: '7.14% (7 1/7%)', decimal: '0.0714' },
    { fraction: '1/15', percentage: '6.66% (6 2/3%)', decimal: '0.0666' },
    { fraction: '1/16', percentage: '6.25% (6 1/4%)', decimal: '0.0625' },
    { fraction: '1/20', percentage: '5%', decimal: '0.05' },
    { fraction: '1/25', percentage: '4%', decimal: '0.04' }
  ],
  squares: Array.from({ length: 30 }, (_, i) => ({
    number: i + 11,
    square: (i + 11) * (i + 11)
  })), // Squares from 11 to 40
  cubes: Array.from({ length: 20 }, (_, i) => ({
    number: i + 1,
    cube: (i + 1) * (i + 1) * (i + 1)
  })), // Cubes from 1 to 20
  pythagoreanTriplets: [
    { triplet: '3, 4, 5', scalarMultiples: '6-8-10, 9-12-15, 12-16-20' },
    { triplet: '5, 12, 13', scalarMultiples: '10-24-26, 15-36-39' },
    { triplet: '7, 24, 25', scalarMultiples: '14-48-50' },
    { triplet: '8, 15, 17', scalarMultiples: '16-30-34' },
    { triplet: '9, 40, 41', scalarMultiples: '18-80-82' },
    { triplet: '11, 60, 61', scalarMultiples: 'High-frequency SSC Right Triangle' },
    { triplet: '12, 35, 37', scalarMultiples: 'Common in Tier 2 Geometry' },
    { triplet: '20, 21, 29', scalarMultiples: 'Repeated in CHSL Mensuration' }
  ]
};

export const GRAMMAR_120_RULES = [
  {
    ruleNumber: 1,
    title: 'Subject-Verb Agreement with Prepositional Modifiers',
    rule: 'The verb agrees with the true subject, NOT with the noun inside the prepositional phrase separating them.',
    exampleCorrect: 'The quality of these mangoes is exceptional.',
    exampleIncorrect: 'The quality of these mangoes are exceptional. ("mangoes" is object of preposition "of"; "quality" is singular subject)',
    sscTip: 'Scan for prepositions (of, in, with, along with, as well as) and identify the preceding head noun.'
  },
  {
    ruleNumber: 2,
    title: 'As well as / Along with / In addition to',
    rule: 'When two subjects are joined by "as well as", "along with", "together with", "with", "accompanied by", or "in addition to", the verb agrees with the FIRST subject.',
    exampleCorrect: 'The captain, along with his team members, was praised by the committee.',
    exampleIncorrect: 'The captain, along with his team members, were praised by the committee.',
    sscTip: 'Mentally cross out the phrase starting from "along with" up to the comma to test the verb.'
  },
  {
    ruleNumber: 3,
    title: 'Correlative Conjunctions (Neither... nor, Either... or)',
    rule: 'When subjects are joined by "neither... nor", "either... or", or "not only... but also", the verb agrees with the subject NEAREST to it.',
    exampleCorrect: 'Neither the teacher nor the students were present in the laboratory.',
    exampleIncorrect: 'Neither the teacher nor the students was present in the laboratory.',
    sscTip: 'Look at the noun right before the auxiliary verb.'
  },
  {
    ruleNumber: 4,
    title: 'Conditionals: Third Conditional (Past Unreal)',
    rule: 'Structure: If + Subject + had + V3, Subject + would have + V3. Never use "would have" in the "if" clause!',
    exampleCorrect: 'If she had studied consistently, she would have cleared the Tier 1 cutoff.',
    exampleIncorrect: 'If she would have studied consistently, she would have cleared the cutoff.',
    sscTip: 'Rule: "No WOULD in the IF clause". Look for "had + V3" in conditional clause.'
  },
  {
    ruleNumber: 5,
    title: 'Scarcely / Hardly and No Sooner Inversions',
    rule: '"Hardly/Scarcely" is followed by "WHEN/BEFORE" and uses inverted verb order (Had + S + V3). "No sooner" is followed by "THAN".',
    exampleCorrect: 'Hardly had he reached the examination hall when the bell rang.',
    exampleIncorrect: 'Hardly had he reached the hall then the bell rang. / No sooner he reached...',
    sscTip: 'Pairing: Hardly -> When; No sooner -> Than (T-H-A-N, never THEN).'
  },
  {
    ruleNumber: 6,
    title: 'Lest is followed by SHOULD',
    rule: '"Lest" means "for fear that" and is inherently negative. It takes the modal "should" (or bare subjunctive) and NEVER takes "not".',
    exampleCorrect: 'Walk carefully lest you should stumble.',
    exampleIncorrect: 'Walk carefully lest you should not stumble / lest you will stumble.',
    sscTip: 'Lest + Should + V1 (Zero "not" allowed).'
  }
];

export const HIGH_YIELD_VOCABULARY = [
  {
    word: 'Ephemeral',
    partOfSpeech: 'adjective',
    meaning: 'Lasting for a very short time; transitory; fleeting.',
    hindiMeaning: 'क्षणभंगुर / अल्पकालिक',
    synonyms: ['transient', 'evanescent', 'fleeting', 'momentary'],
    antonyms: ['perpetual', 'eternal', 'permanent', 'everlasting'],
    example: 'Social media fame is often ephemeral, fading within weeks.',
    mnemonic: 'E-PHEM-eral sounds like "e-film" — short reel duration.'
  },
  {
    word: 'Pragmatic',
    partOfSpeech: 'adjective',
    meaning: 'Dealing with things sensibly and realistically based on practical rather than theoretical considerations.',
    hindiMeaning: 'व्यावहारिक',
    synonyms: ['practical', 'realistic', 'utilitarian', 'hard-headed'],
    antonyms: ['idealistic', 'impractical', 'utopian', 'quixotic'],
    example: 'A pragmatic preparation strategy allocates more time to high-weightage topics.',
    mnemonic: 'Pragmatic comes from practice/practical.'
  },
  {
    word: 'Meticulous',
    partOfSpeech: 'adjective',
    meaning: 'Showing great attention to detail; very careful and precise.',
    hindiMeaning: 'अति सावधान / सूक्ष्म',
    synonyms: ['painstaking', 'scrupulous', 'fastidious', 'diligent'],
    antonyms: ['careless', 'sloppy', 'negligent', 'cursory'],
    example: 'Her meticulous analysis of previous year mock tests helped her rectify repeated errors.',
    mnemonic: 'Meticulous = "Medical" precision + "calculus" detail.'
  },
  {
    word: 'Ubiquitous',
    partOfSpeech: 'adjective',
    meaning: 'Present, appearing, or found everywhere.',
    hindiMeaning: 'सर्वव्यापी / सर्वत्र उपस्थित',
    synonyms: ['omnipresent', 'pervasive', 'universal', 'widespread'],
    antonyms: ['rare', 'scarce', 'seldom', 'unique'],
    example: 'Smartphones have become ubiquitous in both urban and rural India.',
    mnemonic: 'Ubi-quitous: "You-be-everywhere"!'
  },
  {
    word: 'Candid',
    partOfSpeech: 'adjective',
    meaning: 'Truthful and straightforward; frank; outspoken.',
    hindiMeaning: 'स्पष्टवादी / खरा',
    synonyms: ['forthright', 'outspoken', 'unvarnished', 'sincere'],
    antonyms: ['evasive', 'deceptive', 'insincere', 'guarded'],
    example: 'The teacher gave a candid assessment of the student\'s weak areas.',
    mnemonic: 'Candid camera catches real, unscripted truth.'
  }
];

export const TYPING_PRACTICE_PASSAGES = [
  {
    id: 'passage_official_01',
    title: 'Digital Governance & Public Service Delivery in India',
    tier: 'tier2',
    language: 'English' as const,
    durationMinutes: 10,
    targetWPM: 35,
    totalWords: 350,
    text: 'The evolution of e-governance in India has transformed the delivery of public services to citizens across the nation. Through integrated digital portals, public grievances are redressed with unprecedented transparency and efficiency. Citizens can now apply for welfare schemes, verify identity credentials, and access land records without physically visiting administrative offices. Furthermore, direct benefit transfer mechanisms ensure that financial subsidies reach intended beneficiaries with zero intermediary leakages. In competitive examinations like the Staff Selection Commission, computerized tests and automated evaluations guarantee complete objectivity and merit-based recruitment for central ministries.'
  },
  {
    id: 'passage_official_02',
    title: 'The Economic Significance of Indian Railways',
    tier: 'tier2',
    language: 'English' as const,
    durationMinutes: 10,
    targetWPM: 35,
    totalWords: 350,
    text: 'Indian Railways serves as the backbone of national transport logistics, connecting remote hinterlands with bustling port cities and industrial corridors. Carrying millions of passengers and substantial freight cargo daily, the railway network reduces carbon footprints while accelerating domestic interstate trade. Continuous investments in track electrification, automatic signaling, and modern passenger coaches have elevated travel comfort and operational safety. Administrative personnel handling clerical and clerical-cadre responsibilities ensure seamless coordination between station masters, ticketing divisions, and logistics managers.'
  },
  {
    id: 'passage_official_hindi_01',
    title: 'भारत में डिजिटल साक्षरता और प्रशासनिक सुधार',
    tier: 'tier2',
    language: 'Hindi' as const,
    durationMinutes: 10,
    targetWPM: 30,
    totalWords: 300,
    text: 'डिजिटल क्रांति ने भारतीय प्रशासनिक व्यवस्था को एक नई दिशा प्रदान की है। सरकारी कार्यालयों में कंप्यूटर और इंटरनेट के व्यापक उपयोग से फाइलों के निस्तारण में तेजी आई है। कर्मचारी अब ऑनलाइन माध्यमों से दस्तावेजों का सत्यापन और सार्वजनिक सूचनाओं का आदान-प्रदान सुगमता से कर सकते हैं। समय की बचत और कार्यकुशलता में सुधार से नागरिकों को त्वरित सेवाएं मिल रही हैं।'
  }
];
