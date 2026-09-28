import { SyllabusTopic } from '../types/chsl';

export const CHSL_TIER1_STRUCTURE = {
  examName: 'SSC CHSL 2026 Tier 1 (CBE)',
  mode: 'Computer Based Examination (Objective Type)',
  durationMinutes: 60, // 80 for PwD
  totalQuestions: 100,
  totalMarks: 200,
  negativeMarking: 0.50,
  sections: [
    { id: 'english', name: 'English Language (Basic Knowledge)', questions: 25, marks: 50, timeRecommendation: '10-12 mins' },
    { id: 'reasoning', name: 'General Intelligence', questions: 25, marks: 50, timeRecommendation: '15-18 mins' },
    { id: 'quantitative_aptitude', name: 'Quantitative Aptitude (Basic Arithmetic Skill)', questions: 25, marks: 50, timeRecommendation: '20-25 mins' },
    { id: 'general_awareness', name: 'General Awareness', questions: 25, marks: 50, timeRecommendation: '7-10 mins' },
  ],
  qualifyingNature: 'Normalized marks used for shortlisting to Tier 2'
};

export const CHSL_TIER2_STRUCTURE = {
  examName: 'SSC CHSL 2026 Tier 2 (CBE + Skill/Typing)',
  mode: 'Objective Type CBE (Session I) + Skill/Typing Test (Session II)',
  negativeMarking: 1.0, // 1 mark deducted per wrong answer for Sections I & II
  session1: {
    durationMinutes: 135, // 2 hr 15 min
    sections: [
      {
        sectionNumber: 'Section I',
        timeLimit: '60 minutes',
        modules: [
          { id: 'math', name: 'Module-I: Mathematical Abilities', questions: 30, marks: 90 },
          { id: 'reasoning', name: 'Module-II: Reasoning and General Intelligence', questions: 30, marks: 90 }
        ],
        totalQuestions: 60,
        totalMarks: 180
      },
      {
        sectionNumber: 'Section II',
        timeLimit: '60 minutes',
        modules: [
          { id: 'english', name: 'Module-I: English Language and Comprehension', questions: 40, marks: 120 },
          { id: 'general_awareness', name: 'Module-II: General Awareness', questions: 20, marks: 60 }
        ],
        totalQuestions: 60,
        totalMarks: 180
      },
      {
        sectionNumber: 'Section III',
        timeLimit: '15 minutes',
        modules: [
          { id: 'computer_knowledge', name: 'Module-I: Computer Knowledge Module', questions: 15, marks: 45, qualifyingOnly: true }
        ],
        totalQuestions: 15,
        totalMarks: 45
      }
    ]
  },
  session2: {
    moduleName: 'Module-II of Section-III: Skill Test / Typing Test',
    partA: {
      post: 'Data Entry Operator (DEO / DEO Grade A)',
      testType: 'Skill Test (Data Entry Speed)',
      standard: '8,000 Key Depressions per hour (or 15,000 KDPH for DEO in CAG/Ministry)',
      duration: '15 minutes'
    },
    partB: {
      post: 'Lower Division Clerk (LDC) / Junior Secretariat Assistant (JSA)',
      testType: 'Typing Test',
      standard: 'English: 35 words per minute (approx 10,500 KDPH) OR Hindi: 30 wpm (approx 9,000 KDPH)',
      duration: '10 minutes'
    }
  }
};

