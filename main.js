import { Logger } from "./logger.js";
import { WindowManager } from "./windowManager.js";

const logger = new Logger();
const windows = new WindowManager();

let highestZIndex = 10;

// تفعيل الواجهة الرئيسية والتطبيقات
const appsList = [
    { id: 'cmd_system', name: 'Terminal', icon: 'fa-terminal' },
    { id: 'global_chat', name: 'Zulu Net', icon: 'fa-comments' },
    { id: 'official_ai_bot', name: 'AI Core', icon: 'fa-brain' },
    { id: 'vision_ai_scanner', name: 'Vision Radar', icon: 'fa-eye' },
    { id: 'web_browser', name: 'Browser', icon: 'fa-globe' },
    { id: 'data_stream', name: 'Flux Stream', icon: 'fa-chart-line' },
    { id: 'identity_matcher', name: 'Identity Match', icon: 'fa-fingerprint' }
];

function renderApps() {
    const home = document.getElementById('homeScreen');
    home.innerHTML = '';
    appsList.forEach(app => {
        home.innerHTML += `
        <div class="app-item" onclick="openAppWindow('${app.id}')">
            <div class="app-icon"><i class="fa-solid ${app.icon}"></i></div>
            <div class="app-name">${app.name}</div>
        </div>`;
    });
    // إضافة تطبيق Deploy المخصص
    home.innerHTML += `
        <div class="app-item" onclick="showDeployChoiceBox()">
            <div class="app-icon" style="color:var(--neon-magenta); border-color:var(--neon-magenta);"><i class="fa-solid fa-code"></i></div>
            <div class="app-name">Deploy Node</div>
        </div>`;
}

function openAppWindow(winId) {
    windows.open(winId);
}

function closeAppWindow(winId) {
    windows.close(winId);
}

function bringToFront(element) {
    windows.focus(element);
}

function handleNav(tab) {
    logCoreEvent(`Routing system context to target: ${tab.toUpperCase()}`, "var(--neon-cyan)");
    if(tab === 'home') {
        const windows = document.querySelectorAll('.app-window');
        windows.forEach(w => w.style.display = 'none');
    }
}

function logCoreEvent(message, color = "#fff") {
    logger.log(message, color);
}

// محاكاة قفل الشاشة والولوج السريع
function unlockWithOfficialEmail() {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;
    const feedback = document.getElementById('lockScreenFeedback');

    if ((user === 'admin' && pass === 'admin') || user.includes('@')) {
        document.getElementById('lockScreen').style.display = 'none';
        document.getElementById('hudMessage').innerText = "SYSTEM ONLINE";
        logCoreEvent("A0Z_OS CORE Matrix Decrypted. Initializing HUD...", "var(--neon-green)");
        initializeSystemStats();
        renderApps(); // بناء الواجهة
    } else {
        feedback.innerText = "[ACCESS DENIED] INVALID DECRYPTION KEY / IDENTIFIER";
        logCoreEvent("Security Breach Attempt Stopped.", "var(--neon-magenta)");
    }
}

function initializeSystemStats() {
    setInterval(() => {
        const cpu = Math.floor(Math.random() * 35) + 10;
        const mem = Math.floor(Math.random() * 20) + 45;
        if(document.getElementById('cpu-val')) document.getElementById('cpu-val').innerText = cpu + "%";
        if(document.getElementById('cpu-bar')) document.getElementById('cpu-bar').style.width = cpu + "%";
        if(document.getElementById('mem-val')) document.getElementById('mem-val').innerText = mem + "%";
        if(document.getElementById('mem-bar')) document.getElementById('mem-bar').style.width = mem + "%";
        
        const now = new Date();
        if(document.getElementById('liveClock')) document.getElementById('liveClock').innerText = now.toTimeString().substring(0,5);
    }, 2000);
}

// ==========================================================================
// 2. نظام الـ BIOMETRIC IDENTITY MATCHER (التعرف على الوجوه وحفظها)
// ==========================================================================
let systemDatabase = []; 
let agentCounter = 1;
let isModelsLoaded = false;
let localStream = null;

async function loadFaceModels() {
    logCoreEvent("Loading AI Biometric Facial Framework...", "var(--neon-cyan)");
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
    try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        isModelsLoaded = true;
        logCoreEvent("AI Biometric Framework Status: OPERATIONAL.", "var(--neon-green)");
    } catch(e) {
        logCoreEvent("Failed to download AI models from CDN network.", "var(--neon-magenta)");
    }
}
window.addEventListener('DOMContentLoaded', loadFaceModels);

