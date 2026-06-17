export class Logger {
    constructor(elementId = "liveActivityLogger") {
        this.logger = document.getElementById(elementId);
    }

    log(message, color = "#fff") {
        if (!this.logger) return;

        const timestamp = new Date().toLocaleTimeString();

        const row = document.createElement("div");
        row.style.color = color;
        row.style.fontFamily = "monospace";
        row.style.fontSize = "0.8rem";
        row.textContent = `[${timestamp}] ${message}`;

        this.logger.appendChild(row);
        this.logger.scrollTop = this.logger.scrollHeight;
    }

    success(message) {
        this.log(message, "var(--neon-green)");
    }

    info(message) {
        this.log(message, "var(--neon-cyan)");
    }

    error(message) {
        this.log(message, "var(--neon-magenta)");
    }
}