import redis
import os
import functools
import boto3
import logging
from botocore.exceptions import ClientError
from yt_dlp import YoutubeDL

conn = None;
s3 = boto3.resource('s3')

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
        conn.xadd(uuid, forge_data("status", "FINISHED_DOWNLOAD"));

def check_env_variable(name):
    if (os.getenv(name) is None):
        logging.critical("Missing {} environment variable".format(name));
        return False;
    return True;

def main():
    global conn;
    # ENVIRONMENTS VARIABLES
    # PROD or DEV
    WORKER_ENV = os.getenv("WORKER_ENV");
    logging.basicConfig(level=(logging.INFO if WORKER_ENV == "PROD" else logging.DEBUG), 
                        format="%(asctime)s - %(levelname)s - %(message)s");
    # S3 already check some of this, but we do not want to keep the container running and possibly handling a request if this is bound to fail
    if ((not check_env_variable("S3_BUCKET")) |
        (not check_env_variable("AWS_ACCESS_KEY_ID")) |
        (not check_env_variable("AWS_SECRET_ACCESS_KEY")) |
        (not check_env_variable("AWS_DEFAULT_REGION"))):
        return;

    BUCKET_NAME = os.getenv("S3_BUCKET");

    # REDIS CONNECTION
    try:
        conn = redis.Redis(host='redis', port=6379, db=0)
    except Exception as e:
        logging.critical("Redis connection failed.");
        return;

    # MAIN LOOP
    while True:
        logging.info("Waiting for item.");

        # Item is 
        item = conn.blpop("jobsQueue", timeout=0);
        uuid = item[1].decode("utf-8");
        url = conn.get("jobs:" + uuid + ":url");
        url = url.decode("utf-8");
        logging.debug("URL : " + str(url));
        URLS = [url];

        mp3_filename = str(uuid) + ".mp3";
        mp3_path = os.path.join(os.getcwd(), str(uuid));
        mp3_file = os.path.join(os.getcwd(), mp3_filename);
        ydl_opts = {
            'logger': DownloadLogger(uuid),
            'progress_hooks': [functools.partial(status_hook, uuid=uuid)],
            'format': 'bestaudio/best',
            'outtmpl': mp3_path,
            'postprocessors': [{  # Extract audio using ffmpeg
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        }

        with YoutubeDL(ydl_opts) as ydl:
            try: 
                # Download
                ydl.download(URLS)
                data = open(mp3_file, 'rb')
                # Send to S3
                s3.Bucket(BUCKET_NAME).put_object(Key=mp3_filename, Body=data)
                s3_client = boto3.client('s3')
                response = s3_client.generate_presigned_url('get_object', Params={'Bucket': BUCKET_NAME, 'Key': mp3_filename}, ExpiresIn=300)
                
                conn.xadd(uuid, forge_data("status", "FINISHED_READY|" + response));
            except Exception as e:
                logging.critical(e);
                conn.xadd(uuid, forge_data("status", "error"));

if __name__ == '__main__':
    main();
            