async function startLiveCamera() {
    const video = document.getElementById('webcam');
    const container = document.getElementById('cameraContainer');
    
    logCoreEvent("Accessing video capture device...", "var(--neon-cyan)");
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        video.srcObject = localStream;
        container.style.display = "block";
        logCoreEvent("Biometric Camera Node: ONLINE.", "var(--neon-green)");
    } catch (err) {
        logCoreEvent("Hardware error: Camera node locked.", "var(--neon-magenta)");
    }
}

async function captureLiveFace() {
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('captureCanvas');
    if (!localStream) return;

    logCoreEvent("Analyzing frozen biometric frame...", "var(--neon-cyan)");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    localStream.getTracks().forEach(track => track.stop());
    document.getElementById('cameraContainer').style.display = "none";

    const dataUrl = canvas.toDataURL('image/jpeg');
    const img = new Image();
    img.src = dataUrl;
    img.onload = async () => { await evaluateBiometricData(img); };
}

async function processIdentityMatch(input) {
    const file = input.files[0];
    if (!file || !isModelsLoaded) return;
    const img = await faceapi.bufferToImage(file);
    await evaluateBiometricData(img);
}

async function evaluateBiometricData(imageElement) {
    const resultsDiv = document.getElementById('matchResults');
    resultsDiv.innerHTML = `<div style="color:var(--neon-cyan);">[SCANNING] Mapping vector points...</div>`;

    const detection = await faceapi.detectSingleFace(imageElement).withFaceLandmarks().withFaceDescriptor();
    if (!detection) {
        resultsDiv.innerHTML = `<div style="color:var(--neon-magenta);">[FAILED] No structural human profile found.</div>`;
        return;
    }

    const currentDescriptor = detection.descriptor;
    let matchedProfile = null;
    let threshold = 0.6;

    for (let agent of systemDatabase) {
        const distance = faceapi.euclideanDistance(currentDescriptor, agent.descriptor);
        if (distance < threshold) {
            threshold = distance;
            matchedProfile = agent;
        }
    }

    if (matchedProfile) {
        const acc = ((1 - threshold) * 100).toFixed(1);
        resultsDiv.innerHTML = `
            <div style="border:1px solid var(--neon-cyan); padding:10px; background:rgba(0,229,255,0.05);">
                <span style="color:var(--neon-cyan); font-weight:bold;">[TARGET DETECTED]</span><br>
                Database ID: <strong>${matchedProfile.id}</strong><br>
                Symmetry Match: <strong style="color:var(--neon-green);">${acc}%</strong>
            </div>`;
        logCoreEvent(`Profile Match Verified: ${matchedProfile.id}`, "var(--neon-green)");
    } else {
        const newId = `AGENT_${String(agentCounter).padStart(3, '0')}`;
        systemDatabase.push({ id: newId, descriptor: currentDescriptor });
        agentCounter++;
        resultsDiv.innerHTML = `
            <div style="border:1px solid var(--neon-magenta); padding:10px; background:rgba(255,0,127,0.05);">
                <span style="color:var(--neon-magenta); font-weight:bold;">[NEW SUITE MEMORY RECORDED]</span><br>
                Generated Handle: <strong>${newId}</strong><br>
                Biometrics Status: Cataloged.
            </div>`;
        logCoreEvent(`Enrolled New Facial Vector Identity: ${newId}`, "var(--neon-magenta)");
    }
}

// ==========================================================================
// 3. رادار مسح الأجسام الذكي (AI VISION OBJECT SCANNER)
// ==========================================================================
let visionInterval = null;
let model = null; // تعريف المتغير لتخزين نموذج الذكاء الاصطناعي

