function buildUiPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Request Inspector</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #08080f;
      --surface: rgba(255,255,255,0.04);
      --surface-hover: rgba(255,255,255,0.07);
      --surface-active: rgba(129,140,248,0.1);
      --border: rgba(255,255,255,0.08);
      --border-focus: rgba(129,140,248,0.45);
      --text: #e2e8f0;
      --muted: #64748b;
      --accent: #818cf8;
      --accent-glow: rgba(129,140,248,0.15);
      --green: #34d399; --green-bg: rgba(52,211,153,0.1); --green-bd: rgba(52,211,153,0.22);
      --blue: #60a5fa;  --blue-bg: rgba(96,165,250,0.1);  --blue-bd: rgba(96,165,250,0.22);
      --amber: #fbbf24; --amber-bg: rgba(251,191,36,0.1);  --amber-bd: rgba(251,191,36,0.22);
      --red: #f87171;   --red-bg: rgba(248,113,113,0.1);  --red-bd: rgba(248,113,113,0.22);
      --purple: #a78bfa;--purple-bg: rgba(167,139,250,0.1);--purple-bd: rgba(167,139,250,0.22);
      --r: 10px; --r-sm: 7px;
    }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      height: 100vh;
      overflow: hidden;
    }
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse 70% 55% at 10% -10%, rgba(99,102,241,0.1) 0%, transparent 55%),
        radial-gradient(ellipse 55% 40% at 95% 110%, rgba(139,92,246,0.08) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }
    .app { position: relative; z-index: 1; display: flex; height: 100vh; }

    /* ── Sidebar ── */
    .sidebar {
      width: 268px; min-width: 268px;
      display: flex; flex-direction: column;
      border-right: 1px solid var(--border);
      background: rgba(0,0,0,0.3);
    }
    .sidebar-top {
      padding: 16px 13px 11px;
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }
    .logo { display: flex; align-items: center; gap: 9px; margin-bottom: 11px; }
    .logo-icon {
      width: 26px; height: 26px;
      background: linear-gradient(135deg, #6366f1, #a78bfa);
      border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; flex-shrink: 0;
    }
    .logo-text { font-size: 13px; font-weight: 600; letter-spacing: -0.02em; }
    .sidebar-actions { display: flex; align-items: center; justify-content: space-between; }
    .req-count { font-size: 11px; color: var(--muted); }
    .live-btn {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 11px; font-weight: 500;
      padding: 3px 9px; border-radius: 999px;
      border: 1px solid var(--border); background: transparent; color: var(--muted);
      cursor: pointer; transition: all 0.14s;
    }
    .live-btn:hover { border-color: var(--accent); color: var(--accent); }
    .live-btn.on { border-color: var(--green-bd); color: var(--green); background: var(--green-bg); }
    .live-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
    .live-btn.on .live-dot { animation: blink 1.1s ease-in-out infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .req-list { flex: 1; overflow-y: auto; padding: 5px; }
    .req-list::-webkit-scrollbar { width: 3px; }
    .req-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
    .req-card {
      display: block; width: 100%; padding: 9px 10px; border-radius: var(--r);
      border: 1px solid transparent; background: transparent;
      text-align: left; cursor: pointer; color: var(--text);
      transition: background 0.13s, border-color 0.13s; margin-bottom: 1px;
    }
    .req-card:hover { background: var(--surface); border-color: var(--border); }
    .req-card.active { background: var(--surface-active); border-color: var(--border-focus); }
    .card-row1 { display: flex; align-items: center; gap: 7px; margin-bottom: 3px; }
    .mbadge {
      font-size: 9px; font-weight: 700; letter-spacing: 0.07em;
      padding: 2px 6px; border-radius: 5px;
      font-family: 'JetBrains Mono', monospace; flex-shrink: 0;
    }
    .m-POST   { background:var(--green-bg);  color:var(--green);  border:1px solid var(--green-bd); }
    .m-GET    { background:var(--blue-bg);   color:var(--blue);   border:1px solid var(--blue-bd); }
    .m-PUT    { background:var(--amber-bg);  color:var(--amber);  border:1px solid var(--amber-bd); }
    .m-DELETE { background:var(--red-bg);    color:var(--red);    border:1px solid var(--red-bd); }
    .m-PATCH  { background:var(--purple-bg); color:var(--purple); border:1px solid var(--purple-bd); }
    .m-OTHER  { background:var(--surface);   color:var(--muted);  border:1px solid var(--border); }
    .card-time { font-size: 11px; color: var(--muted); margin-left: auto; }
    .card-path {
      font-size: 12px; font-weight: 500;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text); margin-bottom: 3px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .card-meta { font-size: 11px; color: var(--muted); }

    /* ── Main ── */
    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
    .req-bar { padding: 13px 17px 0; flex-shrink: 0; }
    .req-bar-inner { display: flex; align-items: center; gap: 9px; padding-bottom: 11px; }
    .req-bar-path { font-size: 14px; font-weight: 500; font-family: 'JetBrains Mono', monospace; }
    .req-bar-sub { font-size: 12px; color: var(--muted); margin-left: auto; white-space: nowrap; }
    .tab-strip { display: flex; border-bottom: 1px solid var(--border); }
    .tab-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 13px; font-size: 13px; font-weight: 500;
      color: var(--muted); background: transparent;
      border: none; border-bottom: 2px solid transparent;
      cursor: pointer; transition: color 0.13s, border-color 0.13s;
      margin-bottom: -1px;
    }
    .tab-btn:hover { color: var(--text); }
    .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
    .tab-n {
      font-size: 11px; min-width: 18px; text-align: center;
      padding: 1px 5px; border-radius: 8px; background: var(--surface);
    }
    .tab-btn.active .tab-n { background: var(--accent-glow); color: var(--accent); }

    /* ── Inspector grid ── */
    .igrid { flex: 1; display: grid; grid-template-columns: 268px 1fr; overflow: hidden; min-height: 0; }
    .items-col { border-right: 1px solid var(--border); overflow-y: auto; padding: 7px; }
    .items-col::-webkit-scrollbar { width: 3px; }
    .items-col::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
    .item-btn {
      display: block; width: 100%; padding: 8px 10px; border-radius: var(--r-sm);
      border: 1px solid transparent; background: transparent;
      text-align: left; cursor: pointer; color: var(--text);
      transition: background 0.13s, border-color 0.13s; margin-bottom: 1px;
    }
    .item-btn:hover { background: var(--surface); border-color: var(--border); }
    .item-btn.active { background: var(--surface-active); border-color: var(--border-focus); }
    .item-k {
      display: block; font-size: 12px; font-weight: 500;
      font-family: 'JetBrains Mono', monospace; color: var(--accent); margin-bottom: 2px;
    }
    .item-v { font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* ── Value column ── */
    .val-col { overflow-y: auto; padding: 15px 17px; display: flex; flex-direction: column; gap: 13px; }
    .val-col::-webkit-scrollbar { width: 3px; }
    .val-col::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
    .val-empty { margin-top: 36px; display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--muted); text-align: center; }
    .val-empty-icon { font-size: 28px; opacity: 0.2; }
    .sec-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); margin-bottom: 6px; display: block; }
    .val-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px; }
    .copy-btn {
      font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: var(--r-sm);
      border: 1px solid var(--border); background: var(--surface); color: var(--muted);
      cursor: pointer; transition: all 0.13s;
    }
    .copy-btn:hover { border-color: var(--accent); color: var(--accent); }
    .url-actions { display: flex; gap: 7px; flex-wrap: wrap; }
    .url-open {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 7px 13px; border-radius: var(--r-sm);
      background: var(--accent-glow); border: 1px solid var(--border-focus);
      color: var(--accent); font-size: 13px; font-weight: 500;
      text-decoration: none; transition: background 0.13s;
    }
    .url-open:hover { background: rgba(129,140,248,0.25); }

    /* Preview */
    .preview-frame {
      border: 1px solid var(--border); border-radius: var(--r);
      overflow: hidden; background: #000;
      display: flex; align-items: center; justify-content: center;
    }
    .prev-img { max-width: 100%; max-height: 380px; object-fit: contain; display: block; }
    .prev-video { max-width: 100%; max-height: 380px; display: block; }
    .prev-audio-wrap { width: 100%; padding: 20px; background: var(--surface); }
    .prev-audio { width: 100%; }
    .prev-iframe { width: 100%; height: 340px; border: none; background: #fff; display: block; }
    .prev-pdf { width: 100%; height: 380px; border: none; display: block; }
    .prev-none {
      width: 100%; padding: 20px 16px;
      font-size: 12px; color: var(--muted); font-style: italic;
      background: var(--surface);
    }

    /* Value box */
    .vbox {
      background: rgba(0,0,0,0.35); border: 1px solid var(--border); border-radius: var(--r);
      padding: 12px 14px;
      font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.7;
      color: #cbd5e1; white-space: pre-wrap; word-break: break-all; overflow-x: auto;
    }

    /* Empty states */
    .global-empty {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 10px; text-align: center; padding: 40px;
    }
    .ge-icon { font-size: 42px; opacity: 0.18; }
    .ge-title { font-size: 19px; font-weight: 600; }
    .ge-sub { font-size: 14px; color: var(--muted); max-width: 340px; line-height: 1.6; }
    .ge-endpoint {
      margin-top: 6px; display: inline-block;
      font-family: 'JetBrains Mono', monospace; font-size: 13px;
      padding: 8px 15px; border-radius: var(--r-sm);
      background: var(--surface); border: 1px solid var(--border); color: var(--accent);
    }
    .col-empty { padding: 18px 10px; font-size: 13px; color: var(--muted); text-align: center; }

    @media (max-width: 900px) {
      .igrid { grid-template-columns: 1fr; }
      .items-col { border-right: none; border-bottom: 1px solid var(--border); max-height: 220px; }
    }
    @media (max-width: 700px) {
      .sidebar { width: 220px; min-width: 220px; }
    }
  </style>
</head>
<body>
  <div class="app" id="app"></div>
  <script>
    const appEl = document.getElementById('app');
    const state = { requests: [], selectedId: null, tab: 'headers', itemKey: null, live: false };
    let liveTimer = null;

    function render() {
      appEl.innerHTML = buildApp();
      bind();
    }

    function buildApp() {
      return buildSidebar() + buildMain();
    }

    function buildSidebar() {
      const n = state.requests.length;
      const liveClass = state.live ? ' on' : '';
      return '' +
        '<nav class="sidebar">' +
          '<div class="sidebar-top">' +
            '<div class="logo">' +
              '<div class="logo-icon">◈</div>' +
              '<span class="logo-text">Request Inspector</span>' +
            '</div>' +
            '<div class="sidebar-actions">' +
              '<span class="req-count">' + n + ' request' + (n !== 1 ? 's' : '') + '</span>' +
              '<button class="live-btn' + liveClass + '" data-action="toggle-live">' +
                '<span class="live-dot"></span>' + (state.live ? 'Live' : 'Auto') +
              '</button>' +
            '</div>' +
          '</div>' +
          '<div class="req-list">' + buildReqList() + '</div>' +
        '</nav>';
    }

    function buildReqList() {
      if (!state.requests.length) {
        return '<div class="col-empty">No requests yet.<br/>POST to /api/log to begin.</div>';
      }
      return state.requests.map(buildReqCard).join('');
    }

    function buildReqCard(req) {
      const active = req.id === state.selectedId ? ' active' : '';
      const m = req.method || 'GET';
      const known = ['POST','GET','PUT','DELETE','PATCH'];
      const mc = 'm-' + (known.includes(m) ? m : 'OTHER');
      const hc = Object.keys(req.headers || {}).length;
      const bc = Object.keys(req.body || {}).length;
      const uc = (req.urlFields || []).length;
      const fc = (req.files || []).length;
      return '' +
        '<button class="req-card' + active + '" data-req="' + esc(req.id) + '">' +
          '<div class="card-row1">' +
            '<span class="mbadge ' + mc + '">' + esc(m) + '</span>' +
            '<span class="card-time">' + esc(new Date(req.receivedAt).toLocaleTimeString()) + '</span>' +
          '</div>' +
          '<div class="card-path">' + esc(req.path || '/') + '</div>' +
          '<div class="card-meta">' + hc + ' hdr · ' + bc + ' body · ' + uc + ' url · ' + fc + ' file</div>' +
        '</button>';
    }

    function buildMain() {
      if (!state.requests.length) {
        return '' +
          '<main class="main">' +
            '<div class="global-empty">' +
              '<div class="ge-icon">◈</div>' +
              '<div class="ge-title">Waiting for requests</div>' +
              '<p class="ge-sub">Send a POST request to start inspecting headers, body fields, URL previews, and uploaded files.</p>' +
              '<span class="ge-endpoint">POST http://localhost:8000/api/log</span>' +
            '</div>' +
          '</main>';
      }
      const req = state.requests.find((r) => r.id === state.selectedId) || state.requests[0];
      if (state.selectedId !== req.id) state.selectedId = req.id;
      const items = getItems(req);
      const selItem = items.find((i) => i.key === state.itemKey) || (items.length ? items[0] : null);
      if (selItem && state.itemKey !== selItem.key) state.itemKey = selItem.key;
      const counts = {
        headers: Object.keys(req.headers || {}).length,
        body: Object.keys(req.body || {}).length,
        urls: (req.urlFields || []).length,
        files: (req.files || []).length,
      };
      return '' +
        '<main class="main">' +
          '<div class="req-bar">' +
            '<div class="req-bar-inner">' +
              '<span class="mbadge m-' + esc(req.method) + '">' + esc(req.method) + '</span>' +
              '<span class="req-bar-path">' + esc(req.path) + '</span>' +
              '<span class="req-bar-sub">' + esc(req.ip) + ' · ' + esc(new Date(req.receivedAt).toLocaleString()) + '</span>' +
            '</div>' +
            '<div class="tab-strip">' +
              mkTab('headers', 'Headers', counts.headers) +
              mkTab('body', 'Body', counts.body) +
              mkTab('urls', 'URLs', counts.urls) +
              mkTab('files', 'Files', counts.files) +
            '</div>' +
          '</div>' +
          '<div class="igrid">' +
            '<div class="items-col">' + buildItems(items, selItem) + '</div>' +
            '<div class="val-col">' + buildValue(selItem) + '</div>' +
          '</div>' +
        '</main>';
    }

    function mkTab(id, label, count) {
      return '' +
        '<button class="tab-btn' + (state.tab === id ? ' active' : '') + '" data-tab="' + id + '">' +
          esc(label) + '<span class="tab-n">' + count + '</span>' +
        '</button>';
    }

    function getItems(req) {
      if (state.tab === 'headers') return Object.entries(req.headers || {}).map(([k, v]) => ({ key: k, value: v }));
      if (state.tab === 'body')    return Object.entries(req.body || {}).map(([k, v]) => ({ key: k, value: v }));
      if (state.tab === 'urls')    return (req.urlFields || []).map((e) => ({ key: e.field, value: e, link: e.url }));
      return (req.files || []).map((f, i) => ({ key: f.originalname || f.fieldname || 'file-' + i, value: f }));
    }

    function buildItems(items, selItem) {
      if (!items.length) return '<div class="col-empty">Nothing in this section.</div>';
      return items.map((item) => {
        const active = selItem && item.key === selItem.key ? ' active' : '';
        return '' +
          '<button class="item-btn' + active + '" data-item="' + esc(item.key) + '">' +
            '<span class="item-k">' + esc(item.key) + '</span>' +
            '<span class="item-v">' + esc(shortVal(item.value)) + '</span>' +
          '</button>';
      }).join('');
    }

    function buildValue(selItem) {
      if (!selItem) {
        return '' +
          '<div class="val-empty">' +
            '<div class="val-empty-icon">◎</div>' +
            '<div>Select an item to inspect its value</div>' +
          '</div>';
      }
      const raw = typeof selItem.value === 'string' ? selItem.value : JSON.stringify(selItem.value, null, 2);
      let html = '';
      if (selItem.link) {
        html += '' +
          '<div>' +
            '<span class="sec-label">URL</span>' +
            '<div class="url-actions">' +
              '<a href="' + esc(selItem.link) + '" target="_blank" rel="noreferrer" class="url-open">Open in new tab ↗</a>' +
            '</div>' +
          '</div>';
        const prev = buildPreview(selItem);
        if (prev) html += '<div><span class="sec-label">Preview</span>' + prev + '</div>';
        html += '' +
          '<div>' +
            '<div class="val-header">' +
              '<span class="sec-label" style="margin:0">Metadata</span>' +
              '<button class="copy-btn" data-copy="' + esc(raw) + '">Copy</button>' +
            '</div>' +
            '<pre class="vbox">' + esc(raw) + '</pre>' +
          '</div>';
      } else {
        html += '' +
          '<div>' +
            '<div class="val-header">' +
              '<span class="sec-label" style="margin:0">' + esc(selItem.key) + '</span>' +
              '<button class="copy-btn" data-copy="' + esc(raw) + '">Copy</button>' +
            '</div>' +
            '<pre class="vbox">' + esc(raw) + '</pre>' +
          '</div>';
      }
      return html;
    }

    function buildPreview(item) {
      const url = item.link;
      const ct = (item.value && item.value.contentType) || '';
      const lower = url.toLowerCase().split('?')[0];
      const safeUrl = esc(url);
      const isImg  = ct.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|ico)$/.test(lower);
      const isVid  = ct.startsWith('video/') || /\.(mp4|webm|ogg|mov)$/.test(lower);
      const isAud  = ct.startsWith('audio/') || /\.(mp3|wav|ogg|flac|aac)$/.test(lower);
      const isHtml = ct.startsWith('text/html') || lower.endsWith('.html') || lower.endsWith('.htm');
      const isPdf  = ct === 'application/pdf' || lower.endsWith('.pdf');
      if (isImg)  return '<div class="preview-frame"><img src="' + safeUrl + '" alt="Preview" class="prev-img" /></div>';
      if (isVid)  return '<div class="preview-frame"><video src="' + safeUrl + '" controls class="prev-video"></video></div>';
      if (isAud)  return '<div class="preview-frame prev-audio-wrap"><audio src="' + safeUrl + '" controls class="prev-audio"></audio></div>';
      if (isPdf)  return '<div class="preview-frame"><iframe src="' + safeUrl + '" class="prev-pdf" title="PDF Preview"></iframe></div>';
      if (isHtml) return '<div class="preview-frame"><iframe src="' + safeUrl + '" sandbox="allow-scripts allow-same-origin" class="prev-iframe" title="Page Preview"></iframe></div>';
      return '<div class="preview-frame"><div class="prev-none">No visual preview available for this content type.</div></div>';
    }

    function shortVal(v) {
      if (v == null) return 'null';
      const s = typeof v === 'string' ? v : JSON.stringify(v);
      return s.length > 88 ? s.slice(0, 85) + '...' : s;
    }

    function esc(s) {
      return String(s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function bind() {
      document.querySelectorAll('[data-req]').forEach((el) => {
        el.addEventListener('click', () => { state.selectedId = el.getAttribute('data-req'); state.itemKey = null; render(); });
      });
      document.querySelectorAll('[data-tab]').forEach((el) => {
        el.addEventListener('click', () => { state.tab = el.getAttribute('data-tab'); state.itemKey = null; render(); });
      });
      document.querySelectorAll('[data-item]').forEach((el) => {
        el.addEventListener('click', () => { state.itemKey = el.getAttribute('data-item'); render(); });
      });
      document.querySelectorAll('[data-action="toggle-live"]').forEach((el) => {
        el.addEventListener('click', () => {
          state.live = !state.live;
          if (state.live) { liveTimer = setInterval(poll, 2000); }
          else { clearInterval(liveTimer); liveTimer = null; }
          render();
        });
      });
      document.querySelectorAll('[data-copy]').forEach((el) => {
        el.addEventListener('click', () => {
          navigator.clipboard.writeText(el.getAttribute('data-copy')).then(() => {
            const orig = el.textContent;
            el.textContent = 'Copied!';
            setTimeout(() => { el.textContent = orig; }, 1500);
          }).catch(() => {});
        });
      });
    }

    async function poll() {
      try {
        const res = await fetch('/api/requests');
        const data = await res.json();
        const prevIds = state.requests.map((r) => r.id);
        state.requests = data.requests || [];
        if (state.requests[0] && !prevIds.includes(state.requests[0].id)) {
          state.selectedId = state.requests[0].id;
          state.itemKey = null;
        }
        if (!state.selectedId && state.requests[0]) state.selectedId = state.requests[0].id;
        render();
      } catch (_) {}
    }

    poll();
  </script>
</body>
</html>`;
}

module.exports = {
  buildUiPage,
};
