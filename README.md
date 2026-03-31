# Sunny Steps

**An interactive learning app for young children with Down syndrome from ages 4–8**

Sunny Steps is a warm, accessible, and joyful web app that helps children learn core skills through gentle games and positive reinforcement. 

---

##  What's Inside

| World | Topic | Skills |
|-------|-------|--------|
| Numbers & Colors | Counting 1–5, color names | Math readiness, visual recognition |
| ABCs | Letters A–H, first sounds | Phonics, literacy foundations |
| Feelings | Emotion faces | Emotional literacy, self-awareness |
| Shapes | Circle, triangle, square, star | Spatial reasoning, geometry |
| Friends & Sharing | Greetings, sharing, turn-taking | Social skills, empathy |
| Animals | Animal names, sounds, habitats | Language, curiosity |

**48 total questions** (8 per world), shuffled each session.

---

## Features

- **Child Mode** — big buttons, no time pressure, celebratory confetti on correct answers
- **Guide Mode** — shows a tip for the caregiver or teacher on every question
- **Progress tracking** — best scores saved in the browser (no account needed)
- **Star ratings** — earn stars for each world
- **Keyboard accessible** — works with Tab + Enter navigation
- **Mobile friendly** — works on phones, tablets, and desktop
- **No login, no ads, no data collection** — fully private

---

## How to Use

### Option 1 – GitHub Pages (live link)
Visit the live app at:
```
https://YOUR-USERNAME.github.io/sunny-steps/
```

### Option 2 – Run locally
```bash
git clone https://github.com/YOUR-USERNAME/sunny-steps.git
cd sunny-steps
# Open index.html in your browser — no build step needed!
open index.html
```

---

## 📁 File Structure

```
sunny-steps/
├── index.html        # Main app shell
├── css/
│   └── style.css     # All styles (warm, accessible, child-friendly)
├── js/
│   ├── data.js       # All 6 worlds × 8 questions + guide tips
│   └── app.js        # Game logic, scoring, confetti
└── README.md
```

---

## Designed For

This app was created with children with Down syndrome in mind, following inclusive design principles:

- **No time pressure** — children move at their own pace
- **Large touch targets** — easy to tap on tablets
- **Repetition-friendly** — questions shuffle so replaying feels fresh
- **Positive reinforcement only** — encouraging messages on every outcome
- **Caregiver tips** — every question includes a guide-mode tip for parents and teachers
- **High contrast, clear fonts** — Nunito font for readability

---

##  Extending the App

Want to add more questions or worlds? Edit `js/data.js`:

```js
// Add a new question to any world:
{
  icon: '🍌',
  text: 'Banana starts with which letter?',
  sub: 'Bb... Bb... Banana!',
  choices: [
    { emoji: 'A', label: 'A' },
    { emoji: 'B', label: 'B' },
    { emoji: 'C', label: 'C' },
    { emoji: 'D', label: 'D' },
  ],
  answer: 'B',
  praise: 'B is for Banana! 🍌',
  tip: 'Peel an imaginary banana together! B, B, Banana!',
},
```

---

## 📜 License

MIT — free to use, share, and adapt for educational and non-commercial purposes.

---