async function startObjectDetection() {
    const status = document.getElementById('visionStatus');
    const video = document.getElementById('visionVideo');
    const canvas = document.getElementById('visionCanvas');
    const ctx = canvas.getContext('2d');

    status.innerText = "LOADING NEURAL ENGINE...";
    status.style.color = "var(--neon-cyan)";
    logCoreEvent("Initializing Neural Matrix for Object Scanning...", "var(--neon-cyan)");

    // تحميل النموذج إذا لم يكن محملاً
    if (!model) {
        model = await cocoSsd.load();
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        video.style.display = 'block';
        
        status.innerText = "MATRIX LIVE [AI SCANNING ON]";
        status.style.color = "var(--neon-green)";

        // استخدام requestAnimationFrame بدلاً من setInterval لضمان السلاسة
        const detectFrame = async () => {
            if (video.paused || video.ended) return;

            // كشف العناصر
            const predictions = await model.detect(video);
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            predictions.forEach(prediction => {
                const [x, y, width, height] = prediction.bbox;
                
                // رسم المربع المستقبلي
                ctx.strokeStyle = '#00ff66';
                ctx.lineWidth = 3;
                ctx.strokeRect(x, y, width, height);
                
                // إظهار اسم العنصر المكتشف
                ctx.fillStyle = '#00ff66';
                ctx.font = '14px monospace';
                ctx.fillText(
                    `${prediction.class.toUpperCase()} ${(prediction.score * 100).toFixed(0)}%`, 
                    x, y > 15 ? y - 5 : 15
                );
            });

            visionInterval = requestAnimationFrame(detectFrame);
        };

        video.onloadedmetadata = () => { detectFrame(); };

    } catch (err) {
        status.innerText = "HARDWARE ACCESS DENIED";
        logCoreEvent("Hardware error: Camera node locked.", "var(--neon-magenta)");
    }
}

