# CHSL Mastery — SSC CHSL 2026 Complete Preparation Platform

> **"From Absolute Beginner to Exam-Ready Selection Level"**  
> *Target Examination Cycle: Staff Selection Commission Combined Higher Secondary Level (SSC CHSL 2026)*

---

## 1. Overview & Core Philosophy

**CHSL Mastery** is a functional, student-focused preparation platform built specifically for aspirants preparing for **SSC CHSL 2026**.

- **No Mandatory Login:** Anyone can immediately open the platform to browse the official syllabus, read structured 13-stage concept lessons, solve topic-wise practice drills, and take full computer-based examination (CBE) mock tests.
- **Dedicated Tier 1 & Tier 2 Architecture:** Independent dashboards, syllabus trackers, marking schemes, and mock tests for:
  - **Tier 1 (Objective CBE):** 100 Questions, 200 Marks, 60 minutes (-0.50 negative marking).
  - **Tier 2 (Session I CBE + Session II Typing Test):** 135 Questions, 360 Marks (+3 / -1) and mandatory qualifying Computer Knowledge Module, alongside an official 35 WPM English / 30 WPM Hindi typing simulator.
- **Verified PYQs vs Original Practice:** Clear provenance badges distinguish actual verified previous-year questions (with year and shift citations) from high-yield practice questions.
- **Realistic Analytics:** No invented percentiles or fake national ranks. Real calculated accuracy, time-spent forensics, time-sink alerts, and actionable recommendations.

---

## 2. Key Modules & Features

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CHSL MASTERY 2026 PLATFORM ARCHITECTURE              │
├──────────────────┬──────────────────┬──────────────────┬───────────────┤
│ Tier 1 & Tier 2  │ 13-Part Concept  │ Adaptive         │ Full Mock     │
│ Syllabus Tracker │ Learning System  │ Practice Engine  │ Test Lab      │
├──────────────────┼──────────────────┼──────────────────┼───────────────┤
│ Smart Mistake    │ Spaced Revision  │ Personalized     │ Subject Tools │
│ Notebook         │ (SM-2 Scheduler) │ Study Roadmap    │ & Typing Lab  │
├──────────────────┴──────────────────┴──────────────────┴───────────────┤
│    AI Study Mentor (Local Expert Engine) • Admin Content Management    │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Dedicated Tier 1 & Tier 2 Sections
- **Tier 1:** Quantitative Aptitude, General Intelligence (Reasoning), English Language, General Awareness (25 Qs each).
- **Tier 2:** Section I (Mathematical Abilities + Reasoning, 60 Qs), Section II (English + General Awareness, 60 Qs), Section III (Computer Knowledge Module, 15 Qs, qualifying), and Session II Skill/Typing test.

### 2. 13-Part Pedagogical Learning System
Every syllabus topic follows a uniform 13-point learning structure:
1. Prerequisites & foundational concepts.
2. Concept explained in plain, simple English.
3. Definitions and core exam rules.
4. Important formulas & cheat sheet.
5. Step-by-step solved examples with expandable derivations.
6. 10-second shortcuts and speed math techniques.
7. Common traps and distractors.
8. Easy practice questions.
9. Medium-level questions.
10. Exam-level questions.
11. Verified PYQ spotlight with shift citation.
12. Interactive topic test (must score ≥70% to mark completed).
13. Short revision notes.
- Includes a **"Explain from Zero"** mode for beginners and **"Revise Quickly"** express mode.
- Student self-assessment marker: *Understood*, *Partially Understood*, *Difficult*.

### 3. Adaptive Practice Engine
- Topic-wise, mixed-subject, and difficulty filters (Easy, Medium, Difficult).
- **Learning Mode:** Instant feedback with distractor analysis explaining why each wrong option is a trap.
- **Test Mode:** Exam-style submission before evaluation.
- Automatic logging of incorrect attempts directly into the Mistake Notebook.

### 4. Smart Mistake Notebook (Error Notebook)
- Automatically captures incorrect answers with timestamps, selected vs correct answers, and solutions.
- Mistake Categorization:
  - Concept not understood
  - Formula forgotten
  - Calculation error
  - Question misread
  - Guessing
  - Time pressure
- Student notes editor.
- **"Fix Your Mistakes"** daily drill session. Mistakes are marked resolved only when the follow-up question is solved correctly.

### 5. Spaced Revision System (SM-2 Algorithm)
- Formula Book deck (Math & Mensuration).
- High-Yield SSC Vocabulary deck (with Mnemonics, Hindi meaning, Synonyms & Antonyms).
- Indian Polity & Constitution Articles deck.
- Last-Minute Exam Booster mode.

### 6. Full Mock Test Lab (CBE Exam Simulator)
- Official countdown timer with automatic submission on expiry.
- Color-coded question palette: Answered (Green), Not Answered (Red), Marked for Review (Purple), Not Visited (Gray).
- Save & Next, Mark for Review, Clear Response, and Keyboard Navigation (1-4 for options, S for Save, M for Mark, C for Clear).
- Forensic Performance Analyser with time-sink warnings (>120s), speed vs accuracy diagnoses, and next-step actions.

### 7. Subject Tools & Skill Practice
- **Speed Math:** Squares (11-40), Cubes (1-20), Fraction-to-percentage table, Pythagorean triplets.
- **English:** 120 Grammar Rules master reference with exam tips.
- **Official Typing Simulator:** Timed passages benchmarked to official SSC standards (35 WPM English / 30 WPM Hindi) with live WPM, accuracy %, error tracking, and qualifying benchmark indicators.

### 8. AI Study Mentor
- Step-by-step math solver, concept explainer, option trap analyzer, and study advisor.
- Uses a reliable local pedagogical expert engine with zero external API key requirements.

---

## 3. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
- **Backend API:** Python 3 Flask, SQLite database, secure cookie sessions.
- **Client Persistence:** LocalStorage service for instant guest access + Cloud sync via Flask REST API.
- **Deployment:** Zero-config Vercel (`vercel.json`), Netlify (`_redirects`), and Python WSGI.

---

## 4. Local Execution & Launch

### Quick Launch (Windows)
Double-click `start.bat` or run:
```cmd
start.bat
```

### Manual Launch
1. **Start Backend Server:**
   ```bash
   python backend/app/main.py
   ```
   *Serves the complete application at `http://localhost:5000`.*

2. **Frontend Development Server:**
   ```bash
   cd frontend
   node node_modules/vite/bin/vite.js --port 3000
   ```

---

## 5. Public HTTPS Deployment Guide

### Deploying to Vercel (Recommended)
1. Push this repository to GitHub or GitLab.
2. In [Vercel Dashboard](https://vercel.com), click **Add New Project** and select this repository.
3. Set **Root Directory** to `frontend`.
4. Build command: `vite build` (or leave default).
5. Output directory: `dist`.
6. Click **Deploy**. The included `frontend/vercel.json` will automatically route all routes cleanly.

### Deploying to Netlify
1. Connect your repository to [Netlify](https://www.netlify.com).
2. Base directory: `frontend`.
3. Publish directory: `frontend/dist`.
4. Build command: `npm run build`.
5. The included `_redirects` file ensures direct URL deep-linking without 404s.
