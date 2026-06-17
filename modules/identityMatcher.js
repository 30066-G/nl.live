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
export {
    loadFaceModels,
    startLiveCamera,
    captureLiveFace,
    processIdentityMatch
};