function stopVisionAiScanner() {
    cancelAnimationFrame(visionInterval); // إيقاف إطار العمل
    const video = document.getElementById('visionVideo');
    if(video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    video.style.display = 'none';
    closeAppWindow('vision_ai_scanner');
    logCoreEvent("AI Radar Stream Disconnected.", "var(--neon-magenta)");
}

// ==========================================================================
// 4. متصفح الويب (تم استبداله بـ Iframe ليعمل بشكل طبيعي)
// ==========================================================================
function loadBrowserUrl() {
    const urlInput = document.getElementById('browserUrl');
    const iframe = document.getElementById('browserFrame'); 
    let url = urlInput.value.trim();

    if (!url) return;
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

    logCoreEvent(`Routing connection to: ${url}`, "var(--neon-cyan)");
    iframe.src = url; 
}

function toggleQuantumVPN() {
    const btn = document.getElementById('vpnToggleBtn');
    if (btn.innerText.includes('OFF')) {
        btn.innerText = "VPN: ON";
        btn.style.borderColor = "var(--neon-green)";
        btn.style.color = "var(--neon-green)";
        logCoreEvent("Quantum Routing Encryption: ENABLED.", "var(--neon-green)");
    } else {
        btn.innerText = "VPN: OFF";
        btn.style.borderColor = "var(--neon-magenta)";
        btn.style.color = "var(--neon-magenta)";
        logCoreEvent("Quantum Routing Encryption: OFF.", "var(--neon-magenta)");
    }
}

// ==========================================================================
// 5. محرك الـ AI CORE MAINFRAME
// ==========================================================================
function setupOfficialAiEngine() {
    const grid = document.getElementById('coreAiChatGrid');
    const input = document.getElementById('coreAiInput');
    const btn = document.getElementById('coreAiSendBtn');
    const typing = document.getElementById('coreAiTyping');

    function appendCoreMsg(sender, text) {
        const box = document.createElement('div');
        const isMe = sender === 'user';
        box.style.alignSelf = isMe ? 'flex-end' : 'flex-start';
        box.style.background = isMe ? 'linear-gradient(135deg, #00f2fe, #4facfe)' : 'rgba(255,255,255,0.08)';
        box.style.color = isMe ? '#000' : '#fff';
        box.style.padding = '10px 14px';
        box.style.borderRadius = isMe ? '12px 12px 0 12px' : '12px 12px 12px 0';
        box.style.maxWidth = '85%';
        box.style.margin = '5px';
        box.style.wordBreak = 'break-word';
        box.innerText = text;
        grid.appendChild(box);
        grid.scrollTop = grid.scrollHeight;
    }

    async function askCoreAi(promptText) {
        typing.style.display = 'block';
        try {
            // تعليمات النظام: التركيز فقط على المحادثة
            const SYSTEM_PROMPT = `You are A0Z AI, a helpful, futuristic, and professional system assistant. Engage in a natural, friendly conversation with the user.`;
            const finalPrompt = `${SYSTEM_PROMPT}\n\nUSER: ${promptText}`;
            
            const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(finalPrompt)}`);
            let responseText = await res.text();
            
            typing.style.display = 'none';

            if (!responseText || responseText.trim().length === 0) {
                appendCoreMsg('bot', "System: Neural response empty.");
                return;
            }

            // عرض الرد مباشرة بدون أي معالجة إضافية
            appendCoreMsg('bot', responseText.trim());

        } catch (e) {
            typing.style.display = 'none';
            appendCoreMsg('bot', "❌ AI cloud connection failed.");
            console.error(e);
        }
    }

    function sendAction() {
        const txt = input.value.trim();
        if (!txt) return;
        appendCoreMsg('user', txt);
        input.value = '';
        askCoreAi(txt);
    }

    btn.onclick = sendAction;
    input.onkeypress = (e) => { if (e.key === 'Enter') sendAction(); };
}
window.addEventListener('DOMContentLoaded', () => {
    setupOfficialAiEngine();
});
// ==========================================================================
// 6. شبكة الـ ZULU NETWORK (الشات العام)
// ==========================================================================
const cyberNicknames = ['Root_Ghost', 'Net_Specter', 'X_Phantom', 'Cipher_00', 'Void_Hacker'];
function sendGlobalChatMessage() {
    const input = document.getElementById('chatMessageInput');
    const container = document.getElementById('chatContainer');
    const msg = input.value.trim();
    if (!msg) return;

    container.innerHTML += `<div style="font-family: monospace; font-size: 0.9rem;"><span style="color:var(--neon-green);">[YOU]</span>: ${msg}</div>`;
    input.value = '';
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
        const ghostUser = cyberNicknames[Math.floor(Math.random() * cyberNicknames.length)];
        const systemResponses = [
            "Data packet received, nice node injection.",
            "Who is probing the sub-net gateway?",
            "Encrypted stream established on port 9050.",
            "A0Z system signature detected in server room.",
            "Ping received. Node sync operational."
        ];
        const randomReply = systemResponses[Math.floor(Math.random() * systemResponses.length)];
        container.innerHTML += `<div style="font-family: monospace; font-size: 0.9rem;"><span style="color:var(--neon-cyan);">[${ghostUser}]</span>: ${randomReply}</div>`;
        container.scrollTop = container.scrollHeight;
    }, 1500);
}

// ==========================================================================
// 7. نظام الـ TERMINAL CMD EXECUTION
// ==========================================================================
function executeTerminalCmd() {
    const input = document.getElementById('cmdLineInput');
    const term = document.getElementById('systemTerminal');
    const cmd = input.value.trim().toLowerCase();
    if(!cmd) return;

    term.innerHTML += `<br><span style="color:#fff;">root@a0z:~# ${cmd}</span><br>`;
    
    if(cmd === 'help') {
        term.innerHTML += `Available directives:<br> - clear : Flush display cache.<br> - scan network : Run localized ping sweep.<br> - sysinfo : Output hardware architectural map.<br> - tor connect : Initialize encrypted proxy link.`;
    } else if (cmd === 'clear') {
        term.innerHTML = "Terminal memory cleared. Awaiting commands...<br>";
    } else if (cmd === 'sysinfo') {
        term.innerHTML += `CPU: AMD Quantum Node v3<br>OS: A0Z Cybernetic Kernel build 2026<br>SUBSYSTEM: Web Render Frame Core.`;
    } else if (cmd === 'scan network') {
        term.innerHTML += "Sweeping infrastructure... Found 3 active nodes. [PORT 9050 OPEN - ENCRYPTED INTERFACE]";
    } else {
        term.innerHTML += `<span style="color:var(--neon-magenta);">[ERROR] Command '${cmd}' unrecognized by shell.</span>`;
    }

    input.value = '';
    term.scrollTop = term.scrollHeight;
}

// ==========================================================================
// 8. نظام الـ CUSTOM RUNTIME & DEPLOY NODE 
// ==========================================================================
let deployedNodesDatabase = {
    "system_monitor": {
        name: "Core Monitor",
        payload: "document.getElementById('customContainer').innerHTML = '<h3 style=\"color:var(--neon-green);\">[MONITOR ACTIVE]</h3><p>Scanning localized data sectors for anomalies... System completely secure.</p>';"
    }
};

function showDeployChoiceBox() {
    const overlay = document.getElementById('destinationChoiceOverlay');
    const selector = document.getElementById('appSelector');
    
    selector.innerHTML = `<option value="new">-- Construct New Node --</option>`;
    for (let key in deployedNodesDatabase) {
        selector.innerHTML += `<option value="${key}">${deployedNodesDatabase[key].name}</option>`;
    }
    
    overlay.style.display = 'flex';
    logCoreEvent("Opened Node Deployment compiler module.", "var(--neon-cyan)");
}

function hideDeployChoiceBox() {
    document.getElementById('destinationChoiceOverlay').style.display = 'none';
}

function loadSelectedAppCode() {
    const selector = document.getElementById('appSelector');
    const nameInput = document.getElementById('appNameInput');
    const codeInput = document.getElementById('appCodeInput');
    const selectedKey = selector.value;

    if (selectedKey === 'new') {
        nameInput.value = '';
        codeInput.value = '';
    } else {
        nameInput.value = deployedNodesDatabase[selectedKey].name;
        codeInput.value = deployedNodesDatabase[selectedKey].payload;
    }
}

function confirmDeployDestination() {
    const name = document.getElementById('appNameInput').value.trim();
    const payload = document.getElementById('appCodeInput').value.trim();
    const container = document.getElementById('customContainer');
    const title = document.getElementById('customWinTitle');

    if (!name || !payload) {
        alert("Please fill in both Node Name and Payload JS Script.");
        return;
    }

    const nodeKey = name.toLowerCase().replace(/\s+/g, '_');
    deployedNodesDatabase[nodeKey] = { name: name, payload: payload };

    logCoreEvent(`Deploying payload architecture for node: ${name}...`, "var(--neon-cyan)");

    title.innerHTML = `🛸 Runtime Node: ${name.toUpperCase()}`;
    openAppWindow('custom_runtime');
    hideDeployChoiceBox();

    try {
        container.innerHTML = '';
        const runPayload = new Function(payload);
        runPayload();
        logCoreEvent(`Node [${name}] deployed successfully into workspace runtime.`, "var(--neon-green)");
    } catch (error) {
        container.innerHTML = `<div style="color:var(--neon-magenta);">[RUNTIME ERROR]<br>${error.message}</div>`;
        logCoreEvent(`Node Payload Crash: ${error.message}`, "var(--neon-magenta)");
    }
}

// ==========================================================================
// 9. تهيئة بيئة الجرافيكس (Particles.js & Canvas Visualizers)
// ==========================================================================
window.addEventListener('load', () => {
    const lockDate = document.getElementById('lockDate');
    if (lockDate) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        lockDate.innerText = new Date().toLocaleDateString('en-US', options);
    }

    const canvas = document.getElementById('streamCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
        let height = canvas.height = canvas.parentElement.offsetHeight || 500;
        
        const columns = Math.floor(width / 20);
        const drops = Array(columns).fill(1);

        setInterval(() => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#00ff66'; 
            ctx.font = '14px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = String.fromCharCode(Math.floor(Math.random() * 93) + 33);
                const x = i * 20;
                const y = drops[i] * 20;

                ctx.fillText(text, x, y);

                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }, 33);
    }
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const sphereGeometry = new THREE.SphereGeometry(12, 32, 16);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.12 });
const cyberSphere = new THREE.Mesh(sphereGeometry, sphereMaterial); scene.add(cyberSphere);

const ringGeometry = new THREE.RingGeometry(14, 14.2, 64);
const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x11ffbd, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
const cyberRing = new THREE.Mesh(ringGeometry, ringMaterial); cyberRing.rotation.x = Math.PI / 2; scene.add(cyberRing);

camera.position.z = 25;
function animate3D() { 
    requestAnimationFrame(animate3D); 
    cyberSphere.rotation.x += 0.002; cyberSphere.rotation.y += 0.004; cyberRing.rotation.z -= 0.003;
    renderer.render(scene, camera); 
}
animate3D();

particlesJS("particles-js", {
    particles: { number: { value: 30, density: { enable: true, value_area: 1200 } }, color: { value: "#00e5ff" }, opacity: { value: 0.4 }, size: { value: 1.5 }, line_linked: { enable: true, distance: 150, color: "#00e5ff", opacity: 0.15, width: 1 }, move: { enable: true, speed: 0.8 } },
    interactivity: { detect_on: "canvas", events: { onhover: { enable: false } } }, retina_detect: true
});

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});