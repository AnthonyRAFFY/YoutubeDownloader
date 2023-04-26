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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form onSubmit={handleSubmit}>
        <h1>Youtube Downloader</h1>
        <label>
          URL:
          <input type="text" value={url} onChange={(event) => setUrl(event.target.value)} />
        </label>
        <br />
        <button>Télécharger</button>
      </form>
    </div>
  );
}

export default YoutubeDownloader;