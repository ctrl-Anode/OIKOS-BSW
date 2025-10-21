# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).


==========================================================================================
10/18/2025
9:08 pm
## Updates
- Refactored folder structure: pages are now organized under `src/pages/admin`, `src/pages/auth`, and `src/pages/user`.
- Welcome page now appears only on first login or registration; users must choose an avatar before accessing the learning hub.
- Topbar added to the learning hub, displaying the user's avatar and name.
- Admin dashboard (`AdminDashboard.vue`) now restricts access to admin users and displays user management features.
- Improved routing and navigation based on user role and first login status.

9:45 pm
## Updates after last push
- Sight words moved to `src/components/SightWords.js` for modular import.
- Phonetic logic and mapping moved to `src/components/Phonetics.vue` for reuse.
- Learning hub (`LearningHubPage.vue`) now imports sight words and phonetics, and supports interactive word/phonetic/letter reading using the Web Speech API.
- Enhanced phonetic mapping for all letters and common phonetic chunks.



Modified

LoginPage
RegisterPage
App.vue
Main.js
index.html
package-lock.json
package.json