import redis
import os
import functools
from yt_dlp import YoutubeDL

conn = None;

def forge_data(datatype, text):
    return {"type": datatype, "log": text}

class DownloadLogger:

    def __init__(self, uuid):
        self.uuid = uuid;
    
    def debug(self, msg):
        # For compatibility with youtube-dl, both debug and info are passed into debug
        # You can distinguish them by the prefix '[debug] '
        if not msg.startswith('[debug] '):
            rep = conn.xadd(self.uuid, forge_data("log", str(msg)));

    def info(self, msg):
        rep = rep = conn.xadd(self.uuid, forge_data("log", str(msg)));


    def warning(self, msg):
        rep = conn.xadd(self.uuid, forge_data("log", str(msg)));

    def error(self, msg):
        rep = conn.xadd(self.uuid, forge_data("log", str(msg)));
        
def status_hook(d, uuid):
    if d['status'] == 'finished':
        conn.xadd(uuid, forge_data("status", "finished_download"));

if __name__ == '__main__':

    conn = redis.Redis(host='redis', port=6379, db=0)

    while True:
        print("Waiting for new item...")
        item = conn.blpop("jobsQueue", timeout=0);
        
        uuid = item[1].decode("utf-8");
        url = conn.get("jobs:" + uuid + ":url");
        url = url.decode("utf-8");
        print("URL : " + str(url));
        URLS = [url];
        ydl_opts = {
            'logger': DownloadLogger(uuid),
            'progress_hooks': [functools.partial(status_hook, uuid=uuid)],
            'format': 'bestaudio/best',
            'outtmpl': '../mp3-data/' + str(uuid) + '',
            'postprocessors': [{  # Extract audio using ffmpeg
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        }

        with YoutubeDL(ydl_opts) as ydl:
            ydl.download(URLS)
            conn.xadd(uuid, forge_data("status", "finished"));
