<template>
  <div id="app" class="app">
    <header class="site-header">
      <div class="container header-inner">
        <h1 class="logo">OIKOS · BSW</h1>
        <nav class="nav">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#contact">Contact</a>
          <button class="btn btn-primary" @click="openSignup">Get Started</button>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-copy">
            <h2>Basic sight‑work progressive learning assistance</h2>
            <p class="lead">
              Adaptive practice, gentle progression, and clear progress insights — designed to help learners build confidence
              with short, focused sight‑work sessions.
            </p>

            <ul class="quick-features">
              <li>Adaptive difficulty that adjusts to each learner</li>
              <li>Short practice bursts to build automaticity</li>
              <li>Visual and audio cues for multimodal learning</li>
            </ul>

            <div class="hero-actions">
              <button class="btn btn-primary" @click="openSignup">Start free</button>
              <a class="btn btn-ghost" href="#how">How it works</a>
            </div>
          </div>

          <div class="hero-preview" aria-hidden="true">
            <div class="card-preview">
              <div class="card-header">
                <strong>Session</strong>
                <span class="small-muted">5 min • Level 1</span>
              </div>
              <div class="card-body">
                <div class="tile">see</div>
                <div class="tile">run</div>
                <div class="tile">jump</div>
                <div class="tile">play</div>
              </div>
              <div class="card-footer">
                <div class="progress">
                  <div class="progress-bar" :style="{ width: '36%' }"></div>
                </div>
                <small class="small-muted">36% complete</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="container features">
        <h3 class="section-title">What it offers</h3>
        <div class="features-grid">
          <article class="feature">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"></path></svg>
            <h4>Adaptive learning</h4>
            <p>Content adjusts automatically to keep practice challenging but achievable.</p>
          </article>

          <article class="feature">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"></path></svg>
            <h4>Short focused sessions</h4>
            <p>Designed for attention spans of early learners — 3–7 minute bursts with immediate feedback.</p>
          </article>

          <article class="feature">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18M12 3v18"></path></svg>
            <h4>Progress tracking</h4>
            <p>Clear, actionable metrics for caregivers and teachers to guide next steps.</p>
          </article>

          <article class="feature">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z"></path></svg>
            <h4>Multimodal cues</h4>
            <p>Combine visual and audio prompts to support different learning styles.</p>
          </article>
        </div>
      </section>

      <section id="how" class="how container">
        <h3 class="section-title">How it works</h3>
        <ol class="how-steps">
          <li>
            <strong>Assess:</strong> Short warm-up to set starting level.
          </li>
          <li>
            <strong>Practice:</strong> Timed bursts with spaced repetition and immediate feedback.
          </li>
          <li>
            <strong>Review:</strong> Simple progress cards and suggested next sessions.
          </li>
        </ol>
      </section>

      <section id="contact" class="container contact">
        <h3 class="section-title">Get in touch</h3>
        <p class="small-muted">Questions, feedback, or to request a classroom pilot.</p>
        <form class="contact-form" @submit.prevent="submitContact">
          <input v-model="contact.name" type="text" placeholder="Your name" required />
          <input v-model="contact.email" type="email" placeholder="Email" required />
          <textarea v-model="contact.message" placeholder="Message" rows="3"></textarea>
          <div class="form-actions">
            <button class="btn btn-primary" type="submit">Send</button>
            <button class="btn btn-ghost" type="button" @click="clearContact">Clear</button>
          </div>
        </form>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container">
        <small>© <span>{{ year }}</span> OIKOS · BSW — Built for learners</small>
      </div>
    </footer>

    <div v-if="signupOpen" class="modal" role="dialog" aria-modal="true" aria-label="Sign up">
      <div class="modal-panel">
        <button class="modal-close" @click="closeSignup" aria-label="Close">✕</button>
        <h4>Create a free account</h4>
        <p class="small-muted">Start a demo session in seconds.</p>
        <form @submit.prevent="submitSignup">
          <input v-model="signup.email" type="email" placeholder="Email" required />
          <input v-model="signup.name" type="text" placeholder="Name" />
          <div class="form-actions">
            <button class="btn btn-primary" type="submit">Create account</button>
            <button class="btn btn-ghost" type="button" @click="closeSignup">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const year = new Date().getFullYear()
const signupOpen = ref(false)
const signup = ref({ email: '', name: '' })
const contact = ref({ name: '', email: '', message: '' })

function openSignup() {
  signupOpen.value = true
}
function closeSignup() {
  signupOpen.value = false
}
function signupSubmitData(payload) {
  // placeholder: integrate with your backend or auth provider
  console.log('signup', payload)
}
function submitSignup() {
  signupSubmitData({ ...signup.value })
  signupOpen.value = false
  signup.value = { email: '', name: '' }
  alert('Thanks — check your email to continue.')
}

