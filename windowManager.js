export class WindowManager {
    constructor() {
        this.highestZIndex = 10;
    }

    open(windowId) {
        const win = document.getElementById(`win_${windowId}`);

        if (!win) return;

        win.style.display = "flex";
        this.focus(win);
    }

    close(windowId) {
        const win = document.getElementById(`win_${windowId}`);

        if (!win) return;

        win.style.display = "none";
    }

    focus(element) {
    if (!element) return;

    this.highestZIndex++;
    element.style.zIndex = this.highestZIndex;
}

    hideAll() {
        document.querySelectorAll(".app-window").forEach(win => {
            win.style.display = "none";
        });
    }
}