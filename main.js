const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        title: "A0Z_OS CORE",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false 
        }
    });

    win.loadFile('index.html');
    win.setMenuBarVisibility(false);

    win.webContents.on('did-start-navigation', (event, url) => {
        if (url.includes('.onion')) {
            win.webContents.session.setProxy({ proxyRules: "socks5://127.0.0.1:9050" });
        } else {
            win.webContents.session.setProxy({ proxyRules: "" });
        }
    });
}

app.whenReady().then(createWindow);
