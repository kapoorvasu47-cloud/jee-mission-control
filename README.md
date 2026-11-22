# JEE Mission Control — Build 2

A responsive installable app for Android and laptop browsers, with local persistence, study planning, focus timer, mock tracking, backup/restore, and an optional private sync server.

## Run locally
- Install Node.js 18+ (only needed for the sync server / Android build).
- For a quick browser preview, run `python -m http.server 8000` in this folder and open `http://localhost:8000`.
- For PWA install/offline support, deploy the folder to an HTTPS origin. In Chrome/Edge, choose Install app / Add to Home Screen.

## Cross-device sync (included, needs hosting)
The app has explicit Push / Pull controls. Run `node sync-server.js` after setting `SYNC_KEY` to a random secret at least 24 characters long. The server stores one private JSON state record in `sync-data.json`.
- Configure the same HTTPS server URL and key in the app on both devices.
- Push from the device with the newest progress, then Pull on the other.
- The server has no user accounts or multi-user separation; it is intended for one private user.
- Do not expose the plain HTTP server directly to the public internet. Put it behind HTTPS/TLS (e.g. a reverse proxy) and restrict access. Use a strong secret and keep backups.
- The app does not silently merge conflicting edits; Push replaces the server copy and Pull replaces the local copy, with confirmation prompts.

## Build Android app
Requires Android Studio, Android SDK, Java, and Node.js:
1. `npm install`
2. `npx cap add android`
3. `npx cap sync android`
4. `npx cap open android`
5. In Android Studio, build a signed APK/AAB for your own device/testing.

This package includes the Capacitor configuration, but **does not contain a compiled APK**. A real APK must be built with the Android SDK and signed. The current alarm implementation is browser-level; dependable alarms while the app is killed require a native Android alarm/notification plugin and Android permissions. Do not rely on this browser alarm as an emergency alarm.

## Included features
- Responsive dashboard, 60-day sprint planner, completion checklist
- Theory / PYQ / revision / break focus timer and session log
- Routine and alarm preference
- Mock test scores, accuracy and mistake notes
- Local autosave; JSON backup export/import
- Optional private server Push/Pull sync
- PWA manifest/service worker and Capacitor Android wrapper

## Date and study-plan note
The sprint dates are 23 Nov 2026 through 21 Jan 2027, matching the schedule target supplied for this project. Chapter targets are suggested planning prompts; review them against your own completed chapters and the current official exam syllabus.

## Build a desktop installer (Windows / macOS / Linux)
The project now includes an Electron desktop wrapper, so the same app can run in its own desktop window and be packaged as an installer.
- Install Node.js 18+ on the target build computer.
- In this folder, run `npm install`.
- To run the desktop app locally: `npm run desktop:start`.
- To create a Windows installer: `npm run desktop:build:win`. The installer is written to `release/`.
- For macOS or Linux, use `npm run desktop:build:mac` or `npm run desktop:build:linux` on the matching operating system.

The desktop installer and Android APK are separate packages built from the same app source. Local data is stored separately on each device. To share progress, configure the included private sync server and use Push/Pull on both devices; sync is not automatic until a hosted HTTPS server is configured.


## JEE Test Centre (Build 4)

The app now includes a CBT-style Test Centre with a timer, question palette, answer selection, mark-for-review, clear response, submit confirmation, score calculation (+4 / -1 / 0), and worked explanations. It includes a chapter catalogue for Physics, Chemistry, and Mathematics and an original starter bank of 18 questions.

**Important content status:** this is a first functional question-bank release, not yet a complete 75-question NTA-format mock or a fully populated test for every listed chapter. Chapter-wise tests are available for chapters represented in the starter bank; other chapters are listed and will show a clear not-yet-populated message. Expand and validate the question bank before treating practice scores as representative. The 2027 official syllabus and bulletin should be used as the final content checklist.

`test-center.js` is included in the Windows desktop package and must remain beside `index.html`. The service worker caches it for offline use.

## JEE Test Centre (Build 5 — scheduled test framework)
- Adds a 60-day timetable-linked night-test schedule (9:30–10:30 PM) and labels revision/mixed-practice days for a 180-minute session.
- Shows the day's Physics, Chemistry and Mathematics targets and a completion checklist linked to the planner's saved task state.
- Adds a full Physics/Chemistry/Mathematics chapter catalogue, with the count of currently available questions for each chapter.
- Adds 10 planned full-mock slots, each labelled 180 minutes / 75 questions / 300 marks. These are placeholders until the complete papers are authored and checked.
- Existing chapter tests now correctly filter by the selected subject and chapter.

