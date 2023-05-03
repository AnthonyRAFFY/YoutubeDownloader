import React, { useRef, useState, useEffect } from "react";
import { useParams  } from "react-router-dom";

import "./DownloadProgress.css";

function DownloadProgress() {

    const { jobId } = useParams();
    const output = useRef([]);
    const [finalOutput, setFinalOutput] = useState("");
    const [isFinished, setFinished] = useState(false);

    function getOutput() {
      let text = "";
      for (let line of output.current) {
        if (text === "") {
          text += line;
        }
        else {
          text += "\n" + line;
        }
      }

      return text;
    }

    useEffect(() => {

        console.log("Init")
        const sse = new EventSource(`http://192.168.1.10:10501/stream/${jobId}`);

        function appendOutput(e) {

          if (output.current.length === 10) {
            output.current.shift();
          }
          output.current.push(e.data);
          setFinalOutput(getOutput());
        }
        
        sse.addEventListener('log', appendOutput, false);
      
        sse.addEventListener('status', function(e) {
            
            if (e.data === "finished") {
              setFinished(true);
            }

        }, false);
      
        sse.onopen = () => {
            console.log('connected');
          };

        sse.addEventListener('close', () =>
            sse.close()
        );

        return () => {
          sse.removeEventListener('log', appendOutput)
          sse.close();
          console.log("Cleanup..");
        }
    }, [jobId]);


    return (
        <div className="flex flex-column">
          <h1>Your download is in progress...</h1>
          <textarea id="console" rows="10" readOnly="" name="log" defaultValue={finalOutput}>
          </textarea>

          {!isFinished ? (
            <h2>Generating download link...</h2>  
          ) : (
            <h2>Click <a href={`http://192.168.1.10:10501/${jobId}.mp3`}>here</a> to download your file</h2>  
          )}
        </div>
      );
}

export default DownloadProgress;