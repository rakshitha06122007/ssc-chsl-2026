import { ConceptLesson, Question } from '../types/chsl';
import { QUESTION_BANK } from './questionBank';

const getQuestionsForTopic = (topicId: string): Question[] => {
  const matches = QUESTION_BANK.filter(q => q.topicId === topicId);
  return matches.length > 0 ? matches : [QUESTION_BANK[0]];
};

export const CONCEPT_LESSONS: Record<string, ConceptLesson> = {
  // ================= 1. QUANTITATIVE APTITUDE =================
  'quant_number_systems': {
    topicId: 'quant_number_systems',
    topicName: 'Number Systems & Basic Arithmetic',
    subjectId: 'quantitative_aptitude',
    tier: 'both',
    prerequisites: ['Multiplication tables 1-20', 'Place value & Face value', 'Prime numbers 2-100'],
    simpleExplanation: 'Number Systems in SSC CHSL focuses on how integers behave under division, exponentiation, and cyclicity. Key questions test composite divisibility (72, 88, 99), unit digit patterns, and remainder theorem.',
    definitionsAndRules: [
      'Divisibility by 3/9: Sum of digits must be divisible by 3/9.',
      'Divisibility by 4: Last 2 digits divisible by 4. By 8: Last 3 digits divisible by 8.',
      'Divisibility by 11: Alternating sum difference must be 0 or 11k.',
      'Divisibility by 72: Must satisfy both 8 and 9 (coprime factors).',
      'Divisibility by 88: Must satisfy both 8 and 11.'
    ],
    importantFormulas: [
      { formula: 'Dividend = (Divisor * Quotient) + Remainder', description: 'Euclid Division Lemma' },
      { formula: 'Cyclicity of 2, 3, 7, 8 = 4', description: 'Divide power by 4 to get unit digit power' },
      { formula: 'Cyclicity of 4 and 9 = 2', description: 'Odd/even powers determine unit digit' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: 72 Divisibility with Missing Digits',
        problem: 'If 897359y6 is divisible by 72, what is the value of y?',
        steps: [
          'Step 1: 72 = 8 * 9 (coprimes).',
          'Step 2: Rule of 8 on last three digits: 9y6 must be divisible by 8 -> y can be 3 or 7.',
          'Step 3: Rule of 9: Sum of digits = 8+9+7+3+5+9+y+6 = 47 + y.',
          'Step 4: Nearest multiple of 9 is 54 => 47 + 7 = 54 => y = 7.'
        ],
        answer: 'y = 7',
        shortcut: 'Digit sum 47 + y = 11 + y = 2 + y = 9 => y = 7.'
      }
    ],
    shortcutsAndTechniques: [
      'Digital Root Method: Cancel all 9s and pairs summing to 9 to find remainder on division by 9.',
      'Unit digit for 7^95: 95 % 4 = 3 => 7³ = 343 => 3.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Factoring composite numbers into non-coprimes (e.g. 72 as 12*6 instead of 8*9).',
      'Trap: Remainder can never be negative or equal to divisor.'
    ],
    easyPracticeQuestions: getQuestionsForTopic('quant_number_systems'),
    mediumPracticeQuestions: getQuestionsForTopic('quant_number_systems'),
    examLevelPracticeQuestions: getQuestionsForTopic('quant_number_systems'),
    verifiedPYQs: getQuestionsForTopic('quant_number_systems'),
    shortRevisionNotes: [
      'Rule of 8: Test last 3 digits only.',
      'Rule of 11: (Odd places sum) - (Even places sum) = 0 or 11k.',
      'Composite tests: 72 (8 & 9), 88 (8 & 11), 99 (9 & 11).'
    ]
  },

  'quant_percentage_profit': {
    topicId: 'quant_percentage_profit',
    topicName: 'Percentages, Profit & Loss and Discount',
    subjectId: 'quantitative_aptitude',
    tier: 'both',
    prerequisites: ['Basic fractions to decimals conversion', 'Base comparison understanding'],
    simpleExplanation: 'Percentage means per hundred. Cost Price (CP) is the investment base (100%). Marked Price (MP) is the list price. Profit/Loss is strictly on CP, while Discount is strictly on MP.',
    definitionsAndRules: [
      'Profit % = (SP - CP) / CP * 100.',
      'Discount % = (MP - SP) / MP * 100.',
      'Golden Formula: MP / CP = (100 + P%) / (100 - D%).',
      'Dishonest Dealer: Gain % = [Error / (True - Error)] * 100.'
    ],
    importantFormulas: [
      { formula: 'Net Successive = a + b + (ab / 100)', description: 'Use + for markup and - for discount' },
      { formula: 'Equal SP with +x% and -x%: Always Loss = x² / 100 %', description: 'Net loss formula when SP is identical' },
      { formula: '1/6 = 16.66%, 1/7 = 14.28%, 1/8 = 12.5%', description: 'Fraction equivalents' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Markup with Discount',
        problem: 'A shopkeeper marks goods 40% above CP and offers 25% discount. Find profit %.',
        steps: [
          'Let CP = 100. MP = 140.',
          'Discount = 25% of 140 = 35.',
          'SP = 140 - 35 = 105.',
          'Profit = 105 - 100 = 5%.'
        ],
        answer: '5% Profit',
        shortcut: 'Net = +40 - 25 - (40*25)/100 = 15 - 10 = +5%.'
      }
    ],
    shortcutsAndTechniques: [
      'Two successive discounts d1 and d2 = (d1 + d2 - d1*d2/100)%.',
      'Multiplying factor for 20% profit is 1.2; for 15% discount is 0.85.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Subtracting discount from Cost Price instead of Marked Price.',
      'Trap: Assuming +20% and -20% on equal SP breaks even; it always loses 4%.'
    ],
    easyPracticeQuestions: getQuestionsForTopic('quant_percentage_profit'),
    mediumPracticeQuestions: getQuestionsForTopic('quant_percentage_profit'),
    examLevelPracticeQuestions: getQuestionsForTopic('quant_percentage_profit'),
    verifiedPYQs: getQuestionsForTopic('quant_percentage_profit'),
    shortRevisionNotes: [
      'MP / CP = (100 + P%) / (100 - D%).',
      'Equal SP, equal gain/loss = Loss of x²/100 %.',
      'Equal CP, equal gain/loss = No Profit No Loss.'
    ]
  },

  'quant_ratio_mixture_si_ci': {
    topicId: 'quant_ratio_mixture_si_ci',
    topicName: 'Ratio, Proportion, Mixture & Interest (SI/CI)',
    subjectId: 'quantitative_aptitude',
    tier: 'both',
    prerequisites: ['Fractions and cross-multiplication', 'Simple Interest formula PRT/100'],
    simpleExplanation: 'Ratios express proportional relationships. Alligation is a weighted average shortcut. In interest, Simple Interest is linear, while Compound Interest pays interest on accumulated interest.',
    definitionsAndRules: [
      'Mean Proportional of a and b is √(ab).',
      'Third Proportional to a and b is b² / a.',
      'Alligation Rule: (Cheaper quantity / Dearer quantity) = (d - m) / (m - c).',
      'CI for 2 years compounded annually = P(1 + R/100)² - P.'
    ],
    importantFormulas: [
      { formula: '2-Year Difference: D = P * (R / 100)²', description: 'Difference between CI and SI for 2 years' },
      { formula: '3-Year Difference: D = P * (R/100)² * [(300 + R) / 100]', description: '3-year CI vs SI difference' },
      { formula: 'Replacement Formula: Final = Initial * (1 - x/V)ⁿ', description: 'Repeated liquid replacement' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: 2-Year CI vs SI Difference',
        problem: 'Difference between CI and SI on a sum @ 10% for 2 years is ₹180. Find the sum.',
        steps: [
          'D = P * (R / 100)²',
          '180 = P * (10 / 100)²',
          '180 = P / 100 => P = ₹18,000.'
        ],
        answer: '₹18,000',
        shortcut: 'Effective SI = 20%, Effective CI = 21%. Difference = 1%. 1% = 180 => 100% = 18,000.'
      }
    ],
    shortcutsAndTechniques: [
      'Tree method for CI: Calculate interest on interest layer by layer.',
      'Alligation cross-subtraction for mixing two solutions with different concentrations.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Forgetting to halve the rate (R/2) and double the time (2T) when interest is compounded half-yearly.',
      'Trap: Confusing Mean Proportional √(ab) with Arithmetic Mean (a+b)/2.'
    ],
    easyPracticeQuestions: getQuestionsForTopic('quant_ratio_mixture_si_ci'),
    mediumPracticeQuestions: getQuestionsForTopic('quant_ratio_mixture_si_ci'),
    examLevelPracticeQuestions: getQuestionsForTopic('quant_ratio_mixture_si_ci'),
    verifiedPYQs: getQuestionsForTopic('quant_ratio_mixture_si_ci'),
    shortRevisionNotes: [
      '2-year CI - SI = P(R/100)²',
      'Half-yearly CI: Rate = R/2, Time = 2T.',
      'Quarterly CI: Rate = R/4, Time = 4T.'
    ]
  },

  'quant_time_work_speed': {
    topicId: 'quant_time_work_speed',
    topicName: 'Time & Work, Pipes and Time, Speed & Distance',
    subjectId: 'quantitative_aptitude',
    tier: 'both',
    prerequisites: ['LCM of numbers', 'Distance = Speed * Time'],
    simpleExplanation: 'Time and work problems are solved easiest by assuming Total Work = LCM of individual times. In speed and distance, convert km/h to m/s by multiplying with 5/18.',
    definitionsAndRules: [
      'Work = Efficiency * Time.',
      'Pipes emptying cistern do negative work.',
      'Relative Speed (Same direction): S1 - S2.',
      'Relative Speed (Opposite direction): S1 + S2.',
      'Average Speed for equal distances: 2xy / (x + y).'
    ],
    importantFormulas: [
      { formula: '1 km/h = 5/18 m/s; 1 m/s = 18/5 km/h', description: 'Unit conversion' },
      { formula: 'M1 * D1 * H1 / W1 = M2 * D2 * H2 / W2', description: 'Man-Days-Hours-Work relation' },
      { formula: 'Train crossing platform: Distance = Length_train + Length_platform', description: 'Total length' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Time & Work Fraction Remaining',
        problem: 'A does work in 12 days, B in 18 days. They work together for 4 days. What fraction remains?',
        steps: [
          'LCM(12, 18) = 36 units total.',
          'A = 3 units/day, B = 2 units/day. Together = 5 units/day.',
          'In 4 days: 5 * 4 = 20 units done.',
          'Remaining = 36 - 20 = 16 units => 16/36 = 4/9.'
        ],
        answer: '4/9 remains',
        shortcut: '1 - 4*(1/12 + 1/18) = 1 - 20/36 = 16/36 = 4/9.'
      }
    ],
    shortcutsAndTechniques: [
      'Downstream Speed = Speed of boat (u) + Speed of stream (v). Upstream = u - v.',
      'Speed of boat in still water = (Downstream + Upstream) / 2.',
      'Speed of stream = (Downstream - Upstream) / 2.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Calculating average speed by simply taking (x + y)/2 instead of 2xy/(x+y).',
      'Trap: Forgetting to add train length to platform/tunnel length.'
    ],
    easyPracticeQuestions: getQuestionsForTopic('quant_time_work_speed'),
    mediumPracticeQuestions: getQuestionsForTopic('quant_time_work_speed'),
    examLevelPracticeQuestions: getQuestionsForTopic('quant_time_work_speed'),
    verifiedPYQs: getQuestionsForTopic('quant_time_work_speed'),
    shortRevisionNotes: [
      'Total Work = LCM of times.',
      'Average Speed = 2xy / (x + y) for equal distances.',
      'Convert km/h to m/s: multiply by 5/18.'
    ]
  },

  'quant_algebra_geometry_trig': {
    topicId: 'quant_algebra_geometry_trig',
    topicName: 'Advance Math: Algebra, Geometry, Mensuration & Trigonometry',
    subjectId: 'quantitative_aptitude',
    tier: 'both',
    prerequisites: ['Basic algebraic formulas (a+b)²', 'Angle sum of triangle = 180°', 'Pythagoras theorem'],
    simpleExplanation: 'Advance Math accounts for 30-40% of Quantitative Aptitude in Tier 1 and Tier 2. It tests standard algebraic identities, circle/triangle theorems, 2D/3D mensuration volume/surface area, and trigonometric angle ratios.',
    definitionsAndRules: [
      'If a + b + c = 0, then a³ + b³ + c³ = 3abc.',
      'Angle subtended by an arc at centre is double the angle subtended at circumference.',
      'Angles in the same segment of a circle are equal.',
      'Direct Common Tangent (DCT) = √[d² - (r1 - r2)²]. Touching externally: 2√(r1*r2).',
      'Trig values: sin 30°=1/2, sin 45°=1/√2, sin 60°=√3/2, tan 45°=1.'
    ],
    importantFormulas: [
      { formula: 'x + 1/x = k => x² + 1/x² = k² - 2; x³ + 1/x³ = k³ - 3k', description: 'Standard algebra shortcuts' },
      { formula: 'Volume of Cylinder = πr²h; Cone = (1/3)πr²h; Sphere = (4/3)πr³', description: '3D Mensuration volumes' },
      { formula: 'sin²θ + cos²θ = 1; 1 + tan²θ = sec²θ; 1 + cot²θ = cosec²θ', description: 'Fundamental trig identities' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: x³ + 1/x³ calculation',
        problem: 'If x + 1/x = 5, find x³ + 1/x³.',
        steps: [
          'Using identity: x³ + 1/x³ = k³ - 3k where k = 5.',
          '5³ - 3(5) = 125 - 15 = 110.'
        ],
        answer: '110',
        shortcut: 'Direct formula k³ - 3k = 110.'
      }
    ],
    shortcutsAndTechniques: [
      'Value-putting in trigonometry: If question is free of specific angles, try θ = 45° or θ = 0°/90° (avoiding undefined division by zero).',
      'Pythagorean triplets: 3-4-5, 5-12-13, 7-24-25, 8-15-17, 9-40-41, 11-60-61, 20-21-29.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Forgetting that sec²θ - tan²θ = 1, so secθ - tanθ = 1 / (secθ + tanθ).',
      'Trap: Confusing sphere total surface area (4πr²) with hemisphere total surface area (3πr²).'
    ],
    easyPracticeQuestions: getQuestionsForTopic('quant_algebra_geometry_trig'),
    mediumPracticeQuestions: getQuestionsForTopic('quant_algebra_geometry_trig'),
    examLevelPracticeQuestions: getQuestionsForTopic('quant_algebra_geometry_trig'),
    verifiedPYQs: getQuestionsForTopic('quant_algebra_geometry_trig'),
    shortRevisionNotes: [
      'x + 1/x = k => x³ + 1/x³ = k³ - 3k.',
      'Two externally touching circles: DCT = 2√(r1*r2).',
      'Hemisphere Total Surface Area = 3πr² (Curved 2πr² + Base πr²).'
    ]
  },

  'quant_data_interpretation': {
    topicId: 'quant_data_interpretation',
    topicName: 'Data Interpretation (DI)',
    subjectId: 'quantitative_aptitude',
    tier: 'both',
    prerequisites: ['Percentage calculation', 'Ratio and averages', 'Reading tables and bar charts'],
    simpleExplanation: 'Data Interpretation tests your ability to extract quantitative facts from pie charts, bar diagrams, tables, and line graphs. Key skills are rapid percentage changes, ratio comparisons, and degree-to-percentage conversion.',
    definitionsAndRules: [
      'In a pie chart, 360° corresponds to 100%.',
      'Conversion: 1% = 3.6°; 1° = (5/18)%.',
      'Percentage Growth = [(Final - Initial) / Initial] * 100.'
    ],
    importantFormulas: [
      { formula: 'Degree to Percentage = (Angle / 360°) * 100', description: 'Pie chart conversion' },
      { formula: 'Average = Total Sum of Values / Number of Entities', description: 'Average from table' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Pie Chart Central Angle to Percentage',
        problem: 'A sector in a pie chart has a central angle of 108°. What percentage of total is it?',
        steps: [
          '(108° / 360°) * 100 = (3 / 10) * 100 = 30%.'
        ],
        answer: '30%',
        shortcut: '108 * (5 / 18) = 6 * 5 = 30%.'
      }
    ],
    shortcutsAndTechniques: [
      'Approximation technique: Round denominators to nearest 10 or 100 for fast option elimination.',
      'Use ratios directly without calculating absolute values when comparing two sectors.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Calculating absolute numbers when the question only asks for a ratio or percentage.',
      'Trap: Inverting the percentage increase base: Always divide by the initial value.'
    ],
    easyPracticeQuestions: getQuestionsForTopic('quant_data_interpretation'),
    mediumPracticeQuestions: getQuestionsForTopic('quant_data_interpretation'),
    examLevelPracticeQuestions: getQuestionsForTopic('quant_data_interpretation'),
    verifiedPYQs: getQuestionsForTopic('quant_data_interpretation'),
    shortRevisionNotes: [
      '360° = 100%; 1° = 5/18%.',
      'Look for ratio shortcuts before computing raw values.'
    ]
  },

  // ================= 2. GENERAL INTELLIGENCE & REASONING =================
  'reasoning_verbal_series': {
    topicId: 'reasoning_verbal_series',
    topicName: 'Series, Analogies & Classification',
    subjectId: 'reasoning',
    tier: 'both',
    prerequisites: ['Alphabet letter ranks A=1 to Z=26', 'Squares of 1-30 and cubes of 1-20'],
    simpleExplanation: 'Series, analogies, and odd-one-out questions test logical progression. Patterns commonly involve consecutive differences, prime numbers, alternating sequences, and letter positional shifts.',
    definitionsAndRules: [
      'Arithmetic Series: Common difference (d).',
      'Geometric Series: Common ratio (r).',
      'Difference of Differences: When first step differences follow a pattern (e.g. +2, +4, +8, +16).',
      'Analogy Rule: Relation between A and B must strictly apply between C and D.'
    ],
    importantFormulas: [
      { formula: 'EJOTY Rule: E=5, J=10, O=15, T=20, Y=25', description: 'Letter rank anchor points' },
      { formula: 'Reverse Rank: 27 - Forward Rank', description: 'Z=1 to A=26' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Doubling Differences Series',
        problem: '12, 14, 18, 26, 42, ?',
        steps: [
          'Differences: 14-12=2, 18-14=4, 26-18=8, 42-26=16.',
          'Next diff = 16 * 2 = 32.',
          'Missing number = 42 + 32 = 74.'
        ],
        answer: '74',
        shortcut: 'Differences are 2^n: +2, +4, +8, +16, +32.'
      }
    ],
    shortcutsAndTechniques: [
      'Check step difference first; if differences grow rapidly, test squares/cubes (n²±1, n³±1).',
      'Look for alternating sub-series in longer sequences (6+ numbers).'
    ],
    commonTrapsAndMistakes: [
      'Trap: Overcomplicating a simple difference series with complex algebraic formulas.',
      'Trap: Assuming a number is prime when it is composite (e.g. 91 = 7*13).'
    ],
    easyPracticeQuestions: getQuestionsForTopic('reasoning_verbal_series'),
    mediumPracticeQuestions: getQuestionsForTopic('reasoning_verbal_series'),
    examLevelPracticeQuestions: getQuestionsForTopic('reasoning_verbal_series'),
    verifiedPYQs: getQuestionsForTopic('reasoning_verbal_series'),
    shortRevisionNotes: [
      'Always calculate 1st and 2nd step differences.',
      'Watch for n³ - n or n² + 1 patterns.'
    ]
  },

  'reasoning_coding_relations': {
    topicId: 'reasoning_coding_relations',
    topicName: 'Coding-Decoding, Blood Relations & Direction Sense',
    subjectId: 'reasoning',
    tier: 'both',
    prerequisites: ['Opposite letter pairs (sum=27)', 'Family tree generational symbols', 'Cardinal directions (N, S, E, W)'],
    simpleExplanation: 'Coding-decoding shifts letters numerically or replaces them with opposite pairs. Blood relations use family tree diagrams (circles for female, squares for male, horizontal for siblings, vertical for generations).',
    definitionsAndRules: [
      'Opposite Letter Pairs: A-Z, B-Y, C-X, D-W, E-V, F-U, G-T, H-S, I-R, J-Q, K-P, L-O, M-N.',
      'Direction angles: Turning right from North faces East; turning left faces West.',
      'Shortest displacement uses Pythagoras Theorem: √(x² + y²).'
    ],
    importantFormulas: [
      { formula: 'Letter Rank + Opposite Rank = 27', description: 'Opposite pair identity' },
      { formula: 'Pythagorean Distance: D = √(Δx² + Δy²)', description: 'Direction displacement' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Reverse Alphabet Coding',
        problem: 'If ROSE is coded as ILHV, how is TULIP coded?',
        steps: [
          'R(18)+I(9)=27, O(15)+L(12)=27, S(19)+H(8)=27, E(5)+V(22)=27.',
          'T(20)->G, U(21)->F, L(12)->O, I(9)->R, P(16)->K.'
        ],
        answer: 'GFORK',
        shortcut: 'Opposite pair mnemonics: GT, UF, LO, IR, PK.'
      }
    ],
    shortcutsAndTechniques: [
      'In blood relations, work backwards from the last pronoun ("he is the son of my father\'s only son").',
      'Draw compass cross (+ with N at top) for direction sense problems.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Assuming gender based on names. Gender must be explicitly stated in the problem statement.',
      'Trap: Confusing sunrise shadow (falls to West) with sunset shadow (falls to East).'
    ],
    easyPracticeQuestions: getQuestionsForTopic('reasoning_coding_relations'),
    mediumPracticeQuestions: getQuestionsForTopic('reasoning_coding_relations'),
    examLevelPracticeQuestions: getQuestionsForTopic('reasoning_coding_relations'),
    verifiedPYQs: getQuestionsForTopic('reasoning_coding_relations'),
    shortRevisionNotes: [
      'Opposite sum = 27.',
      'Draw tree for relations; never assume gender without cues.',
      'Sunrise shadow points West; Sunset shadow points East.'
    ]
  },

  'reasoning_syllogism_venn': {
    topicId: 'reasoning_syllogism_venn',
    topicName: 'Syllogism, Venn Diagrams & Critical Reasoning',
    subjectId: 'reasoning',
    tier: 'both',
    prerequisites: ['Basic set concepts (subset, intersection, disjoint)'],
    simpleExplanation: 'Syllogism tests deduction from given premises regardless of real-world facts. Use overlapping Venn diagrams. Definite conclusions must hold true in EVERY possible Venn diagram.',
    definitionsAndRules: [
      'All A are B: A is inside B.',
      'Some A are B: A and B have non-empty intersection. (Converts to: Some B are A).',
      'No A is B: A and B are completely disjoint.',
      'Only a few A are B: Some A are B AND Some A are NOT B.'
    ],
    importantFormulas: [
      { formula: 'Definite Conclusion: Must hold in ALL valid diagrams', description: 'Validity test' },
      { formula: 'Complementary Pairs: (Some + No) or (All + Some Not)', description: 'Either/Or condition' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Syllogism Immediate Conversion',
        problem: 'Statements: All books are pens. Some pens are erasers. Conclusion I: Some erasers are pens.',
        steps: [
          'Statement 2: "Some pens are erasers".',
          'Immediate valid conversion is "Some erasers are pens".',
          'Conclusion I holds true definitely.'
        ],
        answer: 'Conclusion I follows',
        shortcut: '"Some X are Y" implies "Some Y are X" unconditionally.'
      }
    ],
    shortcutsAndTechniques: [
      'If both premises are positive, negative conclusions can never be definite.',
      'Either/or rule requires same subject-predicate, opposite signs, and both individually false.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Mixing real-world common sense with logical premises. If statements say "All dogs are cats", treat it as 100% true.',
      'Trap: Treating a possible conclusion as a definite conclusion.'
    ],
    easyPracticeQuestions: getQuestionsForTopic('reasoning_syllogism_venn'),
    mediumPracticeQuestions: getQuestionsForTopic('reasoning_syllogism_venn'),
    examLevelPracticeQuestions: getQuestionsForTopic('reasoning_syllogism_venn'),
    verifiedPYQs: getQuestionsForTopic('reasoning_syllogism_venn'),
    shortRevisionNotes: [
      'Definite conclusion must hold in all valid Venn diagrams.',
      'Either/Or: Same subject/predicate, one positive + one negative.'
    ]
  },

  'reasoning_non_verbal': {
    topicId: 'reasoning_non_verbal',
    topicName: 'Non-Verbal Reasoning & Visual Logic',
    subjectId: 'reasoning',
    tier: 'both',
    prerequisites: ['Symmetry and reflection principles', 'Clockwise vs Counter-clockwise rotation'],
    simpleExplanation: 'Non-verbal reasoning tests visual pattern recognition: mirror images (lateral inversion), water images (vertical inversion), paper folding/cutting, and standard dice opposite faces.',
    definitionsAndRules: [
      'Mirror Image: Left becomes Right; Top and Bottom stay unchanged.',
      'Water Image: Top becomes Bottom; Left and Right stay unchanged.',
      'Dice Rule (One face common): Rotate clockwise from the common face to find opposite pairs.',
      'Paper Cutting: Work backwards unfolding step by step with mirror reflections along fold lines.'
    ],
    importantFormulas: [
      { formula: 'Standard Dice: Sum of opposite faces = 7', description: '1-6, 2-5, 3-4' },
      { formula: 'Clockwise Face Traversal: (Common - A - B) vs (Common - C - D)', description: 'Opposite pairing' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Opposite Face on Dice',
        problem: 'Two positions of dice show (1, 2, 3) and (1, 4, 5). What is opposite 3?',
        steps: [
          'Common face is 1.',
          'Clockwise from 1 in Pos 1: 1 -> 2 -> 3.',
          'Clockwise from 1 in Pos 2: 1 -> 4 -> 5.',
          'Opposites: 2 is opposite 4; 3 is opposite 5.'
        ],
        answer: '5',
        shortcut: 'Align sequences: (1-2-3) and (1-4-5) => 3 opposite 5.'
      }
    ],
    shortcutsAndTechniques: [
      'Option elimination by distinct corner feature in mirror images.',
      'Count total dots or holes in paper punching: Number of holes multiplies by 2 with each fold.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Inverting top and bottom in mirror reflection (that is water reflection).',
      'Trap: Forgetting that opposite faces can never be adjacent on a physical cube.'
    ],
    easyPracticeQuestions: getQuestionsForTopic('reasoning_non_verbal'),
    mediumPracticeQuestions: getQuestionsForTopic('reasoning_non_verbal'),
    examLevelPracticeQuestions: getQuestionsForTopic('reasoning_non_verbal'),
    verifiedPYQs: getQuestionsForTopic('reasoning_non_verbal'),
    shortRevisionNotes: [
      'Mirror: Left <-> Right.',
      'Water: Top <-> Bottom.',
      'Dice: Move clockwise from common face.'
    ]
  },

  // ================= 3. ENGLISH LANGUAGE =================
  'english_grammar_rules': {
    topicId: 'english_grammar_rules',
    topicName: 'Grammar Foundations: Spotting Errors & Sentence Improvement',
    subjectId: 'english',
    tier: 'both',
    prerequisites: ['Basic parts of speech (nouns, verbs, prepositions, conjunctions)'],
    simpleExplanation: 'Spotting the Error and Sentence Improvement test high-yield grammar rules: Subject-Verb Agreement, Correlative Conjunctions, Third Conditionals, and Fixed Prepositions.',
    definitionsAndRules: [
      'Concord: Subject and verb must agree in number and person.',
      'Prepositional modifier rule: Verb agrees with head noun, not noun in prepositional phrase.',
      'Neither... nor / Either... or: Verb agrees with the NEAREST subject.',
      'As well as / Along with / With: Verb agrees with the FIRST subject.',
      'Third Conditional: If + Had + V3, Subject + Would have + V3.'
    ],
    importantFormulas: [
      { formula: 'Neither A nor B + Verb = Form of B', description: 'Proximity concord' },
      { formula: 'A, as well as B, + Verb = Form of A', description: 'First subject agreement' },
      { formula: 'Hardly/Scarcely... WHEN; No sooner... THAN', description: 'Inversion conjunction pairs' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Neither... nor agreement',
        problem: 'Find error: "Neither the manager nor the employees was present."',
        steps: [
          'Subjects: "manager" and "employees".',
          'Joined by "Neither... nor".',
          'Closest subject to verb is "employees" (plural).',
          '"was" must be replaced with "were".'
        ],
        answer: '"was present" -> "were present"',
        shortcut: 'Look at subject right before auxiliary verb.'
      }
    ],
    shortcutsAndTechniques: [
      'Scan for prepositional phrases (of the..., in the...) and cross them out to reveal the real subject.',
      'Rule of "Lest": Always takes "should" and never takes "not".'
    ],
    commonTrapsAndMistakes: [
      'Trap: Using "would have" in the "if" clause (e.g. "If he would have studied..."). Always use "had + V3".',
      'Trap: Using "then" instead of "than" after "No sooner".'
    ],
    easyPracticeQuestions: getQuestionsForTopic('english_grammar_rules'),
    mediumPracticeQuestions: getQuestionsForTopic('english_grammar_rules'),
    examLevelPracticeQuestions: getQuestionsForTopic('english_grammar_rules'),
    verifiedPYQs: getQuestionsForTopic('english_grammar_rules'),
    shortRevisionNotes: [
      'Neither... nor: Agree with closest subject.',
      'Along with / As well as: Agree with 1st subject.',
      'No sooner -> Than; Hardly -> When.'
    ]
  },

  'english_vocabulary': {
    topicId: 'english_vocabulary',
    topicName: 'Vocabulary: Synonyms, Antonyms, Idioms & One-Word Substitution',
    subjectId: 'english',
    tier: 'both',
    prerequisites: ['Basic root words (Latin/Greek prefixes and suffixes)'],
    simpleExplanation: 'SSC CHSL vocabulary accounts for nearly 40% of English marks. Focus on repeated high-yield words, root words (e.g. theos=god, bene=good, mal=bad, vorous=eating), and metaphorical idioms.',
    definitionsAndRules: [
      'Roots: Phil (love), Mis (hatred), Anthrop (human), Gyn (female), Gam (marriage).',
      'Atheist: Rejects existence of God.',
      'Agnostic: Believes God is unknowable.',
      'Altruist: Unselfishly helps others.',
      'Somnambulist: One who walks in sleep (somnus=sleep + ambulare=walk).'
    ],
    importantFormulas: [
      { formula: 'Prefix "Bene" = Good (Beneficial, Benevolent, Benefactor)', description: 'Positive root' },
      { formula: 'Prefix "Mal" = Bad (Malevolent, Malicious, Malignant)', description: 'Negative root' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Meaning of "Burn candle at both ends"',
        problem: 'What is the meaning of "To burn the candle at both ends"?',
        steps: [
          'Origin: Burning candle from top and bottom consumes it twice as fast.',
          'Metaphor: Overworking from early morning to late night.'
        ],
        answer: 'To work excessively hard from dawn to late night',
        shortcut: 'Think: Working 5 AM to midnight.'
      }
    ],
    shortcutsAndTechniques: [
      'Root Word Decomposition: Break unknown words into prefix + root + suffix.',
      'Context Tone: Eliminate options that do not match the positive/negative connotation.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Literal interpretation of idioms (e.g. thinking "spill the beans" involves real vegetables).',
      'Trap: Confusing homophones (e.g. Compliment = praise vs Complement = complete).'
    ],
    easyPracticeQuestions: getQuestionsForTopic('english_vocabulary'),
    mediumPracticeQuestions: getQuestionsForTopic('english_vocabulary'),
    examLevelPracticeQuestions: getQuestionsForTopic('english_vocabulary'),
    verifiedPYQs: getQuestionsForTopic('english_vocabulary'),
    shortRevisionNotes: [
      'Learn root words to unlock multiple meanings.',
      'Idioms are metaphorical, never literal.'
    ]
  },

  'english_voice_narration_pqrs': {
    topicId: 'english_voice_narration_pqrs',
    topicName: 'Active/Passive Voice, Direct/Indirect & Sentence Shuffling (Para Jumbles)',
    subjectId: 'english',
    tier: 'both',
    prerequisites: ['Tenses chart (Present, Past, Future, Continuous, Perfect)'],
    simpleExplanation: 'Voice transformation never changes the primary tense (Subject becomes Object, insert appropriate form of "be" + V3). Narration (Direct to Indirect) changes pronouns and shifts tenses backward in past reporting.',
    definitionsAndRules: [
      'Voice Rule: Tense NEVER changes. Present Perfect remains Present Perfect (has/have + been + V3).',
      'Continuous Voice: Always inserts "being" (is being, was being + V3).',
      'Direct to Indirect: Simple Present -> Simple Past; Present Perfect -> Past Perfect.',
      'Pronoun shift in narration follows SON rule: 1st person -> Subject, 2nd -> Object, 3rd -> No change.',
      'PQRS Strategy: Identify the opening independent noun sentence (never begins with pronoun or coordinating conjunction).'
    ],
    importantFormulas: [
      { formula: 'Active: S + V + O => Passive: O + Be + V3 + by S', description: 'Core Voice transformation' },
      { formula: 'Direct: Said => Indirect: Said; Said to => Told', description: 'Reporting verb shift' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Present Perfect Passive',
        problem: 'Change to passive: "The committee has approved the syllabus."',
        steps: [
          'Subject: The committee. Verb: has approved (Present Perfect). Object: the syllabus.',
          'Passive structure: Object + has/have + been + V3 + by Subject.',
          '"The syllabus has been approved by the committee."'
        ],
        answer: 'The syllabus has been approved by the committee.',
        shortcut: 'Perfect tense passive simply inserts "been".'
      }
    ],
    shortcutsAndTechniques: [
      'Option elimination in Voice: Eliminate any option that shifts the main tense (e.g. from present to past).',
      'Opening sentence in PQRS: Look for full names, definitions, or broad introductory topics.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Changing tenses in Voice like you do in Narration. Voice retains the exact tense!',
      'Trap: Forgetting that universal truths do not change tense in Indirect Speech.'
    ],
    easyPracticeQuestions: getQuestionsForTopic('english_voice_narration_pqrs'),
    mediumPracticeQuestions: getQuestionsForTopic('english_voice_narration_pqrs'),
    examLevelPracticeQuestions: getQuestionsForTopic('english_voice_narration_pqrs'),
    verifiedPYQs: getQuestionsForTopic('english_voice_narration_pqrs'),
    shortRevisionNotes: [
      'Voice: Never change primary tense; insert "be" + V3.',
      'Narration: Step back tense if reporting verb is past (said).',
      'PQRS: Find opening noun sentence first.'
    ]
  },

  'english_cloze_comprehension': {
    topicId: 'english_cloze_comprehension',
    topicName: 'Cloze Test & Reading Comprehension',
    subjectId: 'english',
    tier: 'both',
    prerequisites: ['Reading fluency', 'Contextual vocabulary and prepositions'],
    simpleExplanation: 'Cloze test presents a 5-blank passage testing grammar agreement, fixed prepositions, and tone fit. Skim the entire passage first to grasp the central theme before selecting options.',
    definitionsAndRules: [
      'Skim First Rule: Read the entire passage once without looking at options to understand topic and tone.',
      'Collocation Rule: Certain words naturally pair (e.g. "keen on", "prevent from", "cope with").',
      'Elimination: Check parts of speech needed in the blank (noun, verb, adjective, or adverb).'
    ],
    importantFormulas: [
      { formula: 'Positive tone context requires positive adjective', description: 'Tone alignment' },
      { formula: 'Preposition check: Look at the word immediately following the blank', description: 'Collocation test' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Contextual fit in Cloze Test',
        problem: '"Consistent practice is ________ to clearing SSC CHSL."',
        steps: [
          'Context is positive and describes an essential requirement.',
          '"Indispensable" means completely essential and pairs with "to".'
        ],
        answer: 'Indispensable',
        shortcut: 'Check tone: Essential = Indispensable.'
      }
    ],
    shortcutsAndTechniques: [
      'Look ahead: Often the clue for blank #2 is given in sentence #4.',
      'Grammar anchor: If blank follows "has", expect a past participle V3.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Filling blanks individually in isolation without reading the whole sentence.',
      'Trap: Picking a fancy word whose preposition does not match the following word.'
    ],
    easyPracticeQuestions: getQuestionsForTopic('english_cloze_comprehension'),
    mediumPracticeQuestions: getQuestionsForTopic('english_cloze_comprehension'),
    examLevelPracticeQuestions: getQuestionsForTopic('english_cloze_comprehension'),
    verifiedPYQs: getQuestionsForTopic('english_cloze_comprehension'),
    shortRevisionNotes: [
      'Skim whole passage before answering.',
      'Match tone and verify following prepositions.'
    ]
  },

  // ================= 4. GENERAL AWARENESS =================
  'ga_polity_constitution': {
    topicId: 'ga_polity_constitution',
    topicName: 'Indian Polity & Constitution',
    subjectId: 'general_awareness',
    tier: 'both',
    prerequisites: ['Indian Independence timeline', 'Basic organs of government: Legislature, Executive, Judiciary'],
    simpleExplanation: 'Indian Polity in SSC CHSL heavily emphasizes Articles (Part III Fundamental Rights, Part IV DPSP, Part IVA Fundamental Duties), Parliamentary powers, Supreme Court writs, and major Constitutional Amendments.',
    definitionsAndRules: [
      'Part III (Art 12-35): Fundamental Rights (Justiciable, borrowed from USA).',
      'Part IV (Art 36-51): Directive Principles of State Policy (Borrowed from Ireland).',
      'Part IVA (Art 51A): 11 Fundamental Duties (Added by 42nd Amendment 1976).',
      'Article 32: Constitutional Remedies (5 Writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto).',
      'Article 21A: Right to Education (86th Amendment 2002).'
    ],
    importantFormulas: [
      { formula: 'Articles 14-18: Right to Equality', description: 'Art 17 Abolition of Untouchability' },
      { formula: 'Articles 19-22: Right to Freedom', description: 'Art 21 Life & Personal Liberty' },
      { formula: 'Important Amendments: 42nd (Mini Constitution 1976), 44th (Deleted Property Right 1978)', description: 'Key Amendments' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Dr. Ambedkar\'s "Heart and Soul"',
        problem: 'Which Article was called Heart and Soul of the Constitution by Dr. B.R. Ambedkar?',
        steps: [
          'Dr. Ambedkar called Article 32 (Right to Constitutional Remedies) the heart and soul.',
          'It empowers the Supreme Court to issue writs to protect fundamental rights.'
        ],
        answer: 'Article 32',
        shortcut: 'Art 32 = Supreme Court writs; Art 226 = High Court writs.'
      }
    ],
    shortcutsAndTechniques: [
      'Mnemonic for Writs: "HMP CQ" (Habeas corpus, Mandamus, Prohibition, Certiorari, Quo-warranto).',
      'Emergency Articles: National (352), State/President\'s Rule (356), Financial (360).'
    ],
    commonTrapsAndMistakes: [
      'Trap: Thinking Right to Property is a Fundamental Right. It was deleted by 44th CAA 1978 and moved to Article 300A as a legal right.',
      'Trap: Confusing Preamble being called soul of constitution (Thakurdas Bhargava) with Article 32 (Dr. Ambedkar).'
    ],
    easyPracticeQuestions: getQuestionsForTopic('ga_polity_constitution'),
    mediumPracticeQuestions: getQuestionsForTopic('ga_polity_constitution'),
    examLevelPracticeQuestions: getQuestionsForTopic('ga_polity_constitution'),
    verifiedPYQs: getQuestionsForTopic('ga_polity_constitution'),
    shortRevisionNotes: [
      'Art 17: Abolition of Untouchability.',
      'Art 21A: Free education for 6-14 years.',
      'Art 32: Writs jurisdiction of Supreme Court.'
    ]
  },

  'ga_history_culture': {
    topicId: 'ga_history_culture',
    topicName: 'History, Art & Culture',
    subjectId: 'general_awareness',
    tier: 'both',
    prerequisites: ['Chronology of Indian eras: Ancient, Medieval, Modern'],
    simpleExplanation: 'Tests the 8 Classical Dances, prominent folk festivals, Indus Valley Civilization sites, Mauryan & Mughal rulers, and the Indian National Movement (1857 Revolt, INC sessions, Gandhi era).',
    definitionsAndRules: [
      '8 Classical Dances: Bharatnatyam (Tamil Nadu), Kathak (UP/North India), Kathakali (Kerala), Mohiniyattam (Kerala), Kuchipudi (Andhra Pradesh), Odissi (Odisha), Manipuri (Manipur), Sattriya (Assam).',
      'Sattriya was founded by 15th-century saint Srimanta Sankaradeva in Assam monasteries.',
      'Modern History: 1857 Revolt, 1885 INC founded by A.O. Hume, 1905 Partition of Bengal, 1919 Jallianwala Bagh, 1930 Dandi March, 1942 Quit India Movement.'
    ],
    importantFormulas: [
      { formula: 'First Viceroy of India: Lord Canning (1858)', description: 'Government of India Act 1858' },
      { formula: 'First Governor-General of Bengal: Warren Hastings', description: 'Regulating Act 1773' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Classical Dance Origins',
        problem: 'Which state did the classical dance Sattriya originate from?',
        steps: [
          'Sattriya originated in the Sattras (monasteries) of Assam.',
          'Created by Srimanta Sankaradeva.'
        ],
        answer: 'Assam',
        shortcut: 'Sattriya = Sattras of Assam.'
      }
    ],
    shortcutsAndTechniques: [
      'Buddhism Councils: 1st (Rajgir - Ajatashatru), 2nd (Vaishali - Kalashoka), 3rd (Pataliputra - Ashoka), 4th (Kundalvana - Kanishka). Mnemonic: "RAVA PA-KU".',
      'Mughal Chronology Mnemonic: "BHAJSA" (Babur, Humayun, Akbar, Jahangir, Shah Jahan, Aurangzeb).'
    ],
    commonTrapsAndMistakes: [
      'Trap: Confusing Kathakali (dance drama with elaborate face paint) with Kathak (North Indian storytelling dance).',
      'Trap: Confusing 1st Governor-General of Bengal (Warren Hastings) with 1st Governor-General of India (Lord William Bentinck).'
    ],
    easyPracticeQuestions: getQuestionsForTopic('ga_history_culture'),
    mediumPracticeQuestions: getQuestionsForTopic('ga_history_culture'),
    examLevelPracticeQuestions: getQuestionsForTopic('ga_history_culture'),
    verifiedPYQs: getQuestionsForTopic('ga_history_culture'),
    shortRevisionNotes: [
      'Sattriya: Assam (Sankaradeva).',
      'BHAJSA: Babur, Humayun, Akbar, Jahangir, Shah Jahan, Aurangzeb.',
      'Gandhi: Non-Cooperation (1920), Civil Disobedience (1930), Quit India (1942).'
    ]
  },

  'ga_geography_economy': {
    topicId: 'ga_geography_economy',
    topicName: 'Geography & Indian Economy',
    subjectId: 'general_awareness',
    tier: 'both',
    prerequisites: ['Basic map of India: Himalayan vs Peninsular regions', 'Basic economic terms: GDP, Inflation, RBI'],
    simpleExplanation: 'Geography covers Indian rivers and tributaries, mountain passes, soils, and national parks. Economics covers RBI monetary policy tools (Repo Rate, Reverse Repo, CRR), Census 2011 demographics, and Five-Year Plans.',
    definitionsAndRules: [
      'Godavari (1,465 km): Longest peninsular river ("Dakshin Ganga"), originates Trimbakeshwar, Nashik.',
      'West-flowing rivers into Arabian Sea: Narmada, Tapti, Sabarmati, Mahi, Periyar.',
      'Repo Rate: Rate at which RBI lends short-term money to commercial banks against government securities.',
      'Census 2011: Most literate state = Kerala; Highest population density = Bihar.'
    ],
    importantFormulas: [
      { formula: 'Peninsular Rivers by Length: Godavari (1465km) > Krishna (1400km) > Narmada (1312km) > Mahanadi (851km) > Kaveri (800km)', description: 'River length order' },
      { formula: 'Cash Reserve Ratio (CRR): Percentage of bank deposits kept with RBI in cash', description: 'Monetary tool' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Longest Peninsular River',
        problem: 'Which river is known as Dakshin Ganga?',
        steps: [
          'Godavari is the longest peninsular river (1,465 km).',
          'Called Dakshin Ganga or Vriddha Ganga.'
        ],
        answer: 'Godavari',
        shortcut: 'Godavari = Longest Peninsular (1465 km).'
      }
    ],
    shortcutsAndTechniques: [
      'Mnemonic for west-flowing rivers: "NAMASTE" (Narmada, Mahi, Sabarmati, Tapti).',
      'Passes: Nathu La (Sikkim), Rohtang (Himachal), Zoji La (Ladakh), Shipki La (Himachal).'
    ],
    commonTrapsAndMistakes: [
      'Trap: Confusing Godavari ("Dakshin Ganga" due to size) with Kaveri ("Ganga of the South" due to sanctity).',
      'Trap: Confusing CRR (kept in cash with RBI) with SLR (kept by bank with itself in liquid assets).'
    ],
    easyPracticeQuestions: getQuestionsForTopic('ga_geography_economy'),
    mediumPracticeQuestions: getQuestionsForTopic('ga_geography_economy'),
    examLevelPracticeQuestions: getQuestionsForTopic('ga_geography_economy'),
    verifiedPYQs: getQuestionsForTopic('ga_geography_economy'),
    shortRevisionNotes: [
      'Godavari: Longest peninsular river (1,465 km).',
      'Narmada & Tapti: Flow west into rift valleys.',
      'Repo Rate: RBI lending rate to banks.'
    ]
  },

  'ga_science_current_affairs': {
    topicId: 'ga_science_current_affairs',
    topicName: 'General Science & Current Affairs',
    subjectId: 'general_awareness',
    tier: 'both',
    prerequisites: ['Basic high school physics, chemistry, and biology'],
    simpleExplanation: 'General Science focuses on human anatomy, vitamins & deficiency diseases, SI units, common chemical compounds, and Newton\'s laws. Current Affairs emphasizes major government schemes, sports awards, and summits.',
    definitionsAndRules: [
      'Vitamin A (Retinol): Deficiency causes Night Blindness.',
      'Vitamin B1 (Thiamine): Deficiency causes Beriberi.',
      'Vitamin C (Ascorbic acid): Deficiency causes Scurvy (bleeding gums).',
      'Vitamin D (Calciferol): Deficiency causes Rickets in children.',
      'Chemical Names: Baking Soda (Sodium Bicarbonate, NaHCO₃), Washing Soda (Sodium Carbonate, Na₂CO₃·10H₂O), Plaster of Paris (CaSO₄·½H₂O).'
    ],
    importantFormulas: [
      { formula: 'SI Units: Force (Newton), Pressure (Pascal), Power (Watt), Frequency (Hertz)', description: 'Physical units' },
      { formula: 'Newton Laws: F = m*a (Second law); Action = Reaction (Third law)', description: 'Mechanics' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Vitamin C Deficiency',
        problem: 'Deficiency of Vitamin C causes which disease?',
        steps: [
          'Vitamin C is ascorbic acid.',
          'Lack of Vitamin C weakens collagen, causing Scurvy.'
        ],
        answer: 'Scurvy',
        shortcut: 'Vitamin C = Scurvy (bleeding gums).'
      }
    ],
    shortcutsAndTechniques: [
      'Fat-soluble vitamins mnemonic: "KEDA" (Vitamins K, E, D, A). Water-soluble: B and C.',
      'Optics shortcut: Concave mirror forms real and inverted images (except when object is between Pole and Focus).'
    ],
    commonTrapsAndMistakes: [
      'Trap: Confusing Baking Soda (NaHCO₃) with Washing Soda (Na₂CO₃). Baking soda has "H" (Help in cooking).',
      'Trap: Thinking Vitamin C is fat-soluble. It is water-soluble and must be regularly replenished.'
    ],
    easyPracticeQuestions: getQuestionsForTopic('ga_science_current_affairs'),
    mediumPracticeQuestions: getQuestionsForTopic('ga_science_current_affairs'),
    examLevelPracticeQuestions: getQuestionsForTopic('ga_science_current_affairs'),
    verifiedPYQs: getQuestionsForTopic('ga_science_current_affairs'),
    shortRevisionNotes: [
      'Fat-soluble: K, E, D, A. Water-soluble: B, C.',
      'Baking Soda: NaHCO₃. Plaster of Paris: CaSO₄·½H₂O.',
      'Vitamin C deficiency = Scurvy.'
    ]
  },

  // ================= 5. TIER 2: COMPUTER KNOWLEDGE MODULE =================
  'tier2_computer_basics': {
    topicId: 'tier2_computer_basics',
    topicName: 'Computer Basics, Hardware & OS',
    subjectId: 'computer_knowledge',
    tier: 'tier2',
    prerequisites: ['Basic computer components understanding'],
    simpleExplanation: 'Mandatory qualifying module in Tier 2 (15 Questions, 45 Marks). Focuses on CPU structure (ALU, CU, Registers), memory hierarchy, secondary storage, and Windows shortcuts.',
    definitionsAndRules: [
      'CPU: ALU performs arithmetic/logic; CU directs flow; Registers provide fastest immediate storage.',
      'RAM: Volatile primary memory (DRAM needs periodic refresh; SRAM does not).',
      'ROM: Non-volatile storage of BIOS/POST.',
      'Cache: High-speed SRAM between CPU and main memory to minimize latency.',
      'Windows Shortcuts: Win+D (Show Desktop), Win+L (Lock screen), Ctrl+Shift+Esc (Task Manager).'
    ],
    importantFormulas: [
      { formula: 'Memory Speed: Registers > Cache > RAM > SSD > HDD', description: 'Hierarchy speed' },
      { formula: '1 Byte = 8 Bits; 1 Nibble = 4 Bits; 1 KB = 1024 Bytes', description: 'Storage units' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Memory Between CPU and RAM',
        problem: 'Which memory sits between CPU and RAM for fastest instruction buffering?',
        steps: [
          'Processors operate faster than DRAM main memory.',
          'Cache memory (built with SRAM) buffers instructions.'
        ],
        answer: 'Cache Memory (SRAM)',
        shortcut: 'Hierarchy: Registers > Cache > RAM.'
      }
    ],
    shortcutsAndTechniques: [
      'SSD uses NAND flash memory without moving mechanical parts (faster than spinning magnetic HDD).',
      'POST (Power-On Self Test) is executed by firmware stored in ROM.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Confusing volatile memory (RAM - lost when powered off) with non-volatile (ROM, SSD - persists).',
      'Trap: Confusing 1 Nibble (4 bits) with 1 Byte (8 bits).'
    ],
    easyPracticeQuestions: getQuestionsForTopic('tier2_computer_basics'),
    mediumPracticeQuestions: getQuestionsForTopic('tier2_computer_basics'),
    examLevelPracticeQuestions: getQuestionsForTopic('tier2_computer_basics'),
    verifiedPYQs: getQuestionsForTopic('tier2_computer_basics'),
    shortRevisionNotes: [
      'Cache: High speed SRAM buffering RAM latency.',
      'RAM is volatile; ROM is non-volatile.',
      'Ctrl + Shift + Esc opens Task Manager directly.'
    ]
  },

  'tier2_ms_office_software': {
    topicId: 'tier2_ms_office_software',
    topicName: 'Software, MS Office (Word, Excel, PowerPoint)',
    subjectId: 'computer_knowledge',
    tier: 'tier2',
    prerequisites: ['Basic familiarization with Word, Excel, and PowerPoint interfaces'],
    simpleExplanation: 'Covers essential MS Office tools: MS Word formatting & Mail Merge, MS Excel cell referencing ($A$1) & formulas (SUM, AVERAGE, VLOOKUP, COUNTIF), and PowerPoint slide masters.',
    definitionsAndRules: [
      'Relative Referencing: A1 shifts dynamically as formula is dragged.',
      'Absolute Referencing: $A$1 locks column and row. F4 key toggles reference modes.',
      'Mixed Referencing: $A1 locks column only; A$1 locks row only.',
      'MS Word Shortcuts: Ctrl+E (Centre align), Ctrl+J (Justify), Ctrl+K (Insert hyperlink).'
    ],
    importantFormulas: [
      { formula: '=VLOOKUP(lookup_value, table_array, col_index, [range_lookup])', description: 'Vertical lookup in Excel' },
      { formula: '=COUNTIF(range, criteria)', description: 'Conditional counting' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Absolute Cell Referencing',
        problem: 'Which symbol creates an absolute cell reference in MS Excel (e.g. $A$1)?',
        steps: [
          'The dollar symbol ($) locks the coordinate.',
          'Shortcut is F4.'
        ],
        answer: 'Dollar sign ($)',
        shortcut: '$ = Locks the reference coordinate.'
      }
    ],
    shortcutsAndTechniques: [
      'Excel auto-sum shortcut: Alt + = (Alt plus equals).',
      'Start slide show from beginning: F5; from current slide: Shift + F5.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Confusing #REF! (invalid cell reference error) with #VALUE! (wrong data type in calculation).',
      'Trap: Forgetting that all Excel formulas must begin with an equals sign (=).'
    ],
    easyPracticeQuestions: getQuestionsForTopic('tier2_ms_office_software'),
    mediumPracticeQuestions: getQuestionsForTopic('tier2_ms_office_software'),
    examLevelPracticeQuestions: getQuestionsForTopic('tier2_ms_office_software'),
    verifiedPYQs: getQuestionsForTopic('tier2_ms_office_software'),
    shortRevisionNotes: [
      '$A$1 is absolute cell referencing.',
      'Alt + = is AutoSum in Excel.',
      'Ctrl + K inserts Hyperlink.'
    ]
  },

  'tier2_internet_cybersecurity': {
    topicId: 'tier2_internet_cybersecurity',
    topicName: 'Internet, Networking & Cyber Security',
    subjectId: 'computer_knowledge',
    tier: 'tier2',
    prerequisites: ['Basic internet browsing and email concepts'],
    simpleExplanation: 'Focuses on IP addressing (IPv4 vs IPv6), web protocols (HTTP, HTTPS, FTP, DNS), email protocols (SMTP, POP3, IMAP), and cyber security threats (viruses, worms, phishing, trojans, ransomware).',
    definitionsAndRules: [
      'IPv4: 32-bit address (e.g. 192.168.1.1); IPv6: 128-bit hexadecimal address.',
      'SMTP (Simple Mail Transfer Protocol): Sends outgoing emails.',
      'POP3 / IMAP: Retrieves incoming emails from mail server.',
      'Phishing: Deceptive social engineering masquerading as authentic institutions.',
      'Ransomware: Encrypts victim data and extorts payment for decryption key.',
      'Worm: Self-replicating malware that spreads across networks without host program.'
    ],
    importantFormulas: [
      { formula: 'IPv4 = 32 Bits (4 bytes, decimal notation); IPv6 = 128 Bits (16 bytes, hex notation)', description: 'IP address sizes' },
      { formula: 'HTTPS Port 443; HTTP Port 80; DNS Port 53; SMTP Port 25/587', description: 'Standard port numbers' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Email Impersonation Attack',
        problem: 'Which deceptive attack tricks victims via fake emails into revealing passwords?',
        steps: [
          'Attack uses spoofed emails resembling banks or institutions.',
          'This social engineering attack is called Phishing.'
        ],
        answer: 'Phishing',
        shortcut: 'Phishing = "Fishing" for passwords.'
      }
    ],
    shortcutsAndTechniques: [
      'Virus needs a host file and user execution to spread; a Worm spreads autonomously over networks.',
      'Trojan Horse disguises itself as legitimate software but delivers a hidden malicious payload.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Confusing SMTP (outgoing mail transfer) with POP3/IMAP (incoming mail retrieval).',
      'Trap: Confusing IPv4 size (32 bits) with IPv6 size (128 bits).'
    ],
    easyPracticeQuestions: getQuestionsForTopic('tier2_internet_cybersecurity'),
    mediumPracticeQuestions: getQuestionsForTopic('tier2_internet_cybersecurity'),
    examLevelPracticeQuestions: getQuestionsForTopic('tier2_internet_cybersecurity'),
    verifiedPYQs: getQuestionsForTopic('tier2_internet_cybersecurity'),
    shortRevisionNotes: [
      'IPv4 = 32 bits; IPv6 = 128 bits.',
      'SMTP sends mail; POP3/IMAP receives mail.',
      'Phishing: Social engineering credential theft.'
    ]
  }
};
