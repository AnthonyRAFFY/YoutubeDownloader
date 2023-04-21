# YoutubeDownloader

Attempt to create a Youtube video downloader.

Technologies used :

  - React : Front-End
  - Express
  - Nginx
  - Redis
  - Docker
  - Kubernetes (Later)
  

The goal is to have workers (containerized) fetching jobs from Redis, updating their status to an API (Express) and generating an URL to download the youtube video.


The user interface is really simple (i.e a simple text field) where you enter your URL. If a worker is available, it handles the job and send its logs to the API which then send it back to the user using Server-Sent Events (text/event-stream).

Later, expose a custom metric with Kubernetes to deploy automatically new workers if all are busy.
