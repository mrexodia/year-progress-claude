# Year Progress

Tech stack:
- [pi](https://shittycodingagent.ai/) by @badlogic
- [beads](https://github.com/steveyegge/beads) by @steveyegge

Someone sent me [this X post](https://x.com/CoachDanGo/status/2005855611112554561), so I figured I would give it a try with Claude Opus 4.5 and GLM 4.7. Initially I had an [interview-style chat](https://claude.ai/share/4520d196-5bdb-45b2-92c8-1b80e987e500) with Claude to plan, then I initialized `beads` with a pi hook in [`.pi/hooks/bd-prime.ts`](.pi/hooks/bd-prime.ts) and duplicated the repo. From there the prompt was:

> Convert the plan into beads issues and start work. Do not stop until the whole app is compeleted.

After that I just tried the app and gave feedback until it was in a reasonable state. The app turned into a bit of a journal to get more interactivity. I also tried with Gemini 2.5 Pro, but it was an utter disaster.

## Results

|[Opus 4.5](https://github.com/mrexodia/year-progress-claude)|[GLM 4.7](https://github.com/mrexodia/year-progress-glm)|
|-|-|
|<img width="1206" height="2436" alt="image" src="https://github.com/user-attachments/assets/839344db-c785-46c2-8d00-49115b482a55" />|<img width="1206" height="2436" alt="image" src="https://github.com/user-attachments/assets/ea443472-d857-4d81-9ba0-e88de15ab184" />|
|Cost: $15.39, [transcript](https://htmlpreview.github.io/?https://github.com/mrexodia/year-progress-claude/blob/master/session.html), LLM time: 36m41s|Cost: $8.34, [transcript](https://htmlpreview.github.io/?https://github.com/mrexodia/year-progress-glm/blob/master/session.html), LLM time: 52m15s|

## Key learnings

- Beads
  - Enforces a workflow of commit+push by the model, which I really do not like
  - Claude struggled to adhere to the protocol until I reminded it
  - GLM dutifully created commits for every task completion.
- Both models struggled with background processes
  - Initially both used port 8080, getting confused
  - Previous solution: https://github.com/mrexodia/vision-server/blob/master/Makefile
  - Project config + start/stop/status commands should work
- This manual development loop was extremely time-consuming
  - Probably some kind of browser-use tool could help with this
