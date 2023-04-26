import redis
import os
from yt_dlp import YoutubeDL

conn = None;

def forge_data(datatype, text):
    return {"type": datatype, "log": text}

class DownloadLogger:
    def debug(self, msg):
        # For compatibility with youtube-dl, both debug and info are passed into debug
        # You can distinguish them by the prefix '[debug] '
        if msg.startswith('[debug] '):
            rep = conn.xadd("currtask", forge_data("log", str(msg)));

    def info(self, msg):
        rep = rep = conn.xadd("currtask", forge_data("log", str(msg)));


    def warning(self, msg):
        rep = conn.xadd("currtask", forge_data("log", str(msg)));

    def error(self, msg):
        rep = conn.xadd("currtask", forge_data("log", str(msg)));
        
def status_hook(d):
    if d['status'] == 'finished':
        conn.xadd("currtask", forge_data("status", "finished_download"));

if __name__ == '__main__':

    conn = redis.Redis(host='redis', port=6379, db=0)

    while True:
        print("Waiting for new item...")
        item = conn.blpop("jobQueue", timeout=0);

        URLS = [item[1].decode("utf-8")];
        ydl_opts = {
            'logger': DownloadLogger(),
            'progress_hooks': [status_hook],
            'format': 'bestaudio/best',
            'postprocessors': [{  # Extract audio using ffmpeg
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        }

        with YoutubeDL(ydl_opts) as ydl:
            ydl.download(URLS)
            conn.xadd("currtask", forge_data("status", "finished"));
