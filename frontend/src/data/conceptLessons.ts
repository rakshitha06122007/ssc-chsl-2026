import { ConceptLesson, Question } from '../types/chsl';
import { QUESTION_BANK } from './questionBank';

export const CONCEPT_LESSONS: Record<string, ConceptLesson> = {
  'quant_percentage_profit': {
    topicId: 'quant_percentage_profit',
    topicName: 'Percentages, Profit & Loss and Discount',
    subjectId: 'quantitative_aptitude',
    tier: 'both',
    prerequisites: [
      'Basic arithmetic operations (addition, multiplication, division)',
      'Basic knowledge of fractions and decimals (e.g. 1/4 = 0.25)',
      'Understanding of base values in mathematical comparisons'
    ],
    simpleExplanation: 'Percentage literally means "per hundred" (Latin: per centum). Think of percentage as a standardized scale out of 100 so you can compare any two fractions easily. In business math, Cost Price (CP) is your foundational base (100%). If you sell above CP, you make a Profit; if you sell below CP, you incur a Loss. When a shopkeeper sets a price tag, that is the Marked Price (MP). Any Discount is always subtracted from the Marked Price, not the Cost Price!',
    definitionsAndRules: [
      'Base Rule: Unless stated otherwise, Profit % and Loss % are ALWAYS calculated on Cost Price (CP).',
      'Discount Rule: Discount % is ALWAYS calculated on Marked Price (MP).',
      'Selling Price (SP) with Profit: SP = CP * (1 + P%/100).',
      'Selling Price (SP) with Discount: SP = MP * (1 - D%/100).',
      'Breakeven: SP = CP means 0% profit and 0% loss.',
      'Dishonest Dealer Rule: Gain % = [Error / (True Value - Error)] * 100.'
    ],
    importantFormulas: [
      { formula: 'Profit % = (SP - CP) / CP * 100', description: 'Standard profit percentage on cost price' },
      { formula: 'Loss % = (CP - SP) / CP * 100', description: 'Standard loss percentage on cost price' },
      { formula: 'Net Successive Change = a + b + (ab / 100)', description: 'Use + for increase/markup and - for discount/decrease' },
      { formula: 'MP / CP = (100 + P%) / (100 - D%)', description: 'Direct Golden Formula connecting Marked Price, Cost Price, Profit % and Discount %' },
      { formula: 'Fraction Table: 1/6 = 16.66%, 1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11%', description: 'Crucial for saving 40 seconds per question in SSC CHSL' }
    ],
    stepByStepExamples: [
      {
        title: 'Example 1: Golden Ratio of MP to CP',
        problem: 'A trader gives a discount of 20% on the marked price and still earns a profit of 20%. By what percentage is the marked price higher than the cost price?',
        steps: [
          'Step 1: Identify given variables. Discount D = 20%, Profit P = 20%.',
          'Step 2: Recall the SSC Golden Equation: MP / CP = (100 + P%) / (100 - D%).',
          'Step 3: Substitute the values: MP / CP = (100 + 20) / (100 - 20) = 120 / 80 = 3 / 2.',
          'Step 4: If CP = 2 units, MP = 3 units. Markup = 3 - 2 = 1 unit on CP of 2.',
          'Step 5: Markup Percentage = (1 / 2) * 100 = 50%.'
        ],
        answer: 'The marked price is 50% above the cost price.',
        shortcut: 'Direct ratio: (100 + 20) / (100 - 20) = 120 / 80 = 3 / 2 => 1/2 markup = 50% in 10 seconds!'
      },
      {
        title: 'Example 2: Two Articles Sold at Same SP',
        problem: 'Two articles are sold for ₹9,600 each. On the first, the seller gains 20%, and on the second, he loses 20%. What is his overall profit or loss percentage and absolute amount?',
        steps: [
          'Step 1: Notice that Selling Prices are EQUAL (SP1 = SP2) and the percentage gain equals percentage loss (x = 20%).',
          'Step 2: In such cases, there is ALWAYS an overall LOSS given by: Loss % = (x / 10)² = (20 / 10)² = 4%.',
          'Step 3: Total SP = 9600 + 9600 = ₹19,200.',
          'Step 4: Since overall loss is 4%, Total SP represents 96% of Total CP.',
          'Step 5: Total CP = 19200 / 0.96 = ₹20,000.',
          'Step 6: Total Loss in Rupees = ₹20,000 - ₹19,200 = ₹800.'
        ],
        answer: 'Overall Loss of 4% (₹800 loss).',
        shortcut: 'Loss % = x²/100 = 400/100 = 4% loss. Absolute loss = Total SP * [x² / (10000 - x²)] = 19200 * (4/96) = ₹800.'
      }
    ],
    shortcutsAndTechniques: [
      'The Multiplier Method: Instead of writing 100 + 15%, multiply by 1.15. For 25% discount, multiply by 0.75 (or 3/4).',
      'Two successive discounts of d1% and d2%: Single equivalent discount = (d1 + d2 - d1*d2/100)%. Example: 20% and 10% = 20 + 10 - 2 = 28%.',
      'Three successive discounts: Combine first two, then combine the result with the third.',
      'Dishonest seller using 900g instead of 1000g: He keeps 100g profit on actual dispensed cost of 900g. Profit % = (100 / 900) * 100 = 11.11%.'
    ],
    commonTrapsAndMistakes: [
      'Trap 1: Applying discount on Cost Price. Discount is strictly deducted from Marked Price.',
      'Trap 2: Assuming equal SP with +20% and -20% results in No Profit No Loss. It is always a 4% LOSS because the gain base CP is smaller than the loss base CP.',
      'Trap 3: Dishonest dealer formula trap: Dividing error by 1000g instead of 900g. The shopkeeper\'s investment is the 900g he actually gave out!'
    ],
    easyPracticeQuestions: [
      QUESTION_BANK[1] // Successive discounts question
    ],
    mediumPracticeQuestions: [
      QUESTION_BANK[0]
    ],
    examLevelPracticeQuestions: [
      QUESTION_BANK[2]
    ],
    verifiedPYQs: [
      QUESTION_BANK[1]
    ],
    shortRevisionNotes: [
      'Markup = MP - CP; Discount = MP - SP; Profit = SP - CP.',
      'MP / CP = (100 + Profit %) / (100 - Discount %).',
      'When SP is same with +x% and -x%: Net result is ALWAYS Loss = x² / 100 %.',
      'When CP is same with +x% and -x%: Net result is ALWAYS No Profit, No Loss.',
      'Successive discount of a% and b% = a + b - (ab/100)%.'
    ]
  },

  'quant_number_systems': {
    topicId: 'quant_number_systems',
    topicName: 'Number Systems & Basic Arithmetic',
    subjectId: 'quantitative_aptitude',
    tier: 'both',
    prerequisites: [
      'Place value and face value of digits',
      'Basic multiplication tables and prime numbers (2, 3, 5, 7, 11, 13, 17, 19, 23, 29)'
    ],
    simpleExplanation: 'Number Systems in SSC tests your understanding of how numbers behave when divided, multiplied, or raised to large powers. The most repeated questions in SSC CHSL are Divisibility Rules (especially composite divisors like 72, 88, 99), Cyclicity of Unit Digits, and Remainder Theorem.',
    definitionsAndRules: [
      'Divisibility by 3 or 9: The sum of all digits must be divisible by 3 or 9.',
      'Divisibility by 4: Last 2 digits must be divisible by 4.',
      'Divisibility by 8: Last 3 digits must be divisible by 8.',
      'Divisibility by 11: Alternating difference of digit sums (Odd places - Even places) must be 0 or a multiple of 11.',
      'Divisibility by 72: Number must be simultaneously divisible by both 8 and 9 (coprime factors of 72).',
      'Divisibility by 88: Number must be simultaneously divisible by both 8 and 11.'
    ],
    importantFormulas: [
      { formula: 'Dividend = (Divisor * Quotient) + Remainder', description: 'Euclid Division Lemma' },
      { formula: 'Unit Digit Cyclicity: 2, 3, 7, 8 have cyclicity of 4', description: 'Divide power by 4, remainder gives index' },
      { formula: '4 and 9 have cyclicity of 2: 4¹=4, 4²=6; 9¹=9, 9²=1', description: 'Odd power retains base, even power transforms' },
      { formula: '0, 1, 5, 6 have cyclicity of 1: Always end in same digit', description: 'Any power of 5 ends in 5; any power of 6 ends in 6' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: 72 Divisibility with Missing Digits',
        problem: 'If 897359y6 is divisible by 72, what is the maximum value of y?',
        steps: [
          'Step 1: Break 72 into coprime factors: 8 * 9.',
          'Step 2: Check Divisibility by 8 on last three digits: "9y6".',
          'Step 3: Test y values: For 9y6 to be divisible by 8, divide 900 by 8: 900 / 8 = 112 with rem 4. 916/8=no; 936/8 = 117 (y=3); 976/8 = 122 (y=7).',
          'Step 4: Check Divisibility by 9: Sum of digits = 8 + 9 + 7 + 3 + 5 + 9 + y + 6 = 47 + y.',
          'Step 5: For 47 + y to be divisible by 9, nearest multiple is 54 => y = 54 - 47 = 7.',
          'Step 6: Since y = 7 also satisfies 976 divisible by 8 (976 / 8 = 122), y = 7 is the answer!'
        ],
        answer: 'y = 7',
        shortcut: 'Digit sum 47 + y = 9k => 4 + 7 + y = 11 + y => 2 + y = 9 => y = 7.'
      }
    ],
    shortcutsAndTechniques: [
      'Digital Sum trick for 9: Strike out all 9s and pairs adding to 9 immediately to save time.',
      'Unit digit for 7^95: Divide 95 by 4 -> 95 = 4*23 + 3 (remainder 3). Unit digit is 7³ = 343 -> 3.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Factoring 72 as 12 * 6. Always factor into COPRIME integers (whose HCF is 1): 8 and 9.',
      'Trap: Remainder can never be negative or greater than or equal to the divisor.'
    ],
    easyPracticeQuestions: [QUESTION_BANK[0]],
    mediumPracticeQuestions: [QUESTION_BANK[0]],
    examLevelPracticeQuestions: [QUESTION_BANK[0]],
    verifiedPYQs: [QUESTION_BANK[0]],
    shortRevisionNotes: [
      'Rule of 8: Test only last 3 digits.',
      'Rule of 11: (Sum of odd places) - (Sum of even places) = 0 or 11k.',
      'Rule of 72 = 8 and 9; Rule of 88 = 8 and 11; Rule of 99 = 9 and 11.'
    ]
  },

  'ga_polity_constitution': {
    topicId: 'ga_polity_constitution',
    topicName: 'Indian Polity & Constitution',
    subjectId: 'general_awareness',
    tier: 'both',
    prerequisites: [
      'Basic understanding of the three pillars of Indian democracy: Legislature, Executive, Judiciary',
      'Knowledge of the Indian Independence timeline'
    ],
    simpleExplanation: 'The Constitution of India was adopted on 26 November 1949 and came into effect on 26 January 1950. Dr. B.R. Ambedkar was the Chairman of the Drafting Committee. In SSC CHSL, questions heavily focus on Articles (Part III Fundamental Rights, Part IV DPSP, Part IVA Fundamental Duties), Parliamentary procedures, and Constitutional Amendments.',
    definitionsAndRules: [
      'Part I (Art 1-4): The Union and its territory.',
      'Part II (Art 5-11): Citizenship.',
      'Part III (Art 12-35): Fundamental Rights (Justiciable in courts under Art 32 & 226).',
      'Part IV (Art 36-51): Directive Principles of State Policy (Non-justiciable, borrowed from Ireland).',
      'Part IVA (Art 51A): 11 Fundamental Duties (Added by 42nd Amendment 1976 on Swaran Singh Committee recommendation; 11th duty added by 86th Amendment 2002).'
    ],
    importantFormulas: [
      { formula: 'Right to Equality: Articles 14 to 18', description: 'Art 14 (Equality before law), Art 15 (No discrimination), Art 16 (Equal opportunity in public employment), Art 17 (Abolition of Untouchability), Art 18 (Abolition of Titles)' },
      { formula: 'Right to Freedom: Articles 19 to 22', description: 'Art 19 (6 Freedoms), Art 20 (Protection against conviction), Art 21 (Life & Liberty), Art 21A (Right to Education, 86th CAA)' },
      { formula: '5 Writs under Art 32 & 226', description: 'Habeas Corpus (To have the body), Mandamus (We command), Prohibition, Certiorari, Quo-Warranto (By what authority)' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Writ Jurisdiction Difference',
        problem: 'How does the writ jurisdiction of the Supreme Court under Article 32 differ from that of the High Court under Article 226?',
        steps: [
          'Step 1: Scope: Supreme Court can issue writs ONLY for enforcement of Fundamental Rights (Part III).',
          'Step 2: High Court (Art 226) can issue writs for Fundamental Rights AND for "any other legal right" (wider jurisdiction).',
          'Step 3: Territory: Supreme Court has pan-India writ jurisdiction; High Court is limited to state territory (unless cause of action arose therein).',
          'Step 4: Remedy: Article 32 itself is a Fundamental Right (Supreme Court cannot refuse to hear); Article 226 is discretionary.'
        ],
        answer: 'High Court writ jurisdiction is wider in subject matter than the Supreme Court.',
        shortcut: 'Remember: High Court (226) = Wider subject scope; Supreme Court (32) = Broader territorial scope.'
      }
    ],
    shortcutsAndTechniques: [
      'Mnemonic for 6 Fundamental Rights: "Eat Fast Everywhere, Claim Real Rights" (Equality, Freedom, Exploitation, Religion, Cultural & Educational, Remedies).',
      'Mnemonic for Writs: "HMP CQ" -> Habeas corpus, Mandamus, Prohibition, Certiorari, Quo-warranto.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Right to Property was originally in Art 31, but was DELETED as a Fundamental Right by the 44th Constitutional Amendment Act 1978 and made a legal right under Article 300A.',
      'Trap: Fundamental Duties were NOT in the original 1950 constitution; they were inserted by the 42nd Amendment in 1976.'
    ],
    easyPracticeQuestions: [QUESTION_BANK[6]],
    mediumPracticeQuestions: [QUESTION_BANK[6]],
    examLevelPracticeQuestions: [QUESTION_BANK[6]],
    verifiedPYQs: [QUESTION_BANK[6]],
    shortRevisionNotes: [
      'Art 17: Abolition of Untouchability (Most asked in SSC).',
      'Art 21A: Right to free & compulsory education for children 6-14 years (86th Amendment 2002).',
      'Art 32: Heart & Soul of Constitution (Dr. Ambedkar).',
      'Art 40: Organization of Village Panchayats (Gandhian Principle).',
      'Art 44: Uniform Civil Code (UCC).'
    ]
  },

  'tier2_computer_basics': {
    topicId: 'tier2_computer_basics',
    topicName: 'Computer Basics, Hardware & OS',
    subjectId: 'computer_knowledge',
    tier: 'tier2',
    prerequisites: [
      'Basic familiarity with personal computers and operating systems'
    ],
    simpleExplanation: 'The Computer Knowledge module in SSC CHSL Tier 2 is mandatory and qualifying in nature (15 Questions, 45 Marks, 15 Minutes). You must score qualifying marks to be considered for merit. The key areas are Computer Organization, Memory Types, Windows OS features, MS Office, and Networking.',
    definitionsAndRules: [
      'CPU (Central Processing Unit): Contains ALU (Arithmetic Logic Unit), CU (Control Unit), and Registers.',
      'RAM (Random Access Memory): Primary volatile memory (data lost on power down). Dynamic RAM (DRAM) requires periodic refresh.',
      'ROM (Read Only Memory): Primary non-volatile memory storing BIOS (Basic Input/Output System) and bootstrap loader.',
      'Cache Memory: High-speed SRAM built into the CPU processor die (L1, L2, L3) to buffer instructions.',
      'Ports: USB (Universal Serial Bus), HDMI (High-Definition Multimedia Interface), RJ-45 (Ethernet network jack).'
    ],
    importantFormulas: [
      { formula: '1 Byte = 8 Bits; 1 Nibble = 4 Bits', description: 'Basic binary measurements' },
      { formula: '1 KB = 1024 Bytes; 1 MB = 1024 KB; 1 GB = 1024 MB; 1 TB = 1024 GB', description: 'Binary storage units' },
      { formula: 'Windows Shortcuts: Win + D (Desktop), Win + L (Lock screen), Ctrl + Shift + Esc (Task Manager)', description: 'Crucial Tier 2 questions' }
    ],
    stepByStepExamples: [
      {
        title: 'Example: Memory Hierarchy Order',
        problem: 'Arrange the following in increasing order of storage capacity and decreasing order of speed: Cache, Registers, HDD, RAM.',
        steps: [
          'Step 1: Speed from fastest to slowest: Registers > Cache > RAM > HDD.',
          'Step 2: Capacity from smallest to largest: Registers (Bytes) < Cache (MBs) < RAM (GBs) < HDD (TBs).',
          'Step 3: Cost per bit: Registers (most expensive) down to HDD (cheapest per GB).'
        ],
        answer: 'Fastest: Registers -> Cache -> RAM -> HDD. Largest Capacity: HDD -> RAM -> Cache -> Registers.',
        shortcut: 'Hierarchy triangle: Tip is smallest/fastest (CPU registers); Base is largest/slowest (HDD/Tape).'
      }
    ],
    shortcutsAndTechniques: [
      'SRAM vs DRAM: Static RAM uses flip-flops (faster, no refresh, used in Cache). Dynamic RAM uses capacitor-transistor pairs (slower, needs refresh, used in main system RAM).',
      'SSD vs HDD: Solid State Drives use NAND flash memory with zero moving parts, making them 5-10x faster than mechanical spinning magnetic platters.'
    ],
    commonTrapsAndMistakes: [
      'Trap: Confusing RAM with ROM. RAM is read-write and volatile; ROM is read-only and non-volatile.',
      'Trap: Confusing Bit (b) and Byte (B). 8 Megabits = 1 Megabyte.'
    ],
    easyPracticeQuestions: [QUESTION_BANK[9]],
    mediumPracticeQuestions: [QUESTION_BANK[9]],
    examLevelPracticeQuestions: [QUESTION_BANK[9]],
    verifiedPYQs: [QUESTION_BANK[9]],
    shortRevisionNotes: [
      'Registers: Fastest internal CPU storage.',
      'Cache: SRAM bridging CPU and DRAM latency.',
      'POST (Power-On Self-Test): Initial hardware diagnostic routine executed by BIOS stored in ROM.',
      'Ctrl + Z (Undo), Ctrl + Y (Redo), F2 (Rename selected file in Windows Explorer).'
    ]
  }
};
