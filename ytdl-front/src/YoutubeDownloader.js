import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import "./YoutubeDownloader.css";

function YoutubeDownloader() {

  const navigate = useNavigate();
  const [url, setUrl] = useState("");

  const handleSubmit = (event) => {

    event.preventDefault();
    console.log(url);

    axios
    .post("http://192.168.1.10:10501/job/create", {
        url
    })
    .then(response => {
        if (response.data.jobId) {
          navigate("/download", {state:{jobId: response.data.jobId}})
        }
    });
  };
  

  return (
    <div class="flex flex-column">
      <form class="flex flex-column" onSubmit={handleSubmit}>
        <h1>Download a YouTube's video audio</h1>
        <input type="text" placeholder="Enter a YouTube URL" value={url} onChange={(event) => setUrl(event.target.value)} />
        <button>Télécharger</button>
      </form>
    </div>
  );
}

export default YoutubeDownloader;