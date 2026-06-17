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

‎    // تحميل النموذج إذا لم يكن محملاً
    if (!model) {
        model = await cocoSsd.load();
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        video.style.display = 'block';
        
        status.innerText = "MATRIX LIVE [AI SCANNING ON]";
        status.style.color = "var(--neon-green)";

‎        // استخدام requestAnimationFrame بدلاً من setInterval لضمان السلاسة
        const detectFrame = async () => {
            if (video.paused || video.ended) return;

‎            // كشف العناصر
            const predictions = await model.detect(video);
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            predictions.forEach(prediction => {
                const [x, y, width, height] = prediction.bbox;
                
‎                // رسم المربع المستقبلي
                ctx.strokeStyle = '#00ff66';
                ctx.lineWidth = 3;
                ctx.strokeRect(x, y, width, height);
                
‎                // إظهار اسم العنصر المكتشف
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
export {
    startObjectDetection,
    stopVisionAiScanner
};