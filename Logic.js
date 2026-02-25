(function() {
    // ========== MATRIX RAIN BACKGROUND ==========
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    let w, h;

    function setCanvasDimensions() {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
    }
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    const columns = Math.floor(w / 20);
    const drops = [];
    for (let i = 0; i < columns; i++) drops[i] = Math.floor(Math.random() * -h);
    const chars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 5, 0, 0.045)';
        ctx.fillRect(0, 0, w, h);
        ctx.font = 'bold 16px "Share Tech Mono", monospace';
        ctx.shadowColor = '#1fff8e';
        ctx.shadowBlur = 6;
        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * 22;
            ctx.fillStyle = `rgba(50, 255, 100, ${Math.random()*0.5+0.3})`;
            ctx.fillText(char, x, drops[i]);
            if (drops[i] > h || Math.random() > 0.995) drops[i] = -20;
            else drops[i] += 16;
        }
        ctx.shadowBlur = 0;
        requestAnimationFrame(drawMatrix);
    }
    drawMatrix();

    // ========== TERMINAL LOGIC ==========
    const terminalContent = document.getElementById('terminalContent');

    // unified logging function to prevent errors
    function addLog(text) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.style.margin = "4px 0";
        line.innerHTML = `<span class="prompt">>></span> ${text}`;
        // Insert before the dynamic input line if it exists
        const dynamicLine = document.getElementById('dynamicTerminalLine');
        if (dynamicLine) {
            terminalContent.insertBefore(line, dynamicLine);
        } else {
            terminalContent.appendChild(line);
        }
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    // ========== REAL-TIME CLOCK ==========
    function updateClock() {
        const now = new Date();
        const clockDisplay = document.getElementById('largeClock');
        if (clockDisplay) clockDisplay.innerText = now.toLocaleTimeString('en-GB');
        
        let up = Math.floor(performance.now() / 1000);
        let hours = Math.floor(up / 3600).toString().padStart(2, '0');
        let mins = Math.floor((up % 3600) / 60).toString().padStart(2, '0');
        let secs = (up % 60).toString().padStart(2, '0');
        const uptimeDisplay = document.getElementById('uptime');
        if (uptimeDisplay) uptimeDisplay.innerText = `${hours}:${mins}:${secs}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // ========== QUICK LINKS GENERATOR ==========
    const quickLinks = [
        { name: "GITHUB", url: "https://github.com/creeperrick" },
        { name: "YOUTUBE", url: "https://youtube.com/@espdefeator" },
        { name: "TIKTOK", url: "https://tiktok.com/@espdefeator" },
        { name: "INSTAGRAM", url: "https://instagram.com/espdefeator" },
        { name: "EXTRA_01", url: "#" },
        { name: "EXTRA_02", url: "#" }
    ];

    const qlContainer = document.getElementById('quickLinksContainer');
    if (qlContainer) {
        qlContainer.innerHTML = ''; 
        quickLinks.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.target = "_blank";
            a.textContent = link.name;
            
            // Standard non-explorer styling
            a.style.display = "block";
            a.style.background = "#0f1f0f";
            a.style.border = "1px solid #2eff9e";
            a.style.color = "#fff";
            a.style.padding = "10px";
            a.style.marginBottom = "6px";
            a.style.textAlign = "center";
            a.style.textDecoration = "none";
            a.style.fontSize = "0.8rem";
            a.style.borderRadius = "4px";

            a.onclick = () => addLog(`executing: ${link.name}_LINK`);
            qlContainer.appendChild(a);
        });
    }

    // ========== INTERACTIVE FILE SYSTEM ==========
    const fs = {
        name: 'root',
        type: 'folder',
        children: [
            { 
                name: 'socials', 
                type: 'folder', 
                children: [
                    { name: 'tiktok.link', type: 'file', content: 'https://www.tiktok.com/@espdefeator' },
                    { name: 'youtube.cfg', type: 'file', content: 'https://youtube.com/@espdefeator' },
                    { name: 'instagram.ini', type: 'file', content: 'https://instagram.com/espdefeator' },
                    { name: 'hub.dev', type: 'file', content: 'https://github.com/creeperrick' }
                ]
            },
            { 
                name: 'matrix', 
                type: 'folder', 
                children: [
                    { name: 'rain.sh', type: 'file', content: 'echo "system_override --green"' },
                    { name: 'glitch.conf', type: 'file', content: 'level=high' }
                ]
            },
            { name: 'README.md', type: 'file', content: 'Welcome to ESPdefeator OS v1.0' }
        ]
    };

    let currentFolder = fs.children[0]; 
    let pathStack = [fs, fs.children[0]];

    const fileTreeEl = document.getElementById('fileTree');
    const folderIndicator = document.getElementById('folderIndicator');
    const currentPathEl = document.getElementById('currentPath');

    function renderTree(folder) {
        fileTreeEl.innerHTML = '';
        if (folder !== fs) {
            const back = document.createElement('div');
            back.className = 'tree-item folder';
            back.textContent = '..';
            back.onclick = goUp;
            fileTreeEl.appendChild(back);
        }

        folder.children.forEach(child => {
            const isLink = child.type === 'file' && child.content.startsWith('http');
            const item = document.createElement(isLink ? 'a' : 'div');
            item.className = `tree-item ${child.type === 'folder' ? 'folder' : 'file'}`;
            item.textContent = child.name;
            
            if(isLink) {
                item.href = child.content;
                item.target = "_blank";
            }

            item.onclick = (e) => {
                document.querySelectorAll('.tree-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                if (child.type === 'folder') {
                    pathStack.push(child);
                    renderTree(child);
                    addLog(`cd ./${child.name}`);
                } else {
                    addLog(`executing: ${child.name}`);
                }
            };
            fileTreeEl.appendChild(item);
        });

        const pathNames = pathStack.map(f => f.name === 'root' ? '' : f.name).join('/');
        const displayPath = (pathNames || '/') + '/';
        folderIndicator.innerText = displayPath;
        currentPathEl.innerText = `⚡ ${displayPath}`;
    }

    function goUp() {
        if (pathStack.length > 1) {
            pathStack.pop();
            renderTree(pathStack[pathStack.length - 1]);
            addLog(`cd ..`);
        }
    }

    // Init Explorer
    renderTree(currentFolder);
})();
