(function() {
    // --- MATRIX RAIN ---
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    let w, h, cols, drops;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ｱｲｳｴｵｶｷｸｹｺ";

    function initMatrix() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        cols = Math.floor(w / 20);
        drops = Array(cols).fill(0);
    }

    function drawMatrix() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#0F0";
        ctx.font = "15px monospace";
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * 20, drops[i] * 20);
            if (drops[i] * 20 > h && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }

    window.addEventListener('resize', initMatrix);
    initMatrix();
    setInterval(drawMatrix, 50);

    // --- FILE SYSTEM ---
    const fs = {
        name: 'root',
        type: 'folder',
        children: [
            { 
                name: 'socials', 
                type: 'folder', 
                children: [
                    { name: 'tiktok.lnk', type: 'file', url: 'https://tiktok.com/@espdefeator' },
                    { name: 'youtube.cfg', type: 'file', url: 'https://youtube.com/@espdefeator' },
                    { name: 'instagram.ini', type: 'file', url: 'https://instagram.com/espdefeator' },
                    { name: 'github.dev', type: 'file', url: 'https://github.com/creeperrick' }
                ]
            },
            { 
                name: 'system', 
                type: 'folder', 
                children: [
                    { name: 'kernel.bin', type: 'file' },
                    { name: 'net_config', type: 'file' }
                ]
            }
        ]
    };

    let currentFolder = fs.children[0];
    let pathStack = [fs, fs.children[0]];

    function addLog(text) {
        const term = document.getElementById('terminalContent');
        const line = document.createElement('div');
        line.innerHTML = `<span class="prompt">>></span> ${text}`;
        term.insertBefore(line, document.getElementById('dynamicTerminalLine'));
        term.scrollTop = term.scrollHeight;
    }

    window.renderTree = function() {
        const treeEl = document.getElementById('fileTree');
        treeEl.innerHTML = '';
        
        if (currentFolder !== fs) {
            const up = document.createElement('div');
            up.className = 'tree-item';
            up.textContent = '..';
            up.onclick = () => { 
                pathStack.pop(); 
                currentFolder = pathStack[pathStack.length-1]; 
                renderTree(); 
                addLog('cd ..'); 
            };
            treeEl.appendChild(up);
        }

        currentFolder.children.forEach(item => {
            const el = document.createElement(item.url ? 'a' : 'div');
            el.className = `tree-item ${item.type === 'folder' ? 'folder' : 'file'}`;
            el.textContent = item.name;
            if (item.url) { el.href = item.url; el.target = "_blank"; }

            el.onclick = (e) => {
                if (item.type === 'folder') {
                    e.preventDefault();
                    pathStack.push(item);
                    currentFolder = item;
                    renderTree();
                    addLog(`cd ./${item.name}`);
                } else {
                    addLog(`executing ${item.name}...`);
                }
            };
            treeEl.appendChild(el);
        });

        const pathStr = pathStack.map(f => f.name === 'root' ? '' : f.name).join('/') + '/';
        document.getElementById('folderIndicator').innerText = pathStr;
        document.getElementById('currentPath').innerText = `⚡ ${pathStr}`;
    };

    // --- FULLSCREEN ---
    window.toggleFS = function() {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
    };

    // --- UPDATES ---
    setInterval(() => {
        const now = new Date();
        document.getElementById('largeClock').innerText = now.toLocaleTimeString('en-GB');
        document.getElementById('uptime').innerText = Math.floor(performance.now() / 1000) + "s";
    }, 1000);

    renderTree();
})();
