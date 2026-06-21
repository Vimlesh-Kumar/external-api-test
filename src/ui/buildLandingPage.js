const buildLandingPage = () => {
    return `<!DOCTYPE html>
<html class="dark" lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>API Workspace | Endpoints</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
    .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        vertical-align: middle;
    }
    .glass-panel {
        background: rgba(15, 20, 24, 0.6);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }
    .syntax-key { color: #8ed5ff; }
    .syntax-string { color: #4edea3; }
    .syntax-number { color: #ffc176; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
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
                "borderRadius": {
                    "DEFAULT": "0.125rem",
                    "lg": "0.25rem",
                    "xl": "0.5rem",
                    "full": "0.75rem"
                },
                "spacing": {
                    "container-padding": "32px",
                    "stack-md": "24px",
                    "sidebar-width": "300px",
                    "stack-sm": "8px",
                    "unit": "4px",
                    "gutter": "12px"
                },
                "fontFamily": {
                    "code-sm": ["JetBrains Mono"],
                    "label-caps": ["Inter"],
                    "body-md": ["Inter"],
                    "headline-md": ["Inter"]
                },
                "fontSize": {
                    "code-sm": ["13px", {"lineHeight": "18px", "fontWeight": "400"}],
                    "label-caps": ["11px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "700"}],
                    "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "600"}]
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
<body class="bg-[#0B0F12] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] text-on-background font-body-md text-body-md overflow-hidden h-screen flex relative">
<!-- Decorative Background Elements -->
<div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none z-0"></div>

<!-- SideNavBar -->
<aside class="w-sidebar-width flex flex-col h-screen py-stack-md bg-[rgba(15,20,24,0.8)] backdrop-blur-xl border-r border-[rgba(255,255,255,0.05)] transition-all duration-300 ease-in-out relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
<div class="px-6 mb-8 flex items-center gap-4">
<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.2)]">
<span class="material-symbols-outlined text-on-primary-container" style="font-variation-settings: 'FILL' 1;">api</span>
</div>
<div>
<h2 class="font-headline-md text-base font-bold text-white leading-tight tracking-wide">API Workspace</h2>
<p class="text-[10px] uppercase tracking-widest text-primary/80 font-medium mt-0.5">Production Env</p>
</div>
</div>

<nav class="flex-1 overflow-y-auto mt-4 custom-scrollbar">
<div class="px-6">
<p class="text-[10px] mb-3 uppercase font-bold tracking-widest text-on-surface-variant/70">Available Endpoints</p>
<div class="space-y-2" id="endpoint-list">
    <!-- Generated dynamically -->
</div>
</div>
</nav>
</aside>

<!-- Main Content Area -->
<main class="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
<header class="flex justify-between items-center w-full px-container-padding h-20 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] backdrop-blur-md">
<div class="flex items-center gap-4">
<span class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container tracking-tight">External API Test Workspace</span>
</div>
</header>

<div class="flex-1 flex flex-col p-10 overflow-y-auto custom-scrollbar">
    <div class="max-w-4xl mx-auto w-full">
        <h1 class="text-4xl font-bold mb-3 text-white tracking-tight" id="ep-title">Select an endpoint</h1>
        <p class="text-on-surface-variant/80 mb-10 text-lg leading-relaxed max-w-2xl" id="ep-desc">Click on an endpoint from the sidebar to view details, test, or copy the URL.</p>

        <div class="glass-panel rounded-2xl p-8 mb-8 hidden animate-[fadeIn_0.3s_ease-out]" id="ep-details">
            <div class="flex flex-wrap gap-4 items-center mb-8">
                <div class="px-4 py-1.5 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-secondary font-bold text-sm rounded-lg shadow-sm tracking-wider" id="ep-method">GET</div>
                <div class="flex-1 min-w-[300px] flex items-center bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 shadow-inner">
                    <input readonly class="flex-1 bg-transparent border-none focus:ring-0 text-sm font-code-md text-white outline-none" type="text" id="ep-url" value=""/>
                </div>
                <button onclick="copyUrl()" class="bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] text-white px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border border-[rgba(255,255,255,0.1)] active:scale-95 shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                    <span class="material-symbols-outlined text-[18px]">content_copy</span> Copy URL
                </button>
                <a id="ep-link" target="_blank" href="#" class="bg-gradient-to-r from-primary-container to-primary text-on-primary-container px-5 py-3 rounded-xl font-bold text-sm shadow-[0_4px_15px_rgba(56,189,248,0.3)] hover:shadow-[0_6px_20px_rgba(56,189,248,0.4)] hover:scale-[1.02] transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px]">open_in_new</span> Open
                </a>
            </div>

            <div class="mb-8">
                <h3 class="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-widest mb-3">
                    <span class="material-symbols-outlined text-[16px]">info</span> Meaningful Message / Usage Info
                </h3>
                <div class="bg-[rgba(0,0,0,0.2)] p-5 rounded-xl border border-[rgba(255,255,255,0.05)] text-[15px] leading-relaxed text-white/90 shadow-inner" id="ep-info">
                    <!-- Info goes here -->
                </div>
            </div>
            
            <div id="ep-body-section" class="hidden animate-[fadeIn_0.4s_ease-out]">
                 <h3 class="flex items-center gap-2 text-[11px] font-bold text-tertiary uppercase tracking-widest mb-3">
                    <span class="material-symbols-outlined text-[16px]">terminal</span> Example cURL
                 </h3>
                 <div class="bg-[#0B0F12] p-6 rounded-xl border border-[rgba(255,255,255,0.08)] font-code-sm text-[13px] overflow-x-auto shadow-inner relative group">
                    <div class="absolute top-0 left-0 w-1 h-full bg-tertiary/50 rounded-l-xl"></div>
                    <code id="ep-curl" class="text-white/90 whitespace-pre"></code>
                 </div>
            </div>
        </div>
    </div>
</div>

</main>

<script>
    const baseUrl = window.location.origin;
    
    const endpoints = [
        {
            id: 'ui',
            method: 'GET',
            path: '/ui',
            title: 'Request Inspector UI',
            desc: 'A visual inspector to view logged requests in real-time with a beautiful dashboard.',
            info: 'This endpoint serves a modern Dashboard where you can monitor all incoming API requests sent to the logging endpoint. It features real-time updates and detailed inspection of headers, body, and files.',
            methodColor: 'text-secondary'
        },
        {
            id: 'requests',
            method: 'GET',
            path: '/api/requests',
            title: 'View Logged Requests (JSON)',
            desc: 'Retrieve all recent requests stored in memory.',
            info: 'Returns a JSON array of all requests that have been caught by the API. Useful for programmatic access to the request logs.',
            methodColor: 'text-secondary',
            hasCurl: true
        },
        {
            id: 'log',
            method: 'POST',
            path: '/api/log',
            title: 'Log Request Endpoint',
            desc: 'The main endpoint to receive webhooks or test payloads.',
            info: 'Send any POST/PUT data here. It accepts JSON, Form Data, URL Encoded data, and file uploads. The payload will be parsed and stored for you to view in the Inspector UI.',
            methodColor: 'text-tertiary',
            hasCurl: true
        },
        {
            id: 'dummy-get',
            method: 'GET',
            path: '/api/dummy',
            title: 'Get Dummy Data',
            desc: 'Retrieve all items from the dummy JSON store.',
            info: 'Returns the full list of products/items currently in the dummy data store file.',
            methodColor: 'text-secondary',
            hasCurl: true
        },
        {
            id: 'dummy-get-single',
            method: 'GET',
            path: '/api/dummy/1',
            title: 'Get Single Dummy Item',
            desc: 'Retrieve a specific dummy item by its ID.',
            info: 'Returns the details of a single product/item matching the provided ID path parameter.',
            methodColor: 'text-secondary',
            hasCurl: true
        },
        {
            id: 'dummy-put',
            method: 'PUT',
            path: '/api/dummy/1',
            title: 'Update Dummy Item',
            desc: 'Modify properties of an existing dummy item.',
            info: 'Send a JSON payload with fields to update on the item with the matching ID. Changes are written directly to the server dummy JSON file.',
            methodColor: 'text-tertiary',
            hasCurl: true,
            curlPayload: '{"name": "Upgraded Wireless Headphones", "price": 109.99}'
        },
        {
            id: 'dummy-delete',
            method: 'DELETE',
            path: '/api/dummy/3',
            title: 'Delete Dummy Item',
            desc: 'Remove an item from the dummy JSON store.',
            info: 'Deletes the item matching the provided ID from the dummy data file on the server.',
            methodColor: 'text-red-400',
            hasCurl: true
        }
    ];

    let currentEp = null;

    function init() {
        const list = document.getElementById('endpoint-list');
        list.innerHTML = endpoints.map(ep => \`
            <div onclick="selectEndpoint('\${ep.id}')" id="nav-\${ep.id}" class="flex items-center gap-3 text-xs p-3.5 rounded-xl border border-transparent hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.05)] cursor-pointer text-on-surface-variant transition-all duration-200 group">
                <span class="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[rgba(255,255,255,0.05)] \${ep.methodColor} shadow-sm group-hover:bg-[rgba(255,255,255,0.1)] transition-colors">\${ep.method}</span> 
                <span class="font-code-sm text-[13px] group-hover:text-white transition-colors">\${ep.path}</span>
            </div>
        \`).join('');
        
        // Select first by default
        selectEndpoint('ui');
    }

    function selectEndpoint(id) {
        currentEp = endpoints.find(e => e.id === id);
        
        // Update nav highlight
        document.querySelectorAll('#endpoint-list > div').forEach(el => {
            el.classList.remove('bg-[rgba(255,255,255,0.08)]', 'border-[rgba(255,255,255,0.15)]', 'text-white', 'shadow-inner');
            el.classList.add('text-on-surface-variant');
            const pathSpan = el.querySelector('.font-code-sm');
            if(pathSpan) pathSpan.classList.remove('text-white', 'font-medium');
        });
        const activeNav = document.getElementById('nav-' + id);
        if(activeNav) {
            activeNav.classList.add('bg-[rgba(255,255,255,0.08)]', 'border-[rgba(255,255,255,0.15)]', 'text-white', 'shadow-inner');
            activeNav.classList.remove('text-on-surface-variant');
            const pathSpan = activeNav.querySelector('.font-code-sm');
            if(pathSpan) pathSpan.classList.add('text-white', 'font-medium');
        }

        // Trigger animation reset
        const detailsPanel = document.getElementById('ep-details');
        detailsPanel.classList.remove('animate-[fadeIn_0.3s_ease-out]');
        void detailsPanel.offsetWidth; // trigger reflow
        detailsPanel.classList.add('animate-[fadeIn_0.3s_ease-out]');

        // Update content
        document.getElementById('ep-title').textContent = currentEp.title;
        document.getElementById('ep-desc').textContent = currentEp.desc;
        detailsPanel.classList.remove('hidden');
        
        document.getElementById('ep-method').textContent = currentEp.method;
        if(currentEp.method === 'POST' || currentEp.method === 'PUT') {
             document.getElementById('ep-method').className = "px-4 py-1.5 bg-[rgba(255,193,118,0.1)] border border-[rgba(255,193,118,0.3)] text-tertiary font-bold text-sm rounded-lg shadow-sm tracking-wider";
        } else if(currentEp.method === 'DELETE') {
             document.getElementById('ep-method').className = "px-4 py-1.5 bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.3)] text-red-400 font-bold text-sm rounded-lg shadow-sm tracking-wider";
        } else {
             document.getElementById('ep-method').className = "px-4 py-1.5 bg-[rgba(78,222,163,0.1)] border border-[rgba(78,222,163,0.3)] text-secondary font-bold text-sm rounded-lg shadow-sm tracking-wider";
        }

        const fullUrl = baseUrl + currentEp.path;
        document.getElementById('ep-url').value = fullUrl;
        document.getElementById('ep-link').href = fullUrl;
        document.getElementById('ep-info').textContent = currentEp.info;

        const bodySec = document.getElementById('ep-body-section');
        if (currentEp.hasCurl) {
            bodySec.classList.remove('hidden');
            let curlText = '';
            if (currentEp.method === 'POST') {
                curlText = \`curl -X POST \${fullUrl} \\\\
  -H "Content-Type: application/json" \\\\
  -d '{"message": "Hello from API Tester!"}'\`;
            } else if (currentEp.method === 'PUT') {
                curlText = \`curl -X PUT \${fullUrl} \\\\
  -H "Content-Type: application/json" \\\\
  -d '\${currentEp.curlPayload}'\`;
            } else if (currentEp.method === 'DELETE') {
                curlText = \`curl -X DELETE \${fullUrl}\`;
            } else {
                curlText = \`curl -X GET \${fullUrl}\`;
            }
            document.getElementById('ep-curl').textContent = curlText;
        } else {
            bodySec.classList.add('hidden');
        }
    }

    function copyUrl() {
        if(!currentEp) return;
        const fullUrl = baseUrl + currentEp.path;
        navigator.clipboard.writeText(fullUrl).then(() => {
            const btn = document.querySelector('button[onclick="copyUrl()"]');
            const origHTML = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check</span> Copied!';
            btn.classList.add('text-secondary', 'border-secondary', 'bg-[rgba(78,222,163,0.1)]');
            setTimeout(() => {
                btn.innerHTML = origHTML;
                btn.classList.remove('text-secondary', 'border-secondary', 'bg-[rgba(78,222,163,0.1)]');
            }, 2000);
        });
    }

    window.onload = init;
</script>
</body>
</html>`;
};

module.exports = {
    buildLandingPage
};