function submitContact() {
  // placeholder: send contact data
  console.log('contact', contact.value)
  clearContact()
  alert('Thanks — we will reply soon.')
}
function clearContact() {
  contact.value = { name: '', email: '', message: '' }
}
</script>

<style scoped>
:root {
  --bg: #f8fafc;
  --card: #fff;
  --muted: #6b7280;
  --primary: #2563eb;
  --accent: #06b6d4;
  --radius: 12px;
  --container: 1100px;
}

* { box-sizing: border-box; }
.app { background: var(--bg); color: #111827; min-height: 100vh; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }

.container { max-width: var(--container); margin: 0 auto; padding: 2rem; }

.site-header { background: white; border-bottom: 1px solid #e6e9ee; position: sticky; top: 0; z-index: 20; }
.header-inner { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
.logo { font-weight:700; letter-spacing:0.8px; margin:0; padding:0.25rem 0; }

.nav { display:flex; gap:0.75rem; align-items:center; }
.nav a { color:var(--muted); text-decoration:none; font-weight:600; }
.btn { border: none; padding: 0.6rem 1rem; border-radius: 8px; font-weight:600; cursor:pointer; }
.btn-primary { background: linear-gradient(180deg,var(--primary), #1e40af); color: white; box-shadow: 0 6px 18px rgba(37,99,235,0.12); }
.btn-ghost { background: transparent; color: var(--primary); border: 1px solid rgba(37,99,235,0.12); }

.hero { padding-top: 3rem; padding-bottom: 3rem; }
.hero-grid { display:grid; grid-template-columns: 1fr 360px; gap: 2rem; align-items:center; }
.hero-copy h2 { margin: 0 0 0.5rem 0; font-size: 1.8rem; }
.lead { color: var(--muted); margin-bottom: 1rem; }

.quick-features { list-style:none; padding:0; margin: 0 0 1rem 0; display:grid; gap:0.5rem; color:var(--muted); }
.quick-features li::before { content: "•"; margin-right:0.5rem; color:var(--accent); }

.hero-actions { display:flex; gap:0.5rem; margin-top:0.5rem; }
.hero-preview { display:flex; justify-content:center; }
.card-preview { width:100%; background:var(--card); border-radius: var(--radius); box-shadow: 0 10px 30px rgba(2,6,23,0.06); padding:1rem; display:flex; flex-direction:column; gap:0.75rem; }
.card-header { display:flex; justify-content:space-between; align-items:center; }
.card-body { display:grid; grid-template-columns: repeat(2, 1fr); gap:0.5rem; }
.tile { background:#f1f5f9; padding:0.6rem; border-radius:8px; text-align:center; font-weight:700; }
.card-footer .progress { height:8px; background:#eef2ff; border-radius:999px; overflow:hidden; margin-bottom:0.4rem; }
.progress-bar { height:100%; background: linear-gradient(90deg,var(--accent), var(--primary)); transition: width 400ms; }

.features { padding-top: 2rem; padding-bottom: 2rem; }
.section-title { margin:0 0 1rem 0; font-size:1.2rem; }
.features-grid { display:grid; grid-template-columns: repeat(2,1fr); gap:1rem; }
.feature { background:var(--card); border-radius:12px; padding:1rem; box-shadow: 0 6px 18px rgba(2,6,23,0.04); }
.feature h4 { margin:0.5rem 0 0.25rem; }
.icon { width:28px; height:28px; fill: #0f172a; opacity:0.85; }

.how { padding-top:1rem; padding-bottom:1rem; }
.how-steps { list-style:decimal; padding-left:1.25rem; color:var(--muted); }

.contact { padding-top:1rem; padding-bottom:3rem; }
.contact-form { display:grid; gap:0.5rem; max-width:520px; }
.contact-form input, .contact-form textarea, .modal-panel input {
  border:1px solid #e6e9ee; padding:0.6rem; border-radius:8px; background:white;
}
.form-actions { display:flex; gap:0.5rem; }

.site-footer { border-top:1px solid #e6e9ee; padding:1rem 0; color:var(--muted); }

.modal { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(2,6,23,0.45); z-index:50; }
.modal-panel { background:var(--card); width: min(420px, 95%); border-radius:12px; padding:1rem; position:relative; }
.modal-close { position:absolute; right:10px; top:8px; background:transparent; border:none; font-size:1rem; cursor:pointer; }

.small-muted { color:var(--muted); font-size:0.9rem; }

@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr; text-align:center; }
  .hero-preview { order: -1; }
  .features-grid { grid-template-columns: 1fr; }
  .nav { gap:0.5rem; }
  .header-inner { padding:0 1rem; }
  .container { padding:1rem; }
}
</style>