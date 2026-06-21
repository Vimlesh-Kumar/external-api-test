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
    .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
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
                },
                "keyframes": {
                    "fadeIn": {
                        "0%": { opacity: "0", transform: "translateY(5px)" },
                        "100%": { opacity: "1", transform: "translateY(0)" }
                    }
                },
                "animation": {
                    "fadeIn": "fadeIn 0.3s ease-out"
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
      if (!appEl.innerHTML) {
        appEl.innerHTML = buildApp();
        bind();
      } else {
        updateSidebar();
        updateMain();
      }
    }

    function updateSidebar() {
      const sidebarReqList = document.getElementById('sidebar-req-list');
      const reqCount = document.getElementById('req-count');
      if (sidebarReqList) sidebarReqList.innerHTML = buildReqList();
      if (reqCount) {
        const n = state.requests.length;
        reqCount.textContent = \`\${n} REQUEST\${n !== 1 ? 'S' : ''}\`;
      }
      
      const liveBtn = document.getElementById('live-btn');
      if (liveBtn) {
        liveBtn.className = \`live-btn \${state.live ? 'live-on text-secondary' : 'text-on-surface-variant'} flex items-center text-[10px] uppercase tracking-wider font-bold px-2.5 py-1.5 rounded-lg bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.05)] transition-all\`;
        liveBtn.innerHTML = \`<span class="live-dot"></span> \${state.live ? 'LIVE' : 'PAUSED'}\`;
      }
      bindSidebar();
    }

    function updateMain() {
      const mainEl = document.getElementById('main-content');
      if (mainEl) {
        const newMainHTML = buildMain();
        if (mainEl.innerHTML !== newMainHTML) {
            mainEl.outerHTML = newMainHTML;
            bindMain();
        }
      } else {
        appEl.innerHTML = buildApp();
        bind();
      }
    }

    function buildApp() {
      return buildSidebar() + buildMain();
    }

    function buildSidebar() {
      const n = state.requests.length;
      return \`
        <aside class="w-[320px] min-w-[320px] flex flex-col h-screen py-6 bg-[rgba(15,20,24,0.8)] backdrop-blur-xl border-r border-[rgba(255,255,255,0.05)] shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-10 transition-all duration-300">
          <div class="px-6 mb-8 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/20">
                    <span class="material-symbols-outlined text-on-primary-container" style="font-variation-settings: 'FILL' 1;">api</span>
                </div>
                <div>
                    <h2 class="text-base font-bold text-white tracking-wide leading-tight">Inspector</h2>
                    <p id="req-count" class="text-[10px] uppercase tracking-widest text-primary/80 font-medium mt-0.5">\${n} REQUEST\${n !== 1 ? 'S' : ''}</p>
                </div>
            </div>
            <button id="live-btn" class="live-btn \${state.live ? 'live-on text-secondary' : 'text-on-surface-variant'} flex items-center text-[10px] uppercase tracking-wider font-bold px-2.5 py-1.5 rounded-lg bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.05)] transition-all" data-action="toggle-live">
                <span class="live-dot"></span> \${state.live ? 'LIVE' : 'PAUSED'}
            </button>
          </div>
          
          <nav id="sidebar-req-list" class="flex-1 overflow-y-auto px-4 space-y-2 pb-6 custom-scrollbar">
            \${buildReqList()}
          </nav>
        </aside>
      \`;
    }

    function buildReqList() {
      if (!state.requests.length) {
        return '<div class="text-xs text-on-surface-variant/70 p-6 text-center border border-dashed border-[rgba(255,255,255,0.1)] rounded-xl mt-4 bg-[rgba(255,255,255,0.02)]">Waiting for requests...<br><br>POST to <span class="text-primary font-code-sm">/api/log</span></div>';
      }
      return state.requests.map(req => {
        const active = req.id === state.selectedId ? 'bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.15)] shadow-inner text-white' : 'border-transparent text-on-surface hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.05)]';
        const m = req.method || 'GET';
        const known = ['POST','GET','PUT','DELETE','PATCH'];
        const mClass = known.includes(m) ? 'm-' + m : 'text-on-surface';
        const bgClass = known.includes(m) ? 'bg-m-' + m : 'bg-[rgba(255,255,255,0.1)]';
        
        const hc = Object.keys(req.headers || {}).length;
        const bc = Object.keys(req.body || {}).length;
        const uc = (req.urlFields || []).length;
        const fc = (req.files || []).length;
        
        return \`
          <button class="w-full text-left p-4 rounded-xl border \${active} transition-all duration-200 group" data-req="\${esc(req.id)}">
            <div class="flex items-center justify-between mb-2">
              <span class="font-code-sm text-[11px] font-bold px-2 py-0.5 rounded-md \${bgClass} \${mClass}">\${esc(m)}</span>
              <span class="text-[10px] text-on-surface-variant font-code-sm group-hover:text-white transition-colors">\${esc(new Date(req.receivedAt).toLocaleTimeString())}</span>
            </div>
            <div class="font-code-sm text-[13px] truncate mb-3 text-white/90 group-hover:text-white transition-colors">\${esc(req.path || '/')}</div>
            <div class="flex gap-3 text-[10px] uppercase tracking-wider font-medium text-on-surface-variant/70">
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">data_object</span>\${hc}</span>
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">description</span>\${bc}</span>
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">link</span>\${uc}</span>
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">attach_file</span>\${fc}</span>
            </div>
          </button>
        \`;
      }).join('');
    }

    function buildMain() {
      if (!state.requests.length) {
        return \`
          <main id="main-content" class="flex-1 flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-surface-dim relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-[2px]"></div>
            <div class="relative z-10 flex flex-col items-center glass-panel p-12 rounded-3xl shadow-2xl max-w-lg border border-white/10">
                <div class="w-24 h-24 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(142,213,255,0.2)]">
                    <span class="material-symbols-outlined text-5xl text-primary animate-pulse" style="font-size: 48px">sensors</span>
                </div>
                <h2 class="text-2xl font-bold text-white mb-3 tracking-tight">Listening for requests</h2>
                <p class="text-on-surface-variant text-center leading-relaxed">Send a POST request to <strong class="text-primary font-code-sm">/api/log</strong> to see the headers, body, URLs, and uploaded files appear here instantly.</p>
            </div>
          </main>
        \`;
      }
      const req = state.requests.find((r) => r.id === state.selectedId) || state.requests[0];
      if (state.selectedId !== req.id) state.selectedId = req.id;
      
      const items = getItems(req);
      let selItem = items.find((i) => i.key === state.itemKey);
      if (!selItem) {
          selItem = items.length ? items[0] : null;
          if (selItem) state.itemKey = selItem.key;
      }
      
      const counts = {
        headers: Object.keys(req.headers || {}).length,
        body: Object.keys(req.body || {}).length,
        urls: (req.urlFields || []).length,
        files: (req.files || []).length,
      };

      const mClass = ['POST','GET','PUT','DELETE','PATCH'].includes(req.method) ? 'bg-m-' + req.method + ' m-' + req.method : 'bg-surface-container m-OTHER';

      return \`
        <main id="main-content" class="flex-1 flex flex-col min-w-0 bg-[#0B0F12] relative">
          <div class="px-8 py-6 flex flex-col gap-2 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] backdrop-blur-md relative z-10">
            <div class="flex items-center gap-4">
              <span class="px-3 py-1 rounded-md border text-xs font-bold font-code-sm shadow-sm \${mClass}">\${esc(req.method)}</span>
              <span class="font-code-sm text-lg text-white truncate font-medium">\${esc(req.path)}</span>
              <div class="ml-auto flex items-center gap-6 text-sm text-on-surface-variant font-code-sm">
                <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]"><span class="material-symbols-outlined text-[16px]">router</span>\${esc(req.ip)}</span>
                <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]"><span class="material-symbols-outlined text-[16px]">schedule</span>\${esc(new Date(req.receivedAt).toLocaleString())}</span>
              </div>
            </div>
          </div>
          
          <div class="flex border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] px-6 relative z-10">
            \${mkTab('headers', 'Headers', counts.headers)}
            \${mkTab('body', 'Body', counts.body)}
            \${mkTab('urls', 'URLs', counts.urls)}
            \${mkTab('files', 'Files', counts.files)}
          </div>
          
          <div class="flex-1 flex overflow-hidden relative">
            <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-30 pointer-events-none"></div>
            <div class="w-[30%] min-w-[250px] max-w-[400px] border-r border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] overflow-y-auto p-4 custom-scrollbar relative z-10">
                \${buildItems(items, selItem)}
            </div>
            <div class="flex-1 bg-transparent overflow-y-auto p-8 custom-scrollbar relative z-10">
                \${buildValue(selItem)}
            </div>
          </div>
        </main>
      \`;
    }

    function mkTab(id, label, count) {
      const active = state.tab === id ? 'text-primary border-primary bg-[rgba(142,213,255,0.05)]' : 'text-on-surface-variant border-transparent hover:text-white hover:bg-[rgba(255,255,255,0.02)]';
      return \`
        <button class="flex items-center gap-2 px-6 py-4 border-b-2 text-[13px] font-bold uppercase tracking-wider transition-all \${active}" data-tab="\${id}">
          \${esc(label)} <span class="bg-[rgba(255,255,255,0.1)] text-white px-2 py-0.5 rounded-full text-[10px]">\${count}</span>
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
      if (!items.length) return '<div class="text-[13px] text-on-surface-variant/50 p-8 text-center flex flex-col items-center gap-2"><span class="material-symbols-outlined text-3xl">inbox</span>Empty</div>';
      return items.map((item) => {
        const active = selItem && item.key === selItem.key ? 'bg-primary/10 border-primary/30 shadow-[inset_4px_0_0_rgba(142,213,255,1)] text-white' : 'border-transparent text-on-surface hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.05)]';
        return \`
          <button class="w-full text-left p-3.5 rounded-xl border \${active} transition-all duration-200 mb-2 group" data-item="\${esc(item.key)}">
            <div class="font-code-sm text-[13px] \${selItem && item.key === selItem.key ? 'text-primary font-bold' : 'text-white/80 group-hover:text-white'} truncate mb-1.5">\${esc(item.key)}</div>
            <div class="font-code-sm text-[11px] text-on-surface-variant/70 truncate group-hover:text-on-surface-variant transition-colors">\${esc(shortVal(item.value))}</div>
          </button>
        \`;
      }).join('');
    }

    function buildValue(selItem) {
      if (!selItem) {
        return \`
          <div class="flex flex-col items-center justify-center h-full text-on-surface-variant/40">
            <div class="w-24 h-24 rounded-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center mb-6">
                <span class="material-symbols-outlined text-5xl">data_object</span>
            </div>
            <span class="text-base font-medium tracking-wide">Select an item to view details</span>
          </div>
        \`;
      }
      const raw = typeof selItem.value === 'string' ? selItem.value : JSON.stringify(selItem.value, null, 2);
      let html = '';
      
      if (selItem.link) {
        html += \`
          <div class="mb-8">
            <div class="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-widest mb-3">
                <span class="material-symbols-outlined text-[16px]">link</span> URL Target
            </div>
            <div class="flex items-center gap-3 bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-xl p-2.5 shadow-inner">
                <input type="text" readonly value="\${esc(selItem.link)}" class="flex-1 bg-transparent border-none text-sm font-code-sm text-white focus:ring-0 px-2 outline-none">
                <a href="\${esc(selItem.link)}" target="_blank" rel="noreferrer" class="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-primary-container to-primary text-on-primary-container rounded-lg text-[13px] font-bold hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all hover:scale-[1.02]">
                    Open <span class="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
            </div>
          </div>
        \`;
        
        const prev = buildPreview(selItem);
        if (prev) {
            html += \`<div class="mb-8 animate-[fadeIn_0.3s_ease-out]"><div class="flex items-center gap-2 text-[11px] font-bold text-secondary uppercase tracking-widest mb-3"><span class="material-symbols-outlined text-[16px]">visibility</span> Preview</div>\${prev}</div>\`;
        }
      }

      html += \`
        <div class="animate-[fadeIn_0.3s_ease-out]">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2 text-[11px] font-bold text-tertiary uppercase tracking-widest">
                <span class="material-symbols-outlined text-[16px]">\${selItem.link ? 'info' : 'data_object'}</span> \${selItem.link ? 'Metadata' : esc(selItem.key)}
            </div>
            <button class="flex items-center gap-1.5 text-[11px] uppercase font-bold tracking-wider px-3 py-1.5 border border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] text-white transition-all active:scale-95" data-copy="\${esc(raw)}">
                <span class="material-symbols-outlined text-[16px]">content_copy</span> Copy
            </button>
          </div>
          <pre class="bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-xl p-5 vbox max-h-[500px] overflow-auto shadow-inner text-[13px] font-code-sm text-white/90 custom-scrollbar">\${esc(raw)}</pre>
        </div>
      \`;
      return html;
    }

    function buildPreview(item) {
      const url = item.link;
      const ct = (item.value && item.value.contentType) || '';
      const lower = url.toLowerCase().split('?')[0];
      const isImg  = ct.startsWith('image/') || /\\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|ico)$/.test(lower);
      const isVid  = ct.startsWith('video/') || /\\.(mp4|webm|ogg|mov)$/.test(lower);
      const isAud  = ct.startsWith('audio/') || /\\.(mp3|wav|ogg|flac|aac)$/.test(lower);
      const isHtml = ct.startsWith('text/html') || lower.endsWith('.html') || lower.endsWith('.htm');
      const isPdf  = ct === 'application/pdf' || lower.endsWith('.pdf');
      
      const frameClasses = "w-full border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.5)] rounded-xl overflow-hidden flex items-center justify-center min-h-[200px] shadow-lg backdrop-blur-sm relative";
      
      const rawUrlAttr = url.replace(/"/g, '&quot;');
      if (isImg)  return \`<div class="\${frameClasses} p-4"><div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div><img src="\${rawUrlAttr}" referrerpolicy="no-referrer" alt="Preview" class="max-w-full max-h-[400px] object-contain rounded-lg shadow-2xl relative z-10" onerror="this.outerHTML='<div class=&quot;text-[13px] text-red-400 p-8 text-center flex flex-col items-center gap-2&quot;><span class=&quot;material-symbols-outlined text-3xl&quot;>broken_image</span>Failed to load image.<br>The link might be expired or restricted.</div>'" /></div>\`;
      if (isVid)  return \`<div class="\${frameClasses}"><video src="\${rawUrlAttr}" referrerpolicy="no-referrer" controls class="max-w-full max-h-[400px] outline-none w-full bg-black"></video></div>\`;
      if (isAud)  return \`<div class="\${frameClasses} p-8 bg-[rgba(255,255,255,0.02)]"><audio src="\${rawUrlAttr}" referrerpolicy="no-referrer" controls class="w-full shadow-lg rounded-full"></audio></div>\`;
      if (isPdf)  return \`<div class="\${frameClasses} h-[600px]"><iframe src="https://docs.google.com/viewer?url=\${encodeURIComponent(url)}&embedded=true" referrerpolicy="no-referrer" class="w-full h-full border-none bg-white" title="PDF Preview"></iframe></div>\`;
      if (isHtml) return \`<div class="\${frameClasses} h-[500px]"><iframe src="\${rawUrlAttr}" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin" class="w-full h-full border-none bg-white" title="Page Preview" onerror="this.outerHTML='<div class=&quot;text-xs text-on-surface-variant p-4&quot;>Preview blocked by site policies (X-Frame-Options)</div>'"></iframe></div>\`;
      
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
      bindSidebar();
      bindMain();
    }
    
    function bindSidebar() {
      document.querySelectorAll('#sidebar-req-list [data-req]').forEach((el) => {
        el.addEventListener('click', () => { 
            state.selectedId = el.getAttribute('data-req'); 
            state.itemKey = null; 
            render(); 
        });
      });
      document.querySelectorAll('#live-btn').forEach((el) => {
        const newEl = el.cloneNode(true);
        el.parentNode.replaceChild(newEl, el);
        newEl.addEventListener('click', () => {
          state.live = !state.live;
          if (state.live) { poll(); liveTimer = setInterval(poll, 2000); }
          else { clearInterval(liveTimer); liveTimer = null; }
          render();
        });
      });
    }

    function bindMain() {
      document.querySelectorAll('#main-content [data-tab]').forEach((el) => {
        el.addEventListener('click', () => { state.tab = el.getAttribute('data-tab'); state.itemKey = null; render(); });
      });
      document.querySelectorAll('#main-content [data-item]').forEach((el) => {
        el.addEventListener('click', () => { state.itemKey = el.getAttribute('data-item'); render(); });
      });
      document.querySelectorAll('#main-content [data-copy]').forEach((el) => {
        el.addEventListener('click', () => {
          navigator.clipboard.writeText(el.getAttribute('data-copy')).then(() => {
            const orig = el.innerHTML;
            el.innerHTML = '<span class="material-symbols-outlined text-[16px]">check</span> Copied!';
            el.classList.add('text-secondary', 'border-secondary', 'bg-[rgba(78,222,163,0.1)]');
            setTimeout(() => { 
                el.innerHTML = orig; 
                el.classList.remove('text-secondary', 'border-secondary', 'bg-[rgba(78,222,163,0.1)]');
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
        const newRequestsStr = JSON.stringify(data.requests || []);
        if (state._lastRequestsStr === newRequestsStr) return;
        state._lastRequestsStr = newRequestsStr;
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
