import './App.css';
import YoutubeDownloader from './YoutubeDownloader';
import DownloadProgress from './DownloadProgress';
import Layout from './Layout';
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<YoutubeDownloader/>} />
            <Route path="download/:jobId" element={<DownloadProgress/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
