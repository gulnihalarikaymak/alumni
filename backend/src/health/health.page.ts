import type { HealthPayload } from './health.controller';
import { escapeHtml } from '../common/html';

export function renderHealthPage(p: HealthPayload, path: string): string {
  const json = escapeHtml(JSON.stringify(p, null, 2));
  const jsonUrl = `${path}?format=json`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ATS - Health</title>
  <style>
    :root {
      --bg: #f4f4f9; --card: #ffffff; --text: #2c3e50; --muted: #7f8c8d;
      --line: #e6e8ee; --ok: #27ae60; --ok-soft: #e8f7ee; --bad: #c0392b; --bad-soft: #fbeaea;
      --link: #3498db; --code-bg: #1e2433; --code-text: #d7dde8;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #12151c; --card: #1b1f29; --text: #e6e9ef; --muted: #9aa3b2;
        --line: #2a3040; --ok: #3ddc84; --ok-soft: #1c3326; --bad: #ff6b5e; --bad-soft: #3a1f1d;
        --link: #5dade2; --code-bg: #0f121a; --code-text: #d7dde8;
      }
    }
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
      margin: 0; min-height: 100vh; background: var(--bg); color: var(--text);
      display: flex; align-items: center; justify-content: center; padding: 16px;
    }
    .card {
      width: 100%; max-width: 560px; background: var(--card);
      border-radius: 12px; box-shadow: 0 6px 24px rgba(0,0,0,0.08); padding: 28px;
    }
    header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    h1 { font-size: 1.35rem; margin: 0; }
    .sub { color: var(--muted); margin: 4px 0 0; font-size: .9rem; }
    .badge {
      display: inline-flex; align-items: center; gap: 8px; white-space: nowrap;
      background: var(--ok-soft); color: var(--ok); font-weight: 600;
      padding: 6px 12px; border-radius: 999px; font-size: .85rem; text-transform: uppercase;
    }
    .badge.down { background: var(--bad-soft); color: var(--bad); }
    .dot { width: 9px; height: 9px; border-radius: 50%; background: currentColor; animation: pulse 2s infinite; }
    .badge.down .dot { animation: none; }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 24px 0; }
    .item { border: 1px solid var(--line); border-radius: 8px; padding: 12px 14px; }
    .label { color: var(--muted); font-size: .75rem; text-transform: uppercase; letter-spacing: .04em; }
    .value { font-size: 1.05rem; font-weight: 600; margin-top: 4px; font-variant-numeric: tabular-nums; word-break: break-word; }
    pre {
      background: var(--code-bg); color: var(--code-text); border-radius: 8px;
      padding: 14px 16px; overflow-x: auto; font-size: .85rem; margin: 8px 0 0;
    }
    .links { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 20px; font-size: .9rem; }
    .links a { color: var(--link); text-decoration: none; }
    .links a:hover { text-decoration: underline; }
    .foot { color: var(--muted); font-size: .8rem; margin: 16px 0 0; }
    @media (max-width: 420px) { .grid { grid-template-columns: 1fr; } .card { padding: 20px; } }
  </style>
</head>
<body>
  <main class="card">
    <header>
      <div>
        <h1>Alumni Tracking System</h1>
        <p class="sub">Backend health check</p>
      </div>
      <span class="badge" id="badge"><span class="dot"></span><span id="status">${escapeHtml(p.status)}</span></span>
    </header>

    <section class="grid">
      <div class="item"><div class="label">Service</div><div class="value">${escapeHtml(p.service)}</div></div>
      <div class="item"><div class="label">Version</div><div class="value">${escapeHtml(p.version)}</div></div>
      <div class="item"><div class="label">Uptime</div><div class="value" id="uptime">-</div></div>
      <div class="item"><div class="label">Environment</div><div class="value">${escapeHtml(p.environment)}</div></div>
    </section>

    <div class="label">JSON response</div>
    <pre id="json">${json}</pre>

    <div class="links">
      <a href="${escapeHtml(jsonUrl)}">Raw JSON</a>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </div>
    <p class="foot">Last checked: <span id="checked"></span> &middot; refreshes every 5 s</p>
  </main>

  <script>
    var initial = ${JSON.stringify(p).replace(/</g, '\\u003c')};
    var jsonUrl = ${JSON.stringify(jsonUrl).replace(/</g, '\\u003c')};
    function fmtUptime(s) {
      var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600),
          m = Math.floor(s % 3600 / 60), sec = s % 60;
      return (d ? d + 'd ' : '') + (d || h ? h + 'h ' : '') + (d || h || m ? m + 'm ' : '') + sec + 's';
    }
    function render(p) {
      document.getElementById('badge').className = 'badge';
      document.getElementById('status').textContent = p.status;
      document.getElementById('uptime').textContent = fmtUptime(p.uptimeSeconds);
      document.getElementById('json').textContent = JSON.stringify(p, null, 2);
      document.getElementById('checked').textContent = new Date(p.timestamp).toLocaleTimeString();
    }
    function down() {
      document.getElementById('badge').className = 'badge down';
      document.getElementById('status').textContent = 'down';
      document.getElementById('checked').textContent = new Date().toLocaleTimeString();
    }
    render(initial);
    setInterval(function () {
      fetch(jsonUrl, { headers: { Accept: 'application/json' }, cache: 'no-store' })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(render)
        .catch(down);
    }, 5000);
  </script>
</body>
</html>`;
}