export const CHSL_SYLLABUS_TOPICS: SyllabusTopic[] = [
  // ================= QUANTITATIVE APTITUDE =================
  {
    id: 'quant_number_systems',
    subjectId: 'quantitative_aptitude',
    subjectName: 'Quantitative Aptitude',
    tier: 'both',
    name: 'Number Systems & Basic Arithmetic',
    description: 'Computation of whole numbers, decimals, fractions, divisibility rules, unit digits, remainders, LCM & HCF.',
    officialNotificationReference: 'Section: Quantitative Aptitude - Number Systems',
    weightageDescription: 'Tier 1: 2-3 Questions (4-6 Marks) | Tier 2: 2-3 Questions (6-9 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_divisibility', name: 'Divisibility Rules (3, 7, 8, 9, 11, 72, 88)', weightageTier1Questions: '1 Q', difficulty: 'Foundation', status: 'completed', pyqCount: 18 },
      { id: 'sub_unit_digit_remainders', name: 'Unit Digit & Remainder Theorem', weightageTier1Questions: '1 Q', difficulty: 'Moderate', status: 'in_progress', pyqCount: 14 },
      { id: 'sub_lcm_hcf', name: 'LCM & HCF Concepts and Word Problems', weightageTier1Questions: '1 Q', difficulty: 'Foundation', status: 'not_started', pyqCount: 12 },
    ]
  },
  {
    id: 'quant_percentage_profit',
    subjectId: 'quantitative_aptitude',
    subjectName: 'Quantitative Aptitude',
    tier: 'both',
    name: 'Percentages, Profit & Loss and Discount',
    description: 'Fraction-to-percentage equivalence, successive percentage change, marked price, discount, dishonest dealers.',
    officialNotificationReference: 'Section: Quantitative Aptitude - Fundamental arithmetical operations',
    weightageDescription: 'Tier 1: 3-4 Questions (6-8 Marks) | Tier 2: 4-5 Questions (12-15 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_percentage_basics', name: 'Percentage Fraction Equivalence & Multipliers', weightageTier1Questions: '1 Q', difficulty: 'Foundation', status: 'completed', pyqCount: 22 },
      { id: 'sub_profit_loss', name: 'Cost Price, Selling Price & Dishonest Shopkeeper', weightageTier1Questions: '1-2 Qs', difficulty: 'Moderate', status: 'in_progress', pyqCount: 26 },
      { id: 'sub_discount', name: 'Marked Price & Successive Discounts', weightageTier1Questions: '1 Q', difficulty: 'Foundation', status: 'not_started', pyqCount: 16 }
    ]
  },
  {
    id: 'quant_ratio_mixture_si_ci',
    subjectId: 'quantitative_aptitude',
    subjectName: 'Quantitative Aptitude',
    tier: 'both',
    name: 'Ratio, Proportion, Mixture & Interest (SI/CI)',
    description: 'Compound ratio, mean proportion, alligation rule, Simple Interest and Compound Interest annual/half-yearly compounding.',
    officialNotificationReference: 'Section: Quantitative Aptitude - Ratio, Proportion, Interest',
    weightageDescription: 'Tier 1: 3-4 Questions (6-8 Marks) | Tier 2: 3-4 Questions (9-12 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_ratio_proportion', name: 'Ratios, Proportional Parts & Mean Proportional', weightageTier1Questions: '1 Q', difficulty: 'Foundation', status: 'in_progress', pyqCount: 15 },
      { id: 'sub_si_ci', name: 'SI vs CI Difference (2 & 3 Years) & Effective Rate', weightageTier1Questions: '1-2 Qs', difficulty: 'Advanced', status: 'needs_revision', pyqCount: 24 },
      { id: 'sub_mixture_alligation', name: 'Mixtures, Replacement Formula & Alligation', weightageTier1Questions: '1 Q', difficulty: 'Moderate', status: 'not_started', pyqCount: 12 }
    ]
  },
  {
    id: 'quant_time_work_speed',
    subjectId: 'quantitative_aptitude',
    subjectName: 'Quantitative Aptitude',
    tier: 'both',
    name: 'Time & Work, Pipes and Time, Speed & Distance',
    description: 'Efficiency method, alternate days, pipes filling and emptying, relative speed, trains, boats and streams, circular tracks.',
    officialNotificationReference: 'Section: Quantitative Aptitude - Time & Distance, Time & Work',
    weightageDescription: 'Tier 1: 3 Questions (6 Marks) | Tier 2: 3-4 Questions (9-12 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_time_work', name: 'Time & Work Efficiency & Alternate Days Work', weightageTier1Questions: '1 Q', difficulty: 'Foundation', status: 'completed', pyqCount: 20 },
      { id: 'sub_pipes_cisterns', name: 'Pipes & Cisterns with Negative Work', weightageTier1Questions: '1 Q', difficulty: 'Moderate', status: 'not_started', pyqCount: 11 },
      { id: 'sub_speed_trains_boats', name: 'Relative Speed, Trains & Boats Upstream/Downstream', weightageTier1Questions: '1 Q', difficulty: 'Moderate', status: 'in_progress', pyqCount: 22 }
    ]
  },
  {
    id: 'quant_algebra_geometry_trig',
    subjectId: 'quantitative_aptitude',
    subjectName: 'Quantitative Aptitude',
    tier: 'both',
    name: 'Advance Math: Algebra, Geometry, Mensuration & Trigonometry',
    description: 'Standard identities, symmetric polynomials, circle tangents, chords, triangle centres, 2D/3D mensuration, trigonometric ratios.',
    officialNotificationReference: 'Section: Quantitative Aptitude - Algebra, Geometry, Mensuration, Trigonometry',
    weightageDescription: 'Tier 1: 7-9 Questions (14-18 Marks) | Tier 2: 10-12 Questions (30-36 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_algebra_identities', name: 'Algebraic Identities (x + 1/x types & a³+b³+c³-3abc)', weightageTier1Questions: '2 Qs', difficulty: 'Moderate', status: 'completed', pyqCount: 30 },
      { id: 'sub_geometry_circles_triangles', name: 'Circles, Tangents, Incentre & Circumcentre Theorems', weightageTier1Questions: '2 Qs', difficulty: 'Advanced', status: 'needs_revision', pyqCount: 28 },
      { id: 'sub_trigonometry_heights', name: 'Trig Values, Complementary Angles & Heights and Distances', weightageTier1Questions: '2 Qs', difficulty: 'Moderate', status: 'in_progress', pyqCount: 25 },
      { id: 'sub_mensuration', name: '2D & 3D Solid Mensuration (Cone, Cylinder, Sphere)', weightageTier1Questions: '2 Qs', difficulty: 'Moderate', status: 'not_started', pyqCount: 21 }
    ]
  },
  {
    id: 'quant_data_interpretation',
    subjectId: 'quantitative_aptitude',
    subjectName: 'Quantitative Aptitude',
    tier: 'both',
    name: 'Data Interpretation (DI)',
    description: 'Bar charts, Pie charts, Tabular data, Line graphs, and Histograms.',
    officialNotificationReference: 'Section: Quantitative Aptitude - Statistical Charts',
    weightageDescription: 'Tier 1: 3-4 Questions (6-8 Marks) | Tier 2: 2-3 Questions (6-9 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_pie_bar_charts', name: 'Pie Charts (Degree vs Percentage conversion)', weightageTier1Questions: '2 Qs', difficulty: 'Foundation', status: 'completed', pyqCount: 16 },
      { id: 'sub_tabular_line_di', name: 'Tables and Multi-line Graphs Analysis', weightageTier1Questions: '2 Qs', difficulty: 'Moderate', status: 'in_progress', pyqCount: 14 }
    ]
  },

  // ================= GENERAL INTELLIGENCE & REASONING =================
  {
    id: 'reasoning_verbal_series',
    subjectId: 'reasoning',
    subjectName: 'General Intelligence',
    tier: 'both',
    name: 'Series, Analogies & Classification',
    description: 'Number series, letter series, semantic analogy, symbolic analogy, odd-one-out.',
    officialNotificationReference: 'Section: General Intelligence - Analogies & Series',
    weightageDescription: 'Tier 1: 6-8 Questions (12-16 Marks) | Tier 2: 6-8 Questions (18-24 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_number_letter_series', name: 'Differences, Prime Steps & Alternating Series', weightageTier1Questions: '2-3 Qs', difficulty: 'Moderate', status: 'completed', pyqCount: 35 },
      { id: 'sub_analogy', name: 'Semantic & Number Analogies (Square/Cube Relations)', weightageTier1Questions: '2-3 Qs', difficulty: 'Foundation', status: 'completed', pyqCount: 30 },
      { id: 'sub_classification', name: 'Odd One Out (Letter clusters & Number sets)', weightageTier1Questions: '2 Qs', difficulty: 'Foundation', status: 'in_progress', pyqCount: 22 }
    ]
  },
  {
    id: 'reasoning_coding_relations',
    subjectId: 'reasoning',
    subjectName: 'General Intelligence',
    tier: 'both',
    name: 'Coding-Decoding, Blood Relations & Direction Sense',
    description: 'Letter shifting, cross-coding, symbol/coded relations, family trees, cardinal direction and angular turns.',
    officialNotificationReference: 'Section: General Intelligence - Coding & Relationship concepts',
    weightageDescription: 'Tier 1: 5-7 Questions (10-14 Marks) | Tier 2: 6-8 Questions (18-24 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_coding_decoding', name: 'Opposite Letter Pairs & Positional Math Shifts', weightageTier1Questions: '2-3 Qs', difficulty: 'Foundation', status: 'completed', pyqCount: 32 },
      { id: 'sub_blood_relations', name: 'Family Tree Diagramming & Coded Blood Relations', weightageTier1Questions: '1-2 Qs', difficulty: 'Moderate', status: 'in_progress', pyqCount: 20 },
      { id: 'sub_direction_sense', name: 'Shadow problems & Pythagorean Distance in Directions', weightageTier1Questions: '1-2 Qs', difficulty: 'Foundation', status: 'completed', pyqCount: 18 }
    ]
  },
  {
    id: 'reasoning_syllogism_venn',
    subjectId: 'reasoning',
    subjectName: 'General Intelligence',
    tier: 'both',
    name: 'Syllogism, Venn Diagrams & Critical Reasoning',
    description: 'Statement-Conclusions, Venn diagrams representing classes, course of action, assertions and reasons.',
    officialNotificationReference: 'Section: General Intelligence - Syllogistic Reasoning & Venn Diagrams',
    weightageDescription: 'Tier 1: 3-4 Questions (6-8 Marks) | Tier 2: 5-6 Questions (15-18 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_syllogism', name: 'Syllogism (Some, All, No, Only A Few Rules)', weightageTier1Questions: '1-2 Qs', difficulty: 'Moderate', status: 'needs_revision', pyqCount: 25 },
      { id: 'sub_venn_diagrams', name: 'Intersection of Sets & Geometric Venn Diagrams', weightageTier1Questions: '1 Q', difficulty: 'Foundation', status: 'completed', pyqCount: 16 },
      { id: 'sub_critical_reasoning', name: 'Statement & Assumptions / Inferences (Tier 2 Focus)', weightageTier1Questions: '1 Q', difficulty: 'Advanced', status: 'not_started', pyqCount: 14 }
    ]
  },
  {
    id: 'reasoning_non_verbal',
    subjectId: 'reasoning',
    subjectName: 'General Intelligence',
    tier: 'both',
    name: 'Non-Verbal Reasoning & Visual Logic',
    description: 'Mirror images, water images, paper folding & cutting, embedded figures, figure series & dice.',
    officialNotificationReference: 'Section: General Intelligence - Non-Verbal & Figural Classification',
    weightageDescription: 'Tier 1: 4-5 Questions (8-10 Marks) | Tier 2: 3-4 Questions (9-12 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_paper_cutting_folding', name: 'Paper Folding & Pattern Punching Symmetry', weightageTier1Questions: '1 Q', difficulty: 'Foundation', status: 'completed', pyqCount: 20 },
      { id: 'sub_mirror_water_images', name: 'Mirror Inversion & Lateral Shift Rules', weightageTier1Questions: '1 Q', difficulty: 'Foundation', status: 'completed', pyqCount: 18 },
      { id: 'sub_dice_cube', name: 'Standard vs Non-Standard Dice & Opposite Faces Rules', weightageTier1Questions: '1 Q', difficulty: 'Foundation', status: 'in_progress', pyqCount: 15 },
      { id: 'sub_embedded_figures', name: 'Hidden Figure Detection & Figure Completion', weightageTier1Questions: '1 Q', difficulty: 'Foundation', status: 'completed', pyqCount: 12 }
    ]
  },

  // ================= ENGLISH LANGUAGE =================
  {
    id: 'english_grammar_rules',
    subjectId: 'english',
    subjectName: 'English Language',
    tier: 'both',
    name: 'Grammar Foundations: Spotting Errors & Sentence Improvement',
    description: 'Subject-Verb Agreement, Tenses, Prepositions, Conjunctions, Pronoun Antecedents, Modifiers, Conditionals.',
    officialNotificationReference: 'Section: English Language - Spotting the Error & Improvement of Sentences',
    weightageDescription: 'Tier 1: 5-6 Questions (10-12 Marks) | Tier 2: 8-10 Questions (24-30 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_subject_verb_agreement', name: 'Rules of Concord (Subject-Verb Agreement traps)', weightageTier1Questions: '2 Qs', difficulty: 'Moderate', status: 'completed', pyqCount: 30 },
      { id: 'sub_tenses_conditionals', name: 'Conditional Clauses (If had V3, would have V3)', weightageTier1Questions: '2 Qs', difficulty: 'Moderate', status: 'in_progress', pyqCount: 25 },
      { id: 'sub_prepositions_phrasal', name: 'Fixed Prepositions & Common Confusing Phrasal Verbs', weightageTier1Questions: '2 Qs', difficulty: 'Advanced', status: 'needs_revision', pyqCount: 28 }
    ]
  },
  {
    id: 'english_vocabulary',
    subjectId: 'english',
    subjectName: 'English Language',
    tier: 'both',
    name: 'Vocabulary: Synonyms, Antonyms, Idioms & One-Word Substitution',
    description: 'High-frequency SSC words, root words (Latin/Greek), contextual usage, common misspellings.',
    officialNotificationReference: 'Section: English Language - Synonyms, Antonyms, Idioms & Phrases, One Word Substitution',
    weightageDescription: 'Tier 1: 8-10 Questions (16-20 Marks) | Tier 2: 12-14 Questions (36-42 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_one_word_substitution', name: 'Frequent SSC One-Word Substitutions (Mania, Phobia, People)', weightageTier1Questions: '2 Qs', difficulty: 'Foundation', status: 'completed', pyqCount: 40 },
      { id: 'sub_idioms_phrases', name: 'Idioms and Metaphorical Phrases', weightageTier1Questions: '2 Qs', difficulty: 'Foundation', status: 'completed', pyqCount: 35 },
      { id: 'sub_synonyms_antonyms', name: 'Contextual Synonyms & Antonyms', weightageTier1Questions: '3 Qs', difficulty: 'Moderate', status: 'in_progress', pyqCount: 45 },
      { id: 'sub_spelling_mistakes', name: 'Commonly Misspelled Words Rules', weightageTier1Questions: '2 Qs', difficulty: 'Foundation', status: 'completed', pyqCount: 20 }
    ]
  },
  {
    id: 'english_voice_narration_pqrs',
    subjectId: 'english',
    subjectName: 'English Language',
    tier: 'both',
    name: 'Active/Passive Voice, Direct/Indirect & Sentence Shuffling (Para Jumbles)',
    description: 'Voice transformation rules, reported speech changes, pronoun/time shifts, coherence markers in PQRS.',
    officialNotificationReference: 'Section: English Language - Active/Passive Voice, Narration, Shuffling of Sentence Parts',
    weightageDescription: 'Tier 1: 2-3 Questions (4-6 Marks) | Tier 2: 8-10 Questions (24-30 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_active_passive', name: 'Active to Passive Voice Transformations & Modal Verbs', weightageTier1Questions: '1 Q', difficulty: 'Foundation', status: 'completed', pyqCount: 22 },
      { id: 'sub_direct_indirect', name: 'Direct to Indirect Speech & Interrogative Rules', weightageTier1Questions: '1 Q', difficulty: 'Moderate', status: 'completed', pyqCount: 22 },
      { id: 'sub_parajumbles_pqrs', name: 'Sentence Rearrangement (Opening sentence identification tricks)', weightageTier1Questions: '1-2 Qs', difficulty: 'Moderate', status: 'in_progress', pyqCount: 26 }
    ]
  },
  {
    id: 'english_cloze_comprehension',
    subjectId: 'english',
    subjectName: 'English Language',
    tier: 'both',
    name: 'Cloze Test & Reading Comprehension',
    description: 'Passage context analysis, vocabulary fit, tone, main idea, and inferential reading.',
    officialNotificationReference: 'Section: English Language - Cloze Passage & Comprehension Passage',
    weightageDescription: 'Tier 1: 5 Questions (10 Marks) | Tier 2: 10-12 Questions (30-36 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_cloze_passage', name: '5-Blank Contextual Cloze Test Strategy', weightageTier1Questions: '5 Qs', difficulty: 'Moderate', status: 'in_progress', pyqCount: 30 },
      { id: 'sub_reading_comprehension', name: 'Passage Skimming & Direct vs Inferential Questions', weightageTier1Questions: '0-5 Qs', difficulty: 'Moderate', status: 'not_started', pyqCount: 20 }
    ]
  },

  // ================= GENERAL AWARENESS =================
  {
    id: 'ga_polity_constitution',
    subjectId: 'general_awareness',
    subjectName: 'General Awareness',
    tier: 'both',
    name: 'Indian Polity & Constitution',
    description: 'Preamble, Fundamental Rights (Articles 12-35), DPSP (Articles 36-51), Parliament, Judiciary, Constitutional Amendments.',
    officialNotificationReference: 'Section: General Awareness - General Policy & Indian Constitution',
    weightageDescription: 'Tier 1: 3-4 Questions (6-8 Marks) | Tier 2: 3-4 Questions (9-12 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_fundamental_rights_dpsp', name: 'Articles 14-32, Writs & Directive Principles of State Policy', weightageTier1Questions: '2 Qs', difficulty: 'Moderate', status: 'completed', pyqCount: 32 },
      { id: 'sub_parliament_president', name: 'President, Prime Minister, Lok Sabha & Rajya Sabha Powers', weightageTier1Questions: '1-2 Qs', difficulty: 'Moderate', status: 'in_progress', pyqCount: 24 },
      { id: 'sub_amendments_schedules', name: 'Important Amendments (42nd, 44th, 73rd, 86th, 101st) & 12 Schedules', weightageTier1Questions: '1 Q', difficulty: 'Foundation', status: 'needs_revision', pyqCount: 20 }
    ]
  },
  {
    id: 'ga_history_culture',
    subjectId: 'general_awareness',
    subjectName: 'General Awareness',
    tier: 'both',
    name: 'History, Art & Culture',
    description: 'Indus Valley Civilization, Buddhism/Jainism, Delhi Sultanate, Mughals, Indian National Movement (1857-1947), Classical Dances & Festivals.',
    officialNotificationReference: 'Section: General Awareness - History & Culture',
    weightageDescription: 'Tier 1: 4-6 Questions (8-12 Marks) | Tier 2: 4-5 Questions (12-15 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_art_culture_dances', name: '8 Classical Dances, Folk Dances & State Musical Instruments', weightageTier1Questions: '2 Qs', difficulty: 'Moderate', status: 'completed', pyqCount: 35 },
      { id: 'sub_modern_history_freedom', name: '1857 Revolt, INC Sessions, Gandhi Era & Governor Generals', weightageTier1Questions: '2 Qs', difficulty: 'Moderate', status: 'in_progress', pyqCount: 30 },
      { id: 'sub_ancient_medieval', name: 'Mauryan, Gupta Dynasties & Delhi Sultanate Architecture', weightageTier1Questions: '1-2 Qs', difficulty: 'Moderate', status: 'not_started', pyqCount: 25 }
    ]
  },
  {
    id: 'ga_geography_economy',
    subjectId: 'general_awareness',
    subjectName: 'General Awareness',
    tier: 'both',
    name: 'Geography & Indian Economy',
    description: 'Rivers of India, mountain passes, soils, national parks, Census 2011, Five Year Plans, GDP, inflation, RBI repo rates.',
    officialNotificationReference: 'Section: General Awareness - Geography & Economic Scene',
    weightageDescription: 'Tier 1: 4-5 Questions (8-10 Marks) | Tier 2: 3-4 Questions (9-12 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_rivers_dams_geography', name: 'Himalayan vs Peninsular River Systems, Tributaries & Passes', weightageTier1Questions: '2 Qs', difficulty: 'Moderate', status: 'completed', pyqCount: 28 },
      { id: 'sub_census_demographics', name: 'Census 2011 Data (Literacy, Sex Ratio, Densities)', weightageTier1Questions: '1 Q', difficulty: 'Foundation', status: 'completed', pyqCount: 22 },
      { id: 'sub_economy_banking', name: 'Monetary Policy, Inflation, Budget Terms & Five-Year Plans', weightageTier1Questions: '1-2 Qs', difficulty: 'Moderate', status: 'in_progress', pyqCount: 18 }
    ]
  },
  {
    id: 'ga_science_current_affairs',
    subjectId: 'general_awareness',
    subjectName: 'General Awareness',
    tier: 'both',
    name: 'General Science & Current Affairs',
    description: 'Vitamins & diseases, chemical names/formulas, Newton laws & optics, Government schemes, sports awards, summits.',
    officialNotificationReference: 'Section: General Awareness - Scientific Research & Current Events',
    weightageDescription: 'Tier 1: 6-8 Questions (12-16 Marks) | Tier 2: 4-5 Questions (12-15 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_biology_vitamins_diseases', name: 'Human Body Systems, Vitamins, Deficiency Diseases & Plant Nutrition', weightageTier1Questions: '2-3 Qs', difficulty: 'Foundation', status: 'completed', pyqCount: 32 },
      { id: 'sub_physics_chemistry_formulas', name: 'SI Units, Chemical Compounds (Baking Soda, Plaster of Paris, etc.)', weightageTier1Questions: '2 Qs', difficulty: 'Moderate', status: 'in_progress', pyqCount: 24 },
      { id: 'sub_current_affairs_sports', name: 'National/International Events, Olympic/Asian Games, Padma Awards', weightageTier1Questions: '3-4 Qs', difficulty: 'Moderate', status: 'needs_revision', pyqCount: 40 }
    ]
  },

  // ================= TIER 2: COMPUTER KNOWLEDGE MODULE =================
  {
    id: 'tier2_computer_basics',
    subjectId: 'computer_knowledge',
    subjectName: 'Computer Knowledge (Tier 2)',
    tier: 'tier2',
    name: 'Computer Basics, Hardware & OS',
    description: 'CPU components, ALU, registers, cache, RAM vs ROM, secondary storage (SSD, HDD), Windows OS shortcuts & basic file management.',
    officialNotificationReference: 'Official Tier 2 Section III Module-I: Computer Basics (15 Questions, Qualifying nature)',
    weightageDescription: 'Tier 2: 5-6 Questions (15-18 Marks) [Mandatory Qualifying Cutoff applies]',
    hasLesson: true,
    subtopics: [
      { id: 'sub_cpu_memory', name: 'Memory Hierarchy, Volatile/Non-volatile, Cache L1/L2/L3', weightageTier1Questions: '0 Qs', weightageTier2Questions: '2 Qs', difficulty: 'Foundation', status: 'completed', pyqCount: 15 },
      { id: 'sub_io_devices', name: 'Input/Output Devices, Ports (USB, HDMI, VGA), BIOS/POST', weightageTier1Questions: '0 Qs', weightageTier2Questions: '2 Qs', difficulty: 'Foundation', status: 'in_progress', pyqCount: 12 },
      { id: 'sub_os_windows', name: 'Windows Operating System Shortcuts & Process Management', weightageTier1Questions: '0 Qs', weightageTier2Questions: '2 Qs', difficulty: 'Foundation', status: 'completed', pyqCount: 10 }
    ]
  },
  {
    id: 'tier2_ms_office_software',
    subjectId: 'computer_knowledge',
    subjectName: 'Computer Knowledge (Tier 2)',
    tier: 'tier2',
    name: 'Software, MS Office (Word, Excel, PowerPoint)',
    description: 'System software vs application software, MS Word formatting, MS Excel formulas (SUM, AVERAGE, VLOOKUP, cell referencing), PowerPoint slide masters.',
    officialNotificationReference: 'Official Tier 2 Section III Module-I: Software & MS Office',
    weightageDescription: 'Tier 2: 5-6 Questions (15-18 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_ms_excel_formulas', name: 'Excel Formulas, Absolute ($A$1) vs Relative Referencing & Charts', weightageTier1Questions: '0 Qs', weightageTier2Questions: '3 Qs', difficulty: 'Moderate', status: 'completed', pyqCount: 18 },
      { id: 'sub_ms_word_shortcuts', name: 'Word Processing, Page Layout, Mail Merge & Ctrl Key Combos', weightageTier1Questions: '0 Qs', weightageTier2Questions: '2 Qs', difficulty: 'Foundation', status: 'completed', pyqCount: 14 }
    ]
  },
  {
    id: 'tier2_internet_cybersecurity',
    subjectId: 'computer_knowledge',
    subjectName: 'Computer Knowledge (Tier 2)',
    tier: 'tier2',
    name: 'Internet, Networking & Cyber Security',
    description: 'LAN, WAN, MAN, IP addressing (IPv4 vs IPv6), HTTP vs HTTPS, DNS, Email protocols (SMTP, POP3, IMAP), Malware, Trojan, Phishing, Firewalls.',
    officialNotificationReference: 'Official Tier 2 Section III Module-I: Working with Internet and e-mails, Basics of networking and cyber security',
    weightageDescription: 'Tier 2: 4-5 Questions (12-15 Marks)',
    hasLesson: true,
    subtopics: [
      { id: 'sub_networking_protocols', name: 'TCP/IP, IPv4 (32-bit) vs IPv6 (128-bit), SMTP/POP3/IMAP Protocols', weightageTier1Questions: '0 Qs', weightageTier2Questions: '2 Qs', difficulty: 'Moderate', status: 'in_progress', pyqCount: 16 },
      { id: 'sub_cyber_threats', name: 'Viruses, Worms, Ransomware, Phishing & Anti-malware Firewalls', weightageTier1Questions: '0 Qs', weightageTier2Questions: '2 Qs', difficulty: 'Foundation', status: 'completed', pyqCount: 14 }
    ]
  }
];
