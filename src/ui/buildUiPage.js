function buildUiPage() {
  return `<!DOCTYPE html>
<html class="dark" lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>API Inspector | Workspace</title>
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
  <style>
    .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        vertical-align: middle;
    }
    .glass-panel {
        background: rgba(30, 41, 59, 0.7);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(51, 65, 85, 0.5);
    }
    .syntax-key { color: #8ed5ff; }
    .syntax-string { color: #4edea3; }
    .syntax-number { color: #ffc176; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #3e484f; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #87929a; }
    
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; display: inline-block; margin-right: 6px; }
    .live-on .live-dot { animation: blink 1s ease-in-out infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    
    .m-POST   { color: var(--color-secondary); }
    .m-GET    { color: var(--color-primary); }
    .m-PUT    { color: var(--color-tertiary); }
    .m-DELETE { color: #f87171; }
    .m-PATCH  { color: #a78bfa; }
    
    .bg-m-POST   { background: rgba(78, 222, 163, 0.1); border-color: rgba(78, 222, 163, 0.3); }
    .bg-m-GET    { background: rgba(142, 213, 255, 0.1); border-color: rgba(142, 213, 255, 0.3); }
    .bg-m-PUT    { background: rgba(255, 193, 118, 0.1); border-color: rgba(255, 193, 118, 0.3); }
    .bg-m-DELETE { background: rgba(248, 113, 113, 0.1); border-color: rgba(248, 113, 113, 0.3); }
    .bg-m-PATCH  { background: rgba(167, 139, 250, 0.1); border-color: rgba(167, 139, 250, 0.3); }
    
    .vbox {
      font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.6;
      color: #dee3e8; white-space: pre-wrap; word-break: break-all;
    }
  </style>
  <script id="tailwind-config">
    tailwind.config = {
        darkMode: "class",
        theme: {
            extend: {
                "colors": {
                    "secondary": "#4edea3",
                    "surface-bright": "#343a3e",
                    "surface-container-high": "#252b2e",
                    "surface-dim": "#0f1418",
                    "on-secondary": "#003824",
                    "primary-container": "#38bdf8",
                    "outline-variant": "#3e484f",
                    "surface-container-highest": "#303539",
                    "background": "#0f1418",
                    "surface-container": "#1b2024",
                    "on-primary-container": "#004965",
                    "tertiary": "#ffc176",
                    "on-surface": "#dee3e8",
                    "on-background": "#dee3e8",
                    "on-surface-variant": "#bdc8d1",
                    "primary": "#8ed5ff",
                    "inverse-surface": "#dee3e8",
                    "surface-container-low": "#171c20"
                },
                "fontFamily": {
                    "code-sm": ["JetBrains Mono"],
                    "label-caps": ["Inter"],
                    "body-md": ["Inter"],
                    "headline-md": ["Inter"]
                }
            }
        }
    }
  </script>
</head>
<body class="bg-background text-on-background font-body-md overflow-hidden h-screen flex">
  <div class="flex h-screen w-full" id="app"></div>

  <script>
    const appEl = document.getElementById('app');
    const state = { requests: [], selectedId: null, tab: 'headers', itemKey: null, live: true };
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
      return \`
        <aside class="w-[280px] min-w-[280px] flex flex-col h-screen py-4 bg-surface-container border-r border-outline-variant transition-all duration-200">
          <div class="px-4 mb-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center">
                    <span class="material-symbols-outlined text-on-primary-container" style="font-variation-settings: 'FILL' 1;">api</span>
                </div>
                <div>
                    <h2 class="text-[14px] font-bold text-on-surface leading-tight">API Inspector</h2>
                    <p class="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">\${n} REQUEST\${n !== 1 ? 'S' : ''}</p>
                </div>
            </div>
            <button class="live-btn \${state.live ? 'live-on text-secondary' : 'text-on-surface-variant'} flex items-center text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded hover:bg-surface-container-highest transition-colors" data-action="toggle-live">
                <span class="live-dot"></span> \${state.live ? 'LIVE' : 'PAUSED'}
            </button>
          </div>
          
          <nav class="flex-1 overflow-y-auto px-2 space-y-1">
            \${buildReqList()}
          </nav>
        </aside>
      \`;
    }

    function buildReqList() {
      if (!state.requests.length) {
        return '<div class="text-xs text-on-surface-variant p-4 text-center border border-dashed border-outline-variant rounded mt-4">Waiting for requests...<br><br>POST to <span class="text-primary">/api/log</span></div>';
      }
      return state.requests.map(req => {
        const active = req.id === state.selectedId ? 'bg-surface-bright border-outline-variant text-on-surface' : 'border-transparent text-on-surface-variant hover:bg-surface-container-highest';
        const m = req.method || 'GET';
        const known = ['POST','GET','PUT','DELETE','PATCH'];
        const mClass = known.includes(m) ? 'm-' + m : 'text-on-surface';
        
        const hc = Object.keys(req.headers || {}).length;
        const bc = Object.keys(req.body || {}).length;
        const uc = (req.urlFields || []).length;
        const fc = (req.files || []).length;
        
        return \`
          <button class="w-full text-left p-3 rounded border \${active} transition-colors mb-1" data-req="\${esc(req.id)}">
            <div class="flex items-center justify-between mb-1">
              <span class="font-code-sm text-[11px] font-bold \${mClass}">\${esc(m)}</span>
              <span class="text-[10px] opacity-60 font-code-sm">\${esc(new Date(req.receivedAt).toLocaleTimeString())}</span>
            </div>
            <div class="font-code-sm text-[12px] truncate mb-2 text-on-surface">\${esc(req.path || '/')}</div>
            <div class="flex gap-2 text-[9px] uppercase tracking-wider opacity-60">
                <span>H:\${hc}</span><span>B:\${bc}</span><span>U:\${uc}</span><span>F:\${fc}</span>
            </div>
          </button>
        \`;
      }).join('');
    }

    function buildMain() {
      if (!state.requests.length) {
        return \`
          <main class="flex-1 flex flex-col items-center justify-center bg-surface-dim p-8 text-center">
            <span class="material-symbols-outlined text-6xl text-outline-variant mb-4" style="font-size: 64px">sensors</span>
            <h2 class="text-xl font-bold text-on-surface mb-2">Listening for incoming requests</h2>
            <p class="text-on-surface-variant text-sm max-w-md">Send a POST request to <strong>/api/log</strong> to see the headers, body, URLs, and uploaded files appear here instantly.</p>
          </main>
        \`;
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

      const mClass = ['POST','GET','PUT','DELETE','PATCH'].includes(req.method) ? 'bg-m-' + req.method + ' m-' + req.method : 'bg-surface-container m-OTHER';

      return \`
        <main class="flex-1 flex flex-col min-w-0 bg-surface-dim">
          <!-- Request Header Info -->
          <div class="px-6 py-4 flex flex-col gap-2 border-b border-outline-variant bg-surface-container-low">
            <div class="flex items-center gap-3">
              <span class="px-2 py-0.5 rounded border text-[11px] font-bold font-code-sm \${mClass}">\${esc(req.method)}</span>
              <span class="font-code-sm text-sm text-on-surface truncate">\${esc(req.path)}</span>
              <div class="ml-auto flex gap-4 text-xs text-on-surface-variant font-code-sm">
                <span>\${esc(req.ip)}</span>
                <span>\${esc(new Date(req.receivedAt).toLocaleString())}</span>
              </div>
            </div>
          </div>
          
          <!-- Tabs -->
          <div class="flex border-b border-outline-variant bg-surface-container-low px-4">
            \${mkTab('headers', 'Headers', counts.headers)}
            \${mkTab('body', 'Body', counts.body)}
            \${mkTab('urls', 'URLs', counts.urls)}
            \${mkTab('files', 'Files', counts.files)}
          </div>
          
          <!-- Inspector Grid -->
          <div class="flex-1 flex overflow-hidden">
            <!-- Left Pane (Keys) -->
            <div class="w-1/3 min-w-[200px] border-r border-outline-variant bg-surface-dim overflow-y-auto p-2">
                \${buildItems(items, selItem)}
            </div>
            <!-- Right Pane (Value) -->
            <div class="w-2/3 bg-surface-container-low overflow-y-auto p-6">
                \${buildValue(selItem)}
            </div>
          </div>
        </main>
      \`;
    }

    function mkTab(id, label, count) {
      const active = state.tab === id ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-on-surface';
      return \`
        <button class="flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-colors \${active}" data-tab="\${id}">
          \${esc(label)} <span class="bg-surface-container-highest px-1.5 py-0.5 rounded text-[10px]">\${count}</span>
        </button>
      \`;
    }

    function getItems(req) {
      if (state.tab === 'headers') return Object.entries(req.headers || {}).map(([k, v]) => ({ key: k, value: v }));
      if (state.tab === 'body')    return Object.entries(req.body || {}).map(([k, v]) => ({ key: k, value: v }));
      if (state.tab === 'urls')    return (req.urlFields || []).map((e) => ({ key: e.field, value: e, link: e.url }));
      return (req.files || []).map((f, i) => ({ key: f.originalname || f.fieldname || 'file-' + i, value: f }));
    }

    function buildItems(items, selItem) {
      if (!items.length) return '<div class="text-xs text-on-surface-variant p-4 text-center">Empty section</div>';
      return items.map((item) => {
        const active = selItem && item.key === selItem.key ? 'bg-surface-container-high border-outline-variant' : 'border-transparent hover:bg-surface-container';
        return \`
          <button class="w-full text-left p-2.5 rounded border \${active} transition-colors mb-1" data-item="\${esc(item.key)}">
            <div class="font-code-sm text-[12px] text-primary truncate mb-1">\${esc(item.key)}</div>
            <div class="font-code-sm text-[11px] text-on-surface-variant truncate">\${esc(shortVal(item.value))}</div>
          </button>
        \`;
      }).join('');
    }

    function buildValue(selItem) {
      if (!selItem) {
        return \`
          <div class="flex flex-col items-center justify-center h-full text-on-surface-variant opacity-60">
            <span class="material-symbols-outlined text-4xl mb-2">data_object</span>
            <span class="text-sm">Select an item to view details</span>
          </div>
        \`;
      }
      const raw = typeof selItem.value === 'string' ? selItem.value : JSON.stringify(selItem.value, null, 2);
      let html = '';
      
      if (selItem.link) {
        html += \`
          <div class="mb-6">
            <div class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">URL Target</div>
            <div class="flex items-center gap-3 bg-surface-dim border border-outline-variant rounded p-2">
                <input type="text" readonly value="\${esc(selItem.link)}" class="flex-1 bg-transparent border-none text-sm font-code-sm text-primary focus:ring-0">
                <a href="\${esc(selItem.link)}" target="_blank" rel="noreferrer" class="flex items-center gap-1 px-3 py-1.5 bg-primary-container text-on-primary-container rounded text-xs font-bold hover:brightness-110 transition-all">
                    Open <span class="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
            </div>
          </div>
        \`;
        
        const prev = buildPreview(selItem);
        if (prev) {
            html += \`<div class="mb-6"><div class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Preview</div>\${prev}</div>\`;
        }
      }

      html += \`
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">\${selItem.link ? 'Metadata' : esc(selItem.key)}</div>
            <button class="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-1 border border-outline-variant rounded hover:bg-surface-bright transition-colors" data-copy="\${esc(raw)}">
                <span class="material-symbols-outlined text-[14px]">content_copy</span> Copy
            </button>
          </div>
          <pre class="bg-surface-dim border border-outline-variant rounded p-4 vbox max-h-[400px] overflow-auto">\${esc(raw)}</pre>
        </div>
      \`;
      return html;
    }

    function buildPreview(item) {
      const url = item.link;
      const ct = (item.value && item.value.contentType) || '';
      const lower = url.toLowerCase().split('?')[0];
      const safeUrl = esc(url);
      const isImg  = ct.startsWith('image/') || /\\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|ico)$/.test(lower);
      const isVid  = ct.startsWith('video/') || /\\.(mp4|webm|ogg|mov)$/.test(lower);
      const isAud  = ct.startsWith('audio/') || /\\.(mp3|wav|ogg|flac|aac)$/.test(lower);
      const isHtml = ct.startsWith('text/html') || lower.endsWith('.html') || lower.endsWith('.htm');
      const isPdf  = ct === 'application/pdf' || lower.endsWith('.pdf');
      
      const frameClasses = "w-full border border-outline-variant bg-black rounded-lg overflow-hidden flex items-center justify-center min-h-[100px]";
      
      const rawUrlAttr = url.replace(/"/g, '&quot;');
      if (isImg)  return \`<div class="\${frameClasses} p-2"><img src="\${rawUrlAttr}" referrerpolicy="no-referrer" alt="Preview" class="max-w-full max-h-[300px] object-contain rounded" onerror="this.outerHTML='<div class=&quot;text-xs text-red-400 p-4 text-center&quot;>Failed to load image.<br>The link might be expired or restricted.</div>'" /></div>\`;
      if (isVid)  return \`<div class="\${frameClasses}"><video src="\${rawUrlAttr}" referrerpolicy="no-referrer" controls class="max-w-full max-h-[300px]"></video></div>\`;
      if (isAud)  return \`<div class="\${frameClasses} bg-surface-dim p-4"><audio src="\${rawUrlAttr}" referrerpolicy="no-referrer" controls class="w-full"></audio></div>\`;
      if (isPdf)  return \`<div class="\${frameClasses}"><iframe src="\${rawUrlAttr}" referrerpolicy="no-referrer" class="w-full h-[300px] border-none" title="PDF Preview"></iframe></div>\`;
      
      // If it's a generic link like Reddit, loading it in iframe usually fails due to X-Frame-Options or CSP.
      if (isHtml) return \`<div class="\${frameClasses}"><iframe src="\${rawUrlAttr}" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin" class="w-full h-[300px] border-none bg-white" title="Page Preview" onerror="this.outerHTML='<div class=&quot;text-xs text-on-surface-variant p-4&quot;>Preview blocked by site policies (X-Frame-Options)</div>'"></iframe></div>\`;
      
      return '';
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
          if (state.live) { poll(); liveTimer = setInterval(poll, 2000); }
          else { clearInterval(liveTimer); liveTimer = null; }
          render();
        });
      });
      document.querySelectorAll('[data-copy]').forEach((el) => {
        el.addEventListener('click', () => {
          navigator.clipboard.writeText(el.getAttribute('data-copy')).then(() => {
            const orig = el.innerHTML;
            el.innerHTML = '<span class="material-symbols-outlined text-[14px]">check</span> Copied!';
            el.classList.add('text-secondary', 'border-secondary');
            setTimeout(() => { 
                el.innerHTML = orig; 
                el.classList.remove('text-secondary', 'border-secondary');
            }, 1500);
          }).catch(() => {});
        });
      });
    }

    async function poll() {
      if (!state.live) return;
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

    if(state.live) {
        liveTimer = setInterval(poll, 2000);
    }
    poll();
  </script>
</body>
</html>`;
}

module.exports = {
  buildUiPage,
};
