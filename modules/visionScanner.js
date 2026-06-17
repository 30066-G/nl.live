let logger = null;
let windows = null;

let visionInterval = null;
let model = null;

function initVisionScanner(loggerInstance, windowManager) {
    logger = loggerInstance;
    windows = windowManager;
}

async function startObjectDetection() {
    const status = document.getElementById("visionStatus");
    const video = document.getElementById("visionVideo");
    const canvas = document.getElementById("visionCanvas");
    const ctx = canvas.getContext("2d");

    status.innerText = "LOADING NEURAL ENGINE...";
    status.style.color = "var(--neon-cyan)";

    logger?.info("Initializing Neural Matrix for Object Scanning...");

    if (!model) {
        model = await cocoSsd.load();
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.srcObject = stream;
        video.style.display = "block";

        status.innerText = "MATRIX LIVE [AI SCANNING ON]";
        status.style.color = "var(--neon-green)";

        const detectFrame = async () => {
            if (video.paused || video.ended) return;

            const predictions = await model.detect(video);

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            predictions.forEach(prediction => {
                const [x, y, width, height] = prediction.bbox;

                ctx.strokeStyle = "#00ff66";
                ctx.lineWidth = 3;
                ctx.strokeRect(x, y, width, height);

                ctx.fillStyle = "#00ff66";
                ctx.font = "14px monospace";
                ctx.fillText(
                    `${prediction.class.toUpperCase()} ${(prediction.score * 100).toFixed(0)}%`,
                    x,
                    y > 15 ? y - 5 : 15
                );
            });

            visionInterval = requestAnimationFrame(detectFrame);
        };

        video.onloadedmetadata = () => {
            detectFrame();
        };

    } catch (err) {
        status.innerText = "HARDWARE ACCESS DENIED";
        logger?.error("Hardware error: Camera node locked.");
    }
}

function stopVisionAiScanner() {
    cancelAnimationFrame(visionInterval);

    const video = document.getElementById("visionVideo");

    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }

    video.style.display = "none";

    windows?.close("vision_ai_scanner");

    logger?.error("AI Radar Stream Disconnected.");
}

export {
    initVisionScanner,
    startObjectDetection,
    stopVisionAiScanner
};