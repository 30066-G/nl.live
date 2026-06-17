let logger = null;
let windows = null;

let visionRunning = false;
let identityReady = false;

let activeStreams = {
    camera: null,
    visionRAF: null
};

function initSystemController(loggerInstance, windowManager) {
    logger = loggerInstance;
    windows = windowManager;

    logger?.log("A0Z CORE CONTROLLER INITIALIZED", "var(--neon-cyan)");
}

/* =========================
   VISION CONTROL
========================= */

async function startVision(startObjectDetectionFn) {
    if (visionRunning) return;

    visionRunning = true;
    logger?.log("Vision Module Activated", "var(--neon-green)");

    await startObjectDetectionFn();
}

function stopVision(stopVisionFn) {
    visionRunning = false;
    stopVisionFn();

    logger?.log("Vision Module Stopped", "var(--neon-magenta)");
}

/* =========================
   IDENTITY CONTROL
========================= */

async function initIdentity(loadFaceModelsFn) {
    await loadFaceModelsFn();
    identityReady = true;
    logger?.log("Identity Engine Ready", "var(--neon-green)");
}

async function runIdentityCapture(startCameraFn, captureFn) {
    if (!identityReady) {
        logger?.log("Identity Engine Not Ready", "var(--neon-magenta)");
        return;
    }

    await startCameraFn();
    setTimeout(() => captureFn(), 800);
}

/* =========================
   WINDOW CONTROL WRAPPER
========================= */

function openApp(winId) {
    windows?.open(winId);
}

function closeApp(winId) {
    windows?.close(winId);
}

export {
    initSystemController,
    startVision,
    stopVision,
    initIdentity,
    runIdentityCapture,
    openApp,
    closeApp
};