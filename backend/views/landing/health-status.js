(() => {
  const raw = document.querySelector('#raw-json');
  const status = document.querySelector('#service-status');
  const checked = document.querySelector('#checked');
  const json = document.querySelector('#json');
  let timeout;

  function show(payload) {
    const seconds = payload.uptimeSeconds;
    const units = [
      [Math.floor(seconds / 86400), 'd'],
      [Math.floor(seconds % 86400 / 3600), 'h'],
      [Math.floor(seconds % 3600 / 60), 'm'],
      [seconds % 60, 's'],
    ];
    const first = units.findIndex(([value]) => value > 0);
    document.querySelector('#uptime').textContent = units.slice(first).map(([value, unit]) => value + unit).join(' ');
    status.className = 'badge ACTIVE';
    status.textContent = payload.status;
    json.textContent = JSON.stringify(payload, null, 2);
    checked.dateTime = payload.timestamp;
    checked.textContent = new Date(payload.timestamp).toLocaleTimeString();
  }

  async function refresh() {
    if (!document.hidden) {
      try {
        const response = await fetch(raw.href, { headers: { Accept: 'application/json' }, cache: 'no-store' });
        if (!response.ok) throw new Error(String(response.status));
        show(await response.json());
      } catch {
        status.className = 'badge REJECTED';
        status.textContent = 'down';
        checked.dateTime = new Date().toISOString();
        checked.textContent = new Date(checked.dateTime).toLocaleTimeString();
      }
    }
    timeout = setTimeout(refresh, 5000);
  }

  show(JSON.parse(json.textContent));
  timeout = setTimeout(refresh, 5000);
  addEventListener('pagehide', () => clearTimeout(timeout));
  addEventListener('pageshow', (event) => {
    if (event.persisted) refresh();
  });
})();
