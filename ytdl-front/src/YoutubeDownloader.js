import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./YoutubeDownloader.css";

function YoutubeDownloader() {

  const [url, setUrl] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(url);
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
        <Link to="/download">
          <button>Télécharger</button>
        </Link>

      </form>
    </div>
  );
}

export default YoutubeDownloader;