**Important:** this is the schedule/interface expansion, not the completed question bank requested. The original bank still contains only 18 questions, so most chapter packs and all 10 full mock papers are not yet populated. The day schedule will not pretend unrelated questions are a topic-specific test. The daily/revision timer can be set to 60/180 minutes for available matched starter packs, but those packs are not yet full-length tests. Questions are original practice questions inspired by common JEE concepts; they are not presented as verbatim official PYQs. A future content pass must add and verify original PYQ-style questions or properly sourced question references chapter by chapter.


## Build 6 — 60-day test strategy update
- Reworked the 60-day timetable into six-day study blocks followed by a 3-hour cumulative checkpoint on every 7th day.
- Added three final full-syllabus mock / final checkpoint days plus a final error-repair day.
- Added daily test and analysis tasks to the study checklist.
- Added official NTA JEE Main links for shift-wise question papers and syllabus.
- Important: the schedule is complete, but the verified question bank is not yet complete. The current 18-question starter bank must not be treated as 60 complete daily papers or as full-length mocks. Chapter packs and complete 75-question mocks remain to be authored/validated.


## Build 7 Test Suite update
- Test Centre now includes launchable Daily (12 questions / 60 min), Weekly cumulative (24 / 180 min), Monthly revision (36 / 180 min), Half-syllabus (40 / 180 min), and Full-syllabus mock sessions (75 / 180 min).
- The question bank contains 76 original JEE Main-style practice questions, balanced to provide at least 25 questions per subject for full mocks. These are original practice questions, not verbatim official PYQs.
- Ten full-mock launch slots rotate the order of the same current 75-question bank; they are not ten independent question papers yet. The bank needs to be expanded substantially for truly distinct mocks and detailed chapter coverage.
- Daily sessions try to match each day’s planned topic first, then fill with rotating high-yield PCM questions. They are available every day; broader chapter coverage remains an ongoing improvement.
- Each submitted test saves its own maximum score and accuracy to the score tracker.


## Build 11 note
The Test Centre engine is embedded directly in `index.html` so the Sample Test does not depend on Chrome loading a separate JavaScript file. Open `index.html` from the extracted folder.


## Build 14 — Separate Test Window and chapter question bank

- The Test Centre is split into three compact sections: **Daily & Sample**, **Chapter Bank**, and **Revision & Mocks**. The actual exam opens in a separate **Test Window** with timer, question palette, answer navigation, mark-for-review, submit, score and explanations.
- The chapter catalogue contains 68 study-friendly packs across Physics, Chemistry and Mathematics. Each pack contains at least 50 questions; selected high-priority chapters contain 100. The current generated bank totals 5,600 questions.
- Chapter tests offer 50-question packs, or 100-question packs where available. If a 100-question selection is made for a 50-question chapter, the app automatically uses that chapter's full 50-question pack.
- Daily tests are linked to the selected day's timetable topics. Day 1 currently maps to Physics Electrostatics, Chemistry Solutions and Mathematics Matrices; it launches 24 questions (8 from each mapped chapter) in a 60-minute test window.
- The 15-question sample is separate from Day 1. Weekly, monthly, half-syllabus and 10 full-mock launch slots are also available.
- **Question provenance:** the expanded 5,600-item bank is original, programmatically parameter-varied practice content, not a collection of verbatim official JEE Main PYQs. Some generated items use reusable concept templates and should be checked for academic accuracy before being treated as a final coaching-quality question bank.
- The archive contains app source files. It is not a compiled Android APK or Windows installer.

## Open in Chrome
1. Extract the ZIP fully into a new folder.
2. Open `jee_mission_app` and double-click `index.html`.
3. Open the **JEE Test Centre** tab. Choose **Daily & Sample**, **Chapter Bank**, or **Revision & Mocks**.
4. Starting any test opens the separate **Test Window**.


## Build 14 question-quality update

Build 14 adds a curated competitive layer of 30 original, multi-step questions for the Day 1 chapters: Electrostatics, Solutions and Matrices. Daily and cumulative tests prefer these tougher questions when they are available. Existing repeated template questions are now honestly labelled Foundation / Concept Check. The 30 curated questions are original practice and are not represented as official NTA PYQs. This is a first chapter-quality pass, not yet a complete rewrite of every chapter pack.
