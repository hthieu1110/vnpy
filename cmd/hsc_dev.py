import os
import sys
import time
import subprocess
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class RestartHandler(FileSystemEventHandler):
    def __init__(self, command):
        self.command = command
        self.process = None
        self.start_process()

    def start_process(self):
        if self.process:
            self.process.terminate()
            self.process.wait()
        self.process = subprocess.Popen([sys.executable] + self.command)

    def on_modified(self, event):
        if event.src_path.endswith(".py"):
            print("🔄 Code changed, restarting...")
            self.start_process()


if __name__ == "__main__":
    handler = RestartHandler(["cmd/hsc.py"])
    observer = Observer()
    observer.schedule(handler, ".", recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
