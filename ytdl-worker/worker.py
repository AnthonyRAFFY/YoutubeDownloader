import redis
import os
from yt_dlp import YoutubeDL

class DownloadLogger:
    def debug(self, msg):
        # For compatibility with youtube-dl, both debug and info are passed into debug
        # You can distinguish them by the prefix '[debug] '
        if msg.startswith('[debug] '):
            pass
        else:
            self.info(msg)

    def info(self, msg):
        pass

    def warning(self, msg):
        pass

    def error(self, msg):
        print(msg)
        
def status_hook(d):
    if d['status'] == 'finished':
        print('Done downloading, now post-processing ...')


if __name__ == '__main__':

    r = redis.Redis(host='redis', port=6379, db=0)

    while True:
        print("Waiting for new item...")
        item = r.blpop("jobQueue", timeout=0);

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
