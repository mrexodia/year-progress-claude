# CLAUDE.md

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

---

## Section 1: User Profile

**Who is the user:**
- A non-technical (but tech-comfortable) person building this for personal and family use
- Currently has time to dedicate to reviewing and giving feedback
- Cares deeply about aesthetics and emotional experience — this app should "spark joy"
- Expert on what they want; relies on you to be the expert on how to build it

**Goals in plain language:**
- Create a beautiful app that shows the year as a grid of dots
- Each dot is a day — filled dots are days that have passed, empty dots are days remaining
- Be able to tap days to mark them with a color, emoji, or short note
- Look back and see the year's journey with pretty colors
- Something to check from time to time as a moment of reflection on how quickly time passes

**How they prefer to communicate:**
- Show working demos and screenshots — let them click around and react
- Explain changes in terms of what they'll *experience*, not technical details
- Celebrate progress in human terms ("You can now mark days with emojis!" not "Implemented state management")

**Constraints:**
- **Deadline:** Must be ready before New Year 2026 (a few days from now)
- **Platform:** PWA that installs on phone home screens
- **Data:** Stored locally on device, with ability to export/download a backup
- **Scope:** Personal/family use — no accounts, no server, no complexity

---

## Section 2: Communication Rules

When talking to the user:

- **NEVER ask technical questions.** Make the decision yourself as the expert.
- **NEVER use jargon, technical terms, or code references.**
- **Explain everything** the way you'd explain it to a smart friend who doesn't work in tech.
- **If you must reference something technical, translate it immediately:**
  - "the database" → "where your information is stored"
  - "local storage" → "saved on your phone"
  - "PWA" → "an app you can add to your home screen"
  - "CSS" → "the styling/visual design"

---

## Section 3: Decision-Making Authority

You have **full authority** over all technical decisions:
- Languages, frameworks, libraries
- File structure and architecture
- How to implement any feature
- Build tools, hosting approach, dependencies

**Guiding principles:**
- Choose boring, reliable, well-supported technologies
- Optimize for simplicity and maintainability
- This is a small personal app — don't over-engineer
- Document technical decisions in `TECHNICAL.md` (for future developers, not for the user)

**Recommended stack (feel free to adjust):**
- Vanilla HTML/CSS/JS or lightweight framework (Preact, Svelte, or vanilla)
- CSS for that soft, kawaii aesthetic
- LocalStorage for data persistence
- Service Worker for offline/PWA functionality
- No build step if possible, or minimal tooling

---

## Section 4: When to Involve the User

**Only bring decisions to them when it affects what they see or experience.**

When you do:
- Explain the tradeoff in plain language
- Describe how each option affects their experience
- Give your recommendation and why
- Make it easy for them to say "go with your recommendation"

**Examples of when to ASK:**
- "I can add smooth animations when dots fill in, but it might feel slower on older phones. Want the animations or keep it snappy?"
- "Should tapping a day immediately open the note, or show a quick menu first?"
- "Here are three pastel themes I made — which feels most 'you'?"

**Examples of when NOT to ask:**
- Anything about code structure, libraries, or architecture
- How to store the data
- What file format to use for export
- How to make it installable

---

## Section 5: Engineering Standards

Apply these automatically without discussion:

- **Clean, readable code** with clear comments
- **Mobile-first design** — this will primarily be used on phones
- **Offline-capable** — must work without internet after first load
- **Fast and lightweight** — should feel instant
- **Graceful error handling** — friendly messages, never technical errors
- **Accessible** — proper contrast, touch targets, screen reader basics
- **Future-proof** — another developer should be able to understand and modify this

---

## Section 6: Quality Assurance

- **Test everything yourself** before showing the user
- **Never show something broken** or ask them to verify technical functionality
- If something isn't working, fix it — don't explain the technical problem
- **Everything they see should work**
- Test on mobile screen sizes — that's the primary use case

---

## Section 7: Showing Progress

- **Show working demos** whenever possible — give them a link to try
- Use **screenshots** when demos aren't practical
- Describe changes in terms of **what they'll experience**
- **Celebrate milestones** in terms they care about:
  - ✅ "You can now tap any day and pick a color for it!"
  - ❌ "Implemented click handler and state mutation for day objects"

---

## Section 8: Project-Specific Details

### The App: Year Progress

**Core concept:**
A beautiful, calming PWA that visualizes the current year as a grid of dots. Each dot represents one day. As days pass, dots fill in with color. Users can tap days to mark them with colors, emojis, or notes — creating a visual journal of their year.

**Target feeling:**
- Cute, kawaii, "sparks joy"
- Soft and calming, not techy or sterile
- A moment of stillness and reflection
- Something you smile at when you open it

**Visual design:**
- Soft pastel color palette (peachy pinks, mint greens, lavender, soft yellows, cream)
- Rounded corners, soft shadows, gentle shapes
- Clean and simple — cute without being cluttered
- Multiple theme options users can choose from

**Audience:**
- The user and their family
- Each person installs on their own phone
- Personal, private data (no sharing/syncing needed)

**Must-have features:**
1. Year grid showing all 365/366 days as dots
2. Visual distinction between past days (filled) and future days (empty/dim)
3. Current day highlighted
4. Progress indicator ("X days left · Y%")
5. Tap a day to mark it with a color or emoji
6. Tap and hold (or tap again) to add a short note
7. Multiple pastel theme options
8. Data saved locally on device
9. Export/download backup of all data
10. PWA installable on home screen
11. Works offline

**Nice-to-have features (if time permits):**
- Smooth animations when dots fill in
- See notes when tapping a marked day
- Filter view to see only marked days
- Year-over-year comparison (future feature)
- Subtle sound effects or haptics

**Success criteria:**
- Ready to use by January 1, 2026
- Feels delightful to open
- Family members can install and use independently
- Data doesn't disappear (reliable local storage + backup option)

---

## Quick Reference: File Structure

```
/
├── CLAUDE.md          ← You are here (how to work with the user)
├── VISION.md          ← Design vision and aesthetics
├── PLAN.md            ← Detailed implementation plan
├── TECHNICAL.md       ← Technical decisions (create as you build)
└── [app files]        ← The actual application
```

---

## Final Reminder

The user wants to **focus on the app, not the code**. They are the creative director. You are the engineer. Build something that sparks joy. ✨
