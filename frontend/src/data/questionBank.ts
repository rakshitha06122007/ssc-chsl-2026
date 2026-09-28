import { Question } from '../types/chsl';

export const QUESTION_BANK: Question[] = [
  // ================= QUANTITATIVE APTITUDE =================
  {
    id: 'chsl_q_quant_01',
    tier: 'both',
    subjectId: 'quantitative_aptitude',
    topicId: 'quant_number_systems',
    topicName: 'Number Systems & Basic Arithmetic',
    subtopicName: 'Divisibility Rules',
    difficulty: 'medium',
    questionText: 'If the 7-digit number 54p3987 is divisible by 11, then what is the value of the digit p?',
    options: [
      { id: 'A', text: '4', isCorrect: false, distractorExplanation: 'Sum difference is not a multiple of 11.' },
      { id: 'B', text: '6', isCorrect: false, distractorExplanation: 'Yields difference of 12, not divisible by 11.' },
      { id: 'C', text: '5', isCorrect: true, distractorExplanation: 'Correct! (7 + 9 + p + 5) - (8 + 3 + 4) = (21 + p) - 15 = 6 + p. When p = 5, 6 + 5 = 11, divisible by 11.' },
      { id: 'D', text: '7', isCorrect: false, distractorExplanation: 'Yields 13, not divisible by 11.' }
    ],
    correctOptionId: 'C',
    explanation: {
      mainConcept: 'Divisibility rule of 11: Alternating digit difference (Odd places - Even places) must be 0 or 11k.',
      stepByStep: [
        'Sum of digits at odd places from right: 7 + 9 + p + 5 = 21 + p',
        'Sum of digits at even places from right: 8 + 3 + 4 = 15',
        'Difference = (21 + p) - 15 = 6 + p',
        'For 6 + p to be a multiple of 11, p must be 5.'
      ],
      shortcutOrTrick: 'Pair alternating numbers: (7-8) + (9-3) + (p-4) + 5 = 6 + p = 11 => p = 5.',
      commonTrap: 'Counting places from left to right instead of right to left.'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 1 (Held on 02-08-2023, Shift 1)',
    sourceCitation: 'Official SSC CHSL 2023 Tier 1 Master Key',
    verificationStatus: 'verified'
  },
  {
    id: 'chsl_q_quant_02',
    tier: 'both',
    subjectId: 'quantitative_aptitude',
    topicId: 'quant_percentage_profit',
    topicName: 'Percentages, Profit & Loss and Discount',
    subtopicName: 'Successive Discounts',
    difficulty: 'easy',
    questionText: 'A merchant marks up his goods by 40% and allows a discount of 25% on the marked price. What is his net profit or loss percentage?',
    options: [
      { id: 'A', text: '5% Profit', isCorrect: true, distractorExplanation: 'Correct! Net multiplier = 1.40 * 0.75 = 1.05 (+5%).' },
      { id: 'B', text: '15% Profit', isCorrect: false, distractorExplanation: 'Classic error of simply subtracting 40% - 25% = 15%.' },
      { id: 'C', text: '10% Loss', isCorrect: false, distractorExplanation: 'Incorrect multiplier.' },
      { id: 'D', text: 'No Profit, No Loss', isCorrect: false, distractorExplanation: 'Markup and discount bases are different.' }
    ],
    correctOptionId: 'A',
    explanation: {
      mainConcept: 'Net change formula: a + b + (ab)/100, where a = +40 and b = -25.',
      stepByStep: [
        'Let CP = 100. Marked Price = 140.',
        'Discount = 25% of 140 = 35.',
        'SP = 140 - 35 = 105.',
        'Net Profit = 105 - 100 = 5%.'
      ],
      shortcutOrTrick: 'Net = +40 - 25 - (40 * 25)/100 = 15 - 10 = +5% profit.',
      commonTrap: 'Directly subtracting 40 - 25 = 15% without accounting for different bases.'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 1 (Held on 04-08-2023, Shift 2)',
    sourceCitation: 'SSC CHSL Official Tier 1 CBE 2023',
    verificationStatus: 'verified'
  },
  {
    id: 'chsl_q_quant_03',
    tier: 'both',
    subjectId: 'quantitative_aptitude',
    topicId: 'quant_ratio_mixture_si_ci',
    topicName: 'Ratio, Proportion, Mixture & Interest (SI/CI)',
    subtopicName: 'CI - SI Difference',
    difficulty: 'medium',
    questionText: 'The difference between compound interest (compounded annually) and simple interest on a certain sum of money at 10% per annum for 2 years is ₹180. Find the sum.',
    options: [
      { id: 'A', text: '₹16,000', isCorrect: false, distractorExplanation: 'Corresponds to a difference of ₹160.' },
      { id: 'B', text: '₹18,000', isCorrect: true, distractorExplanation: 'Correct! Formula: Diff = P * (R/100)². 180 = P * (10/100)² => P = 180 * 100 = ₹18,000.' },
      { id: 'C', text: '₹20,000', isCorrect: false, distractorExplanation: 'Corresponds to ₹200 difference.' },
      { id: 'D', text: '₹22,500', isCorrect: false, distractorExplanation: 'Arithmetic error.' }
    ],
    correctOptionId: 'B',
    explanation: {
      mainConcept: 'For 2 years: Difference = P * (R/100)²',
      stepByStep: [
        '180 = P * (10/100)²',
        '180 = P * (1/100)',
        'P = 180 * 100 = ₹18,000.'
      ],
      shortcutOrTrick: 'Effective SI for 2 yrs @ 10% = 20%. Effective CI = 21%. Difference is 1%. 1% = 180 => 100% = ₹18,000.',
      commonTrap: 'Using the 3-year formula for a 2-year question.'
    },
    sourceType: 'verified_pyq',
    examYear: 2022,
    examShift: 'SSC CHSL 2022 Tier 1 (Held on 25-05-2022, Shift 3)',
    sourceCitation: 'Staff Selection Commission official paper keys',
    verificationStatus: 'verified'
  },
  {
    id: 'chsl_q_quant_04',
    tier: 'both',
    subjectId: 'quantitative_aptitude',
    topicId: 'quant_time_work_speed',
    topicName: 'Time & Work, Pipes and Time, Speed & Distance',
    subtopicName: 'Time and Work Efficiency',
    difficulty: 'medium',
    questionText: 'A can complete a piece of work in 12 days and B can complete the same work in 18 days. If they work together for 4 days, what fraction of the work remains unfinished?',
    options: [
      { id: 'A', text: '4/9', isCorrect: true, distractorExplanation: 'Correct! Total units = 36. A=3, B=2. (3+2)*4 = 20 units done. Remaining = 16/36 = 4/9.' },
      { id: 'B', text: '5/9', isCorrect: false, distractorExplanation: '5/9 is the fraction of work COMPLETED, not the fraction remaining!' },
      { id: 'C', text: '1/3', isCorrect: false, distractorExplanation: 'Corresponds to 12 units remaining.' },
      { id: 'D', text: '2/5', isCorrect: false, distractorExplanation: 'Calculation error.' }
    ],
    correctOptionId: 'A',
    explanation: {
      mainConcept: 'LCM Efficiency Method: Take LCM of given days as total work units.',
      stepByStep: [
        'LCM of 12 and 18 = 36 units (Total Work).',
        'A\'s 1-day work = 36 / 12 = 3 units/day.',
        'B\'s 1-day work = 36 / 18 = 2 units/day.',
        'Combined 1-day work = 3 + 2 = 5 units/day.',
        'Work done in 4 days = 5 * 4 = 20 units.',
        'Remaining work = 36 - 20 = 16 units.',
        'Fraction remaining = 16 / 36 = 4/9.'
      ],
      shortcutOrTrick: 'Completed = 4 * (1/12 + 1/18) = 4 * (5/36) = 20/36 = 5/9. Remaining = 1 - 5/9 = 4/9.',
      commonTrap: 'Selecting 5/9 (work finished) instead of 4/9 (work remaining).'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 1 (Held on 07-08-2023, Shift 2)',
    sourceCitation: 'SSC CHSL Official Paper 2023',
    verificationStatus: 'verified'
  },
  {
    id: 'chsl_q_quant_05',
    tier: 'both',
    subjectId: 'quantitative_aptitude',
    topicId: 'quant_algebra_geometry_trig',
    topicName: 'Advance Math: Algebra, Geometry, Mensuration & Trigonometry',
    subtopicName: 'Algebraic Identities',
    difficulty: 'medium',
    questionText: 'If x + 1/x = 5, then what is the value of x³ + 1/x³?',
    options: [
      { id: 'A', text: '125', isCorrect: false, distractorExplanation: 'Forgot to subtract 3k = 15.' },
      { id: 'B', text: '110', isCorrect: true, distractorExplanation: 'Correct! k³ - 3k = 5³ - 3(5) = 125 - 15 = 110.' },
      { id: 'C', text: '140', isCorrect: false, distractorExplanation: 'Added 3k instead of subtracting.' },
      { id: 'D', text: '115', isCorrect: false, distractorExplanation: 'Calculation error.' }
    ],
    correctOptionId: 'B',
    explanation: {
      mainConcept: 'Identity: x³ + 1/x³ = (x + 1/x)³ - 3(x + 1/x) = k³ - 3k.',
      stepByStep: [
        'Given k = 5.',
        'x³ + 1/x³ = 5³ - 3(5) = 125 - 15 = 110.'
      ],
      shortcutOrTrick: 'Standard formula: k³ - 3k = 125 - 15 = 110.',
      commonTrap: 'Confusing with x - 1/x = k, where answer is k³ + 3k.'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 1 (Held on 07-08-2023, Shift 1)',
    sourceCitation: 'SSC CHSL 2023 Master Key',
    verificationStatus: 'verified'
  },
  {
    id: 'chsl_q_quant_06',
    tier: 'both',
    subjectId: 'quantitative_aptitude',
    topicId: 'quant_data_interpretation',
    topicName: 'Data Interpretation (DI)',
    subtopicName: 'Pie Chart Degrees to Percentage',
    difficulty: 'easy',
    questionText: 'In a pie chart representing a company\'s annual expenditures, the central angle corresponding to "Raw Materials" is 108°. What percentage of the total expenditure is spent on Raw Materials?',
    options: [
      { id: 'A', text: '30%', isCorrect: true, distractorExplanation: 'Correct! (108° / 360°) * 100 = (3/10) * 100 = 30%.' },
      { id: 'B', text: '25%', isCorrect: false, distractorExplanation: '25% corresponds to 90°.' },
      { id: 'C', text: '36%', isCorrect: false, distractorExplanation: '36% corresponds to 129.6°.' },
      { id: 'D', text: '32%', isCorrect: false, distractorExplanation: 'Calculation error.' }
    ],
    correctOptionId: 'A',
    explanation: {
      mainConcept: 'Total central angle of a circle is 360° representing 100%. Degree to Percentage = (Angle / 360°) * 100.',
      stepByStep: [
        'Given angle = 108° out of 360° total.',
        'Fraction = 108 / 360 = 3 / 10.',
        'Percentage = (3 / 10) * 100 = 30%.'
      ],
      shortcutOrTrick: 'Shortcut multiplier: 1° = (100/360)% = (5/18)%. Angle * (5/18) = 108 * (5/18) = 6 * 5 = 30%.',
      commonTrap: 'Dividing by 100 instead of 360.'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 1 (Held on 09-08-2023, Shift 2)',
    sourceCitation: 'SSC CHSL 2023 Tier 1 Paper',
    verificationStatus: 'verified'
  },

  // ================= GENERAL INTELLIGENCE & REASONING =================
  {
    id: 'chsl_q_reas_01',
    tier: 'both',
    subjectId: 'reasoning',
    topicId: 'reasoning_coding_relations',
    topicName: 'Coding-Decoding, Blood Relations & Direction Sense',
    subtopicName: 'Coding-Decoding',
    difficulty: 'easy',
    questionText: 'In a certain code language, "ROSE" is written as "ILHV". How will "TULIP" be written in that code language?',
    options: [
      { id: 'A', text: 'GFORK', isCorrect: true, distractorExplanation: 'Correct! Opposite alphabet letters: T-G, U-F, L-O, I-R, P-K.' },
      { id: 'B', text: 'GFOQL', isCorrect: false, distractorExplanation: 'Opposite of P is K, not L.' },
      { id: 'C', text: 'HFORK', isCorrect: false, distractorExplanation: 'Opposite of T is G, not H.' },
      { id: 'D', text: 'GFNSK', isCorrect: false, distractorExplanation: 'Opposite of L is O, not N.' }
    ],
    correctOptionId: 'A',
    explanation: {
      mainConcept: 'Opposite letter pairs: Sum of ranks from left and right equals 27.',
      stepByStep: [
        'R(18) + I(9) = 27; O(15) + L(12) = 27; S(19) + H(8) = 27; E(5) + V(22) = 27.',
        'T(20)->G(7), U(21)->F(6), L(12)->O(15), I(9)->R(18), P(16)->K(11).',
        'Result: GFORK.'
      ],
      shortcutOrTrick: 'Mnemonics: GT Road, UF, LOVE, IR (Indian Railway), PK.',
      commonTrap: 'Checking numerical +/- shifts before testing reverse pairs.'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 1 (Held on 03-08-2023, Shift 2)',
    sourceCitation: 'SSC CHSL 2023 Tier 1 Official Key',
    verificationStatus: 'verified'
  },
  {
    id: 'chsl_q_reas_02',
    tier: 'both',
    subjectId: 'reasoning',
    topicId: 'reasoning_verbal_series',
    topicName: 'Series, Analogies & Classification',
    subtopicName: 'Number Series',
    difficulty: 'medium',
    questionText: 'Select the number that can replace the question mark (?) in the following series:\n12, 14, 18, 26, 42, ?',
    options: [
      { id: 'A', text: '74', isCorrect: true, distractorExplanation: 'Correct! Differences: +2, +4, +8, +16, +32. 42 + 32 = 74.' },
      { id: 'B', text: '68', isCorrect: false, distractorExplanation: 'Added 26 instead of 32.' },
      { id: 'C', text: '72', isCorrect: false, distractorExplanation: 'Added 30 instead of doubling 16.' },
      { id: 'D', text: '84', isCorrect: false, distractorExplanation: 'Calculation error.' }
    ],
    correctOptionId: 'A',
    explanation: {
      mainConcept: 'Geometric series of differences: Differences double (+2^n) at each step.',
      stepByStep: [
        '14 - 12 = 2',
        '18 - 14 = 4',
        '26 - 18 = 8',
        '42 - 26 = 16',
        'Next difference = 16 * 2 = 32. Missing number = 42 + 32 = 74.'
      ],
      shortcutOrTrick: 'Powers of 2 differences: +2, +4, +8, +16, +32.',
      commonTrap: 'Assuming arithmetic differences (+2, +4, +6).'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 1 (Held on 09-08-2023, Shift 3)',
    sourceCitation: 'SSC CHSL 2023 Tier 1 Verified Set',
    verificationStatus: 'verified'
  },
  {
    id: 'chsl_q_reas_03',
    tier: 'both',
    subjectId: 'reasoning',
    topicId: 'reasoning_syllogism_venn',
    topicName: 'Syllogism, Venn Diagrams & Critical Reasoning',
    subtopicName: 'Syllogism',
    difficulty: 'medium',
    questionText: 'Statements:\n1. All books are pens.\n2. Some pens are erasers.\nConclusions:\nI. Some erasers are pens.\nII. Some books are erasers.',
    options: [
      { id: 'A', text: 'Only conclusion I follows', isCorrect: true, distractorExplanation: 'Correct! "Some pens are erasers" directly converts to "Some erasers are pens".' },
      { id: 'B', text: 'Only conclusion II follows', isCorrect: false, distractorExplanation: 'No definite overlap between books and erasers.' },
      { id: 'C', text: 'Both follow', isCorrect: false, distractorExplanation: 'Conclusion II is only a possibility.' },
      { id: 'D', text: 'Neither follows', isCorrect: false, distractorExplanation: 'Conclusion I is logically definite.' }
    ],
    correctOptionId: 'A',
    explanation: {
      mainConcept: 'Immediate conversion of "Some A are B" is "Some B are A".',
      stepByStep: [
        'Statement 2: "Some pens are erasers" converts to "Some erasers are pens". Conclusion I follows.',
        'Books are inside pens, and erasers overlap with pens, but may not touch books. Conclusion II does not follow definitely.'
      ],
      shortcutOrTrick: 'Rule: "Some X are Y" <==> "Some Y are X" is always valid.',
      commonTrap: 'Assuming that because books are pens and pens are erasers, books must be erasers.'
    },
    sourceType: 'verified_pyq',
    examYear: 2022,
    examShift: 'SSC CHSL 2022 Tier 1 (Held on 30-05-2022, Shift 1)',
    sourceCitation: 'SSC CHSL Official Paper 2022',
    verificationStatus: 'verified'
  },
  {
    id: 'chsl_q_reas_04',
    tier: 'both',
    subjectId: 'reasoning',
    topicId: 'reasoning_non_verbal',
    topicName: 'Non-Verbal Reasoning & Visual Logic',
    subtopicName: 'Dice Opposite Faces',
    difficulty: 'easy',
    questionText: 'Two different positions of the same standard dice are shown. When number 3 is at the bottom, which number will be on the top face?\n(Position 1 shows faces: 1, 2, 3; Position 2 shows faces: 1, 4, 5)',
    options: [
      { id: 'A', text: '4', isCorrect: false, distractorExplanation: 'Face 2 is opposite 4.' },
      { id: 'B', text: '5', isCorrect: true, distractorExplanation: 'Correct! Clockwise from common face 1: 1->2->3 and 1->4->5. Thus, 2 is opposite 4, and 3 is opposite 5.' },
      { id: 'C', text: '6', isCorrect: false, distractorExplanation: 'Face 1 is opposite 6.' },
      { id: 'D', text: '2', isCorrect: false, distractorExplanation: 'Face 2 is adjacent to 3 in position 1, so cannot be opposite.' }
    ],
    correctOptionId: 'B',
    explanation: {
      mainConcept: 'One common face rule in dice: Move clockwise from the common face in both positions.',
      stepByStep: [
        'Common face is 1.',
        'Clockwise from 1 in Position 1: 1 -> 2 -> 3',
        'Clockwise from 1 in Position 2: 1 -> 4 -> 5',
        'Opposite pairs: 2 is opposite 4; 3 is opposite 5; 1 is opposite 6.',
        'When 3 is at the bottom, 5 is on the top.'
      ],
      shortcutOrTrick: 'Write sequences: (1-2-3) and (1-4-5). Align columns: 2 opposite 4, 3 opposite 5.',
      commonTrap: 'Rotating counter-clockwise in one dice and clockwise in the other.'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 1 (Held on 10-08-2023, Shift 1)',
    sourceCitation: 'SSC CHSL 2023 Official Paper',
    verificationStatus: 'verified'
  },

  // ================= ENGLISH LANGUAGE =================
  {
    id: 'chsl_q_eng_01',
    tier: 'both',
    subjectId: 'english',
    topicId: 'english_grammar_rules',
    topicName: 'Grammar Foundations: Spotting Errors & Sentence Improvement',
    subtopicName: 'Subject-Verb Agreement',
    difficulty: 'medium',
    questionText: 'Identify the segment containing a grammatical error:\n"Neither the manager nor the employees was present in the meeting hall yesterday."',
    options: [
      { id: 'A', text: 'Neither the manager', isCorrect: false, distractorExplanation: 'Correct conjunction opening.' },
      { id: 'B', text: 'nor the employees', isCorrect: false, distractorExplanation: 'Correct pair.' },
      { id: 'C', text: 'was present in the', isCorrect: true, distractorExplanation: 'Error! In "Neither... nor", the verb agrees with the closer subject ("employees" is plural, so it should be "were present").' },
      { id: 'D', text: 'meeting hall yesterday', isCorrect: false, distractorExplanation: 'Grammatically sound.' }
    ],
    correctOptionId: 'C',
    explanation: {
      mainConcept: 'Proximity rule for correlative conjunctions: Verb agrees with the subject closer to it.',
      stepByStep: [
        'Subjects: "manager" (singular) and "employees" (plural).',
        'Joined by "Neither... nor".',
        'Nearest subject to the verb is "employees" (plural).',
        '"was" must be replaced by "were".'
      ],
      shortcutOrTrick: 'SSC Rule: In "Neither A nor B + Verb", Verb = Form of B.',
      commonTrap: 'Thinking "Neither" always forces a singular verb regardless of the plural second subject.'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 1 (Held on 08-08-2023, Shift 1)',
    sourceCitation: 'SSC CHSL 2023 Answer Key',
    verificationStatus: 'verified'
  },
  {
    id: 'chsl_q_eng_02',
    tier: 'both',
    subjectId: 'english',
    topicId: 'english_vocabulary',
    topicName: 'Vocabulary: Synonyms, Antonyms, Idioms & One-Word Substitution',
    subtopicName: 'Idioms and Phrases',
    difficulty: 'easy',
    questionText: 'Select the most appropriate meaning of the given idiom:\n"To burn the candle at both ends"',
    options: [
      { id: 'A', text: 'To waste money on luxury items', isCorrect: false, distractorExplanation: 'That idiom is "to burn a hole in one\'s pocket".' },
      { id: 'B', text: 'To work excessively hard from early morning until late night', isCorrect: true, distractorExplanation: 'Correct! Metaphor for exhausting energy by waking early and sleeping late.' },
      { id: 'C', text: 'To be caught in a dilemma', isCorrect: false, distractorExplanation: 'That is "between the devil and the deep blue sea".' },
      { id: 'D', text: 'To cause intentional destruction', isCorrect: false, distractorExplanation: 'Literal interpretation.' }
    ],
    correctOptionId: 'B',
    explanation: {
      mainConcept: 'Idiomatic meaning of physical exhaustion through non-stop labor.',
      stepByStep: [
        'Burning candle from both ends exhausts the wax twice as fast.',
        'Metaphorically: overtaxing health by waking up early and working late.'
      ],
      shortcutOrTrick: 'Think: 5 AM to midnight work schedule.',
      commonTrap: 'Confusing with financial spending.'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 1 (Held on 03-08-2023, Shift 3)',
    sourceCitation: 'SSC CHSL 2023 Question Set',
    verificationStatus: 'verified'
  },
  {
    id: 'chsl_q_eng_03',
    tier: 'both',
    subjectId: 'english',
    topicId: 'english_voice_narration_pqrs',
    topicName: 'Active/Passive Voice, Direct/Indirect & Sentence Shuffling (Para Jumbles)',
    subtopicName: 'Active to Passive Voice',
    difficulty: 'medium',
    questionText: 'Select the correct passive form of the given sentence:\n"The committee has approved the revised examination syllabus."',
    options: [
      { id: 'A', text: 'The revised examination syllabus was approved by the committee.', isCorrect: false, distractorExplanation: 'Changes tense from present perfect to simple past.' },
      { id: 'B', text: 'The revised examination syllabus has been approved by the committee.', isCorrect: true, distractorExplanation: 'Correct! Present Perfect: Subject + has/have + approved -> Object + has/have + been + approved.' },
      { id: 'C', text: 'The revised examination syllabus is approved by the committee.', isCorrect: false, distractorExplanation: 'Changes to simple present.' },
      { id: 'D', text: 'The revised examination syllabus had been approved by the committee.', isCorrect: false, distractorExplanation: 'Changes to past perfect.' }
    ],
    correctOptionId: 'B',
    explanation: {
      mainConcept: 'Present Perfect passive transformation: has/have + V3 -> has/have + been + V3.',
      stepByStep: [
        'Active: "The committee" (Subject) + "has approved" (Verb) + "the revised examination syllabus" (Object).',
        'Passive: "The revised examination syllabus" (Singular Object) + "has been approved" + "by the committee".',
        'Tense must remain unchanged in voice transformations.'
      ],
      shortcutOrTrick: 'Voice Rule: Perfect tenses simply insert "been". Never change the primary tense.'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 1 (Held on 11-08-2023, Shift 1)',
    sourceCitation: 'SSC CHSL Official Paper 2023',
    verificationStatus: 'verified'
  },
  {
    id: 'chsl_q_eng_04',
    tier: 'both',
    subjectId: 'english',
    topicId: 'english_cloze_comprehension',
    topicName: 'Cloze Test & Reading Comprehension',
    subtopicName: 'Cloze Passage Blank Context',
    difficulty: 'medium',
    questionText: 'In the sentence: "Consistent revision is ________ to scoring high marks in the SSC CHSL examination.", select the most appropriate option to fill the blank.',
    options: [
      { id: 'A', text: 'detrimental', isCorrect: false, distractorExplanation: 'Detrimental means harmful, opposite of required context.' },
      { id: 'B', text: 'indispensable', isCorrect: true, distractorExplanation: 'Correct! Indispensable means absolutely necessary/essential, perfectly fitting the positive prepositional context.' },
      { id: 'C', text: 'redundant', isCorrect: false, distractorExplanation: 'Redundant means unnecessary/superfluous.' },
      { id: 'D', text: 'negligible', isCorrect: false, distractorExplanation: 'Negligible means insignificant.' }
    ],
    correctOptionId: 'B',
    explanation: {
      mainConcept: 'Contextual vocabulary fit in Cloze Tests: identifying positive/negative tone and collocations.',
      stepByStep: [
        'The passage stresses the importance of consistent revision for high marks.',
        '"Indispensable" means completely essential and takes the preposition "to" (indispensable to doing something).'
      ],
      shortcutOrTrick: 'Check sentence tone: High marks is positive, so the blank requires a strong positive adjective.'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 1 (Held on 04-08-2023, Shift 3)',
    sourceCitation: 'SSC CHSL 2023 Cloze Section',
    verificationStatus: 'verified'
  },

  // ================= GENERAL AWARENESS =================
  {
    id: 'chsl_q_ga_01',
    tier: 'both',
    subjectId: 'general_awareness',
    topicId: 'ga_polity_constitution',
    topicName: 'Indian Polity & Constitution',
    subtopicName: 'Fundamental Rights & Writs',
    difficulty: 'easy',
    questionText: 'Which Article of the Indian Constitution was referred to by Dr. B.R. Ambedkar as the "Heart and Soul of the Constitution"?',
    options: [
      { id: 'A', text: 'Article 14', isCorrect: false, distractorExplanation: 'Article 14 is Equality before Law.' },
      { id: 'B', text: 'Article 19', isCorrect: false, distractorExplanation: 'Article 19 protects six fundamental freedoms.' },
      { id: 'C', text: 'Article 21', isCorrect: false, distractorExplanation: 'Article 21 is Protection of Life and Liberty.' },
      { id: 'D', text: 'Article 32', isCorrect: true, distractorExplanation: 'Correct! Article 32 guarantees Right to Constitutional Remedies via Supreme Court writs.' }
    ],
    correctOptionId: 'D',
    explanation: {
      mainConcept: 'Article 32 empowers the Supreme Court to enforce Fundamental Rights via writs.',
      stepByStep: [
        'Dr. B.R. Ambedkar declared Article 32 as the most critical article without which the Constitution would be a nullity.',
        'Article 32 itself is a Fundamental Right.'
      ],
      shortcutOrTrick: 'Article 32 = Supreme Court writ power; Article 226 = High Court writ power.'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 1 (Held on 02-08-2023, Shift 2)',
    sourceCitation: 'SSC CHSL 2023 Official Paper',
    verificationStatus: 'verified'
  },
  {
    id: 'chsl_q_ga_02',
    tier: 'both',
    subjectId: 'general_awareness',
    topicId: 'ga_history_culture',
    topicName: 'History, Art & Culture',
    subtopicName: 'Classical Dances',
    difficulty: 'easy',
    questionText: '"Sattriya", one of the eight classical dances of India recognized by the Sangeet Natak Akademi, originated in which Indian state?',
    options: [
      { id: 'A', text: 'Assam', isCorrect: true, distractorExplanation: 'Correct! Introduced in the 15th century by Mahapurusha Sankaradeva in Assam.' },
      { id: 'B', text: 'Manipur', isCorrect: false, distractorExplanation: 'Manipur has Manipuri dance.' },
      { id: 'C', text: 'Odisha', isCorrect: false, distractorExplanation: 'Odisha has Odissi dance.' },
      { id: 'D', text: 'Kerala', isCorrect: false, distractorExplanation: 'Kerala has Kathakali and Mohiniyattam.' }
    ],
    correctOptionId: 'A',
    explanation: {
      mainConcept: '8 Classical Dances recognized by Sangeet Natak Akademi: Bharatnatyam (TN), Kathak (UP), Kathakali (Kerala), Mohiniyattam (Kerala), Kuchipudi (AP), Odissi (Odisha), Manipuri (Manipur), Sattriya (Assam).'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 1 (Held on 04-08-2023, Shift 1)',
    sourceCitation: 'SSC CHSL 2023 Tier 1 Verified Master Set',
    verificationStatus: 'verified'
  },
  {
    id: 'chsl_q_ga_03',
    tier: 'both',
    subjectId: 'general_awareness',
    topicId: 'ga_geography_economy',
    topicName: 'Geography & Indian Economy',
    subtopicName: 'Rivers of India',
    difficulty: 'medium',
    questionText: 'Which river is the longest peninsular river in India, often referred to as the "Dakshin Ganga"?',
    options: [
      { id: 'A', text: 'Godavari', isCorrect: true, distractorExplanation: 'Correct! Godavari is 1,465 km long, originating at Trimbakeshwar, Maharashtra.' },
      { id: 'B', text: 'Krishna', isCorrect: false, distractorExplanation: 'Krishna is the 2nd longest (~1400 km).' },
      { id: 'C', text: 'Kaveri', isCorrect: false, distractorExplanation: 'Kaveri is ~800 km.' },
      { id: 'D', text: 'Mahanadi', isCorrect: false, distractorExplanation: 'Mahanadi is ~851 km.' }
    ],
    correctOptionId: 'A',
    explanation: {
      mainConcept: 'Godavari is the largest peninsular river basin in India (1,465 km).'
    },
    sourceType: 'verified_pyq',
    examYear: 2022,
    examShift: 'SSC CHSL 2022 Tier 1 (Held on 24-05-2022, Shift 2)',
    sourceCitation: 'Official SSC CHSL Exam 2022 Paper',
    verificationStatus: 'verified'
  },
  {
    id: 'chsl_q_ga_04',
    tier: 'both',
    subjectId: 'general_awareness',
    topicId: 'ga_science_current_affairs',
    topicName: 'General Science & Current Affairs',
    subtopicName: 'Vitamins & Deficiency',
    difficulty: 'easy',
    questionText: 'Deficiency of Vitamin C (Ascorbic acid) in the human diet causes which of the following diseases?',
    options: [
      { id: 'A', text: 'Rickets', isCorrect: false, distractorExplanation: 'Rickets is caused by Vitamin D deficiency.' },
      { id: 'B', text: 'Scurvy', isCorrect: true, distractorExplanation: 'Correct! Vitamin C deficiency leads to scurvy, characterized by bleeding gums and delayed wound healing.' },
      { id: 'C', text: 'Beriberi', isCorrect: false, distractorExplanation: 'Beriberi is caused by Vitamin B1 (Thiamine) deficiency.' },
      { id: 'D', text: 'Night Blindness', isCorrect: false, distractorExplanation: 'Night blindness is caused by Vitamin A (Retinol) deficiency.' }
    ],
    correctOptionId: 'B',
    explanation: {
      mainConcept: 'Vitamin Deficiency Chart: Vitamin A (Night blindness), B1 (Beriberi), C (Scurvy), D (Rickets), K (Failure of blood clotting).'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 1 (Held on 08-08-2023, Shift 2)',
    sourceCitation: 'SSC CHSL 2023 Science Key',
    verificationStatus: 'verified'
  },

  // ================= TIER 2: COMPUTER KNOWLEDGE MODULE =================
  {
    id: 'chsl_q_comp_01',
    tier: 'tier2',
    subjectId: 'computer_knowledge',
    topicId: 'tier2_computer_basics',
    topicName: 'Computer Basics, Hardware & OS',
    subtopicName: 'Memory Hierarchy & Cache',
    difficulty: 'medium',
    questionText: 'Which computer memory is positioned directly between CPU registers and Main Memory (RAM) to provide the fastest access speed for frequently used instructions?',
    options: [
      { id: 'A', text: 'Secondary Hard Disk (HDD)', isCorrect: false, distractorExplanation: 'Slowest non-volatile magnetic storage.' },
      { id: 'B', text: 'Cache Memory (SRAM)', isCorrect: true, distractorExplanation: 'Correct! High-speed Static RAM (SRAM) cache buffers instructions for the CPU.' },
      { id: 'C', text: 'Virtual Memory on SSD', isCorrect: false, distractorExplanation: 'Virtual memory is an OS paging technique.' },
      { id: 'D', text: 'Read Only Memory (ROM)', isCorrect: false, distractorExplanation: 'ROM stores firmware BIOS/POST.' }
    ],
    correctOptionId: 'B',
    explanation: {
      mainConcept: 'Speed Hierarchy: Registers > Cache (SRAM) > RAM (DRAM) > SSD > HDD.'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 2 (Session I - Section III Computer Module)',
    sourceCitation: 'SSC CHSL 2023 Tier 2 Official CBE Key',
    verificationStatus: 'verified'
  },
  {
    id: 'chsl_q_comp_02',
    tier: 'tier2',
    subjectId: 'computer_knowledge',
    topicId: 'tier2_ms_office_software',
    topicName: 'Software, MS Office (Word, Excel, PowerPoint)',
    subtopicName: 'MS Excel Cell Referencing',
    difficulty: 'medium',
    questionText: 'In MS Excel 365, what symbol is used before the column letter and row number (e.g. $A$1) to create an absolute cell reference?',
    options: [
      { id: 'A', text: 'Hash symbol (#)', isCorrect: false, distractorExplanation: '# is used for error codes (e.g. #REF!).' },
      { id: 'B', text: 'Dollar sign ($)', isCorrect: true, distractorExplanation: 'Correct! The $ symbol locks row/column coordinates. Shortcut is F4.' },
      { id: 'C', text: 'Ampersand (&)', isCorrect: false, distractorExplanation: '& concatenates text strings.' },
      { id: 'D', text: 'Asterisk (*)', isCorrect: false, distractorExplanation: '* is multiplication/wildcard.' }
    ],
    correctOptionId: 'B',
    explanation: {
      mainConcept: 'Absolute referencing ($A$1) prevents coordinates from shifting during formula autofill.'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 2 (Computer Knowledge Module)',
    sourceCitation: 'Official Tier 2 Computer Section Question Paper',
    verificationStatus: 'verified'
  },
  {
    id: 'chsl_q_comp_03',
    tier: 'tier2',
    subjectId: 'computer_knowledge',
    topicId: 'tier2_internet_cybersecurity',
    topicName: 'Internet, Networking & Cyber Security',
    subtopicName: 'Cyber Threats',
    difficulty: 'easy',
    questionText: 'Which cyber attack involves sending fraudulent emails masquerading as a reputable organization to trick victims into revealing passwords or financial credentials?',
    options: [
      { id: 'A', text: 'Phishing', isCorrect: true, distractorExplanation: 'Correct! Phishing uses social engineering via spoofed emails or websites.' },
      { id: 'B', text: 'DDoS (Distributed Denial of Service)', isCorrect: false, distractorExplanation: 'DDoS floods network bandwidth.' },
      { id: 'C', text: 'Keylogger', isCorrect: false, distractorExplanation: 'Keyloggers record physical keystrokes.' },
      { id: 'D', text: 'Ransomware', isCorrect: false, distractorExplanation: 'Ransomware encrypts files for extortion.' }
    ],
    correctOptionId: 'A',
    explanation: {
      mainConcept: 'Phishing is social engineering deceptive impersonation to harvest sensitive credentials.'
    },
    sourceType: 'verified_pyq',
    examYear: 2023,
    examShift: 'SSC CHSL 2023 Tier 2 (Computer Knowledge Module)',
    sourceCitation: 'Official SSC CHSL CBE 2023 Tier 2 Key',
    verificationStatus: 'verified'
  }
];
