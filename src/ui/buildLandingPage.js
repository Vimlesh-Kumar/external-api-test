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
                    "container-padding": "24px",
                    "stack-md": "16px",
                    "sidebar-width": "260px",
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
                }
            }
        }
    }
</script>
</head>
<body class="bg-background text-on-background font-body-md text-body-md overflow-hidden h-screen flex">
<!-- SideNavBar -->
<aside class="w-sidebar-width flex flex-col h-screen py-stack-md bg-surface-container border-r border-outline-variant transition-all duration-200 ease-in-out">
<div class="px-4 mb-6 flex items-center gap-3">
<div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center">
<span class="material-symbols-outlined text-on-primary-container" style="font-variation-settings: 'FILL' 1;">api</span>
</div>
<div>
<h2 class="font-headline-md text-headline-md text-on-surface leading-tight">API Test</h2>
<p class="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">Production Env</p>
</div>
</div>

<nav class="flex-1 overflow-y-auto mt-4">
<div class="px-6">
<p class="text-[10px] text-outline mb-2 uppercase font-bold tracking-tighter text-on-surface-variant">Available Endpoints</p>
<div class="space-y-1" id="endpoint-list">
    <!-- Generated dynamically -->
</div>
</div>
</nav>
</aside>

<!-- Main Content Area -->
<main class="flex-1 flex flex-col min-w-0 bg-surface-dim">
<header class="flex justify-between items-center w-full px-container-padding h-14 bg-surface-dim border-b border-outline-variant">
<div class="flex items-center gap-8">
<span class="text-headline-md font-headline-md font-bold text-primary-container">Welcome to the External API Test Workspace</span>
</div>
</header>

<div class="flex-1 flex flex-col p-8 overflow-y-auto">
    <div class="max-w-4xl">
        <h1 class="text-2xl font-bold mb-2" id="ep-title">Select an endpoint</h1>
        <p class="text-on-surface-variant mb-8" id="ep-desc">Click on an endpoint from the sidebar to view details, test, or copy the URL.</p>

        <div class="glass-panel rounded-lg border-outline-variant p-6 mb-8 hidden" id="ep-details">
            <div class="flex gap-2 items-center mb-6">
                <div class="px-3 py-1 bg-surface-container-high border border-outline-variant text-secondary font-bold text-sm rounded" id="ep-method">GET</div>
                <div class="flex-1 flex items-center bg-surface-container-high border border-outline-variant rounded px-4 py-2">
                    <input readonly class="flex-1 bg-transparent border-none focus:ring-0 text-sm font-code-md text-primary" type="text" id="ep-url" value=""/>
                </div>
                <button onclick="copyUrl()" class="bg-surface-container-highest hover:bg-surface-bright text-on-surface px-4 py-2 rounded font-bold text-sm transition-colors flex items-center gap-2 border border-outline-variant">
                    <span class="material-symbols-outlined text-[18px]">content_copy</span> Copy URL
                </button>
                <a id="ep-link" target="_blank" href="#" class="bg-primary text-on-primary px-4 py-2 rounded font-bold text-sm shadow-lg hover:brightness-110 transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px]">open_in_new</span> Open
                </a>
            </div>

            <div class="mb-6">
                <h3 class="text-xs font-label-caps text-on-surface-variant mb-2">Meaningful Message / Usage Info</h3>
                <div class="bg-surface-container-low p-4 rounded border border-outline-variant text-sm" id="ep-info">
                    <!-- Info goes here -->
                </div>
            </div>
            
            <div id="ep-body-section" class="hidden">
                 <h3 class="text-xs font-label-caps text-on-surface-variant mb-2">Example cURL</h3>
                 <div class="bg-background p-4 rounded border border-outline-variant font-code-sm text-sm overflow-x-auto">
                    <code id="ep-curl" class="text-on-surface"></code>
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
            desc: 'A visual inspector to view logged requests in real-time.',
            info: 'This endpoint serves a beautiful Dashboard where you can monitor all the incoming API requests sent to the logging endpoint.',
            methodColor: 'text-secondary'
        },
        {
            id: 'requests',
            method: 'GET',
            path: '/api/requests',
            title: 'View Logged Requests (JSON)',
            desc: 'Retrieve all recent requests stored in memory.',
            info: 'Returns a JSON array of all requests that have been caught by the API. Useful for programmatic access to the request logs.',
            methodColor: 'text-secondary'
        },
        {
            id: 'log',
            method: 'POST',
            path: '/api/log',
            title: 'Log Request Endpoint',
            desc: 'The main endpoint to receive webhooks or test payloads.',
            info: 'Send any POST/PUT data here. It accepts JSON, Form Data, URL Encoded data, and file uploads. The payload will be parsed and stored for you to view in the Inspector UI.',
            methodColor: 'text-tertiary',
            isPost: true
        }
    ];

    let currentEp = null;

    function init() {
        const list = document.getElementById('endpoint-list');
        list.innerHTML = endpoints.map(ep => \`
            <div onclick="selectEndpoint('\${ep.id}')" id="nav-\${ep.id}" class="flex items-center gap-2 text-xs py-2 px-3 rounded hover:bg-surface-container-highest cursor-pointer text-on-surface-variant transition-colors">
                <span class="text-[10px] font-bold \${ep.methodColor}">\${ep.method}</span> 
                <span class="font-code-sm">\${ep.path}</span>
            </div>
        \`).join('');
        
        // Select first by default
        selectEndpoint('ui');
    }

    function selectEndpoint(id) {
        currentEp = endpoints.find(e => e.id === id);
        
        // Update nav highlight
        document.querySelectorAll('#endpoint-list > div').forEach(el => {
            el.classList.remove('bg-surface-bright', 'text-on-surface');
            el.classList.add('text-on-surface-variant');
        });
        const activeNav = document.getElementById('nav-' + id);
        if(activeNav) {
            activeNav.classList.add('bg-surface-bright', 'text-on-surface');
            activeNav.classList.remove('text-on-surface-variant');
        }

        // Update content
        document.getElementById('ep-title').textContent = currentEp.title;
        document.getElementById('ep-desc').textContent = currentEp.desc;
        document.getElementById('ep-details').classList.remove('hidden');
        
        document.getElementById('ep-method').textContent = currentEp.method;
        if(currentEp.method === 'POST') {
             document.getElementById('ep-method').className = "px-3 py-1 bg-surface-container-high border border-outline-variant text-tertiary font-bold text-sm rounded";
        } else {
             document.getElementById('ep-method').className = "px-3 py-1 bg-surface-container-high border border-outline-variant text-secondary font-bold text-sm rounded";
        }

        const fullUrl = baseUrl + currentEp.path;
        document.getElementById('ep-url').value = fullUrl;
        document.getElementById('ep-link').href = fullUrl;
        document.getElementById('ep-info').textContent = currentEp.info;

        const bodySec = document.getElementById('ep-body-section');
        if (currentEp.isPost) {
            bodySec.classList.remove('hidden');
            document.getElementById('ep-curl').textContent = \`curl -X POST \${fullUrl} \\\\
  -H "Content-Type: application/json" \\\\
  -d '{"message": "Hello from API Tester!"}'\`;
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
            btn.classList.add('text-secondary', 'border-secondary');
            setTimeout(() => {
                btn.innerHTML = origHTML;
                btn.classList.remove('text-secondary', 'border-secondary');
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
