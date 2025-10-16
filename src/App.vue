<template>
  <router-view />
</template>

<script setup>
// App.vue now dynamically renders components based on the route
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