import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import "./DownloadProgress.css";

function DownloadProgress() {

    const location = useLocation();
    const output = useRef([]);
    const [finalOutput, setFinalOutput] = useState("");

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
        const sse = new EventSource(`http://192.168.1.10:10501/stream/${location.state.jobId}`);

        function appendOutput(e) {

          if (output.current.length === 10) {
            output.current.shift();
          }
          output.current.push(e.data);
          setFinalOutput(getOutput());
        }
        
        sse.addEventListener('log', appendOutput, false);
      
        //sse.addEventListener('status', function(e) {
            //console.log(e.data);
            //setOutput(output + "\n" + e.data);
        //  }, false);
      
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
    }, [location.state.jobId]);


    return (
        <div class="flex flex-column">
          <h1>Your download is in progress...</h1>
          <textarea id="console" rows="10" readonly="" name="log" value={finalOutput}>
          </textarea>
          <h2>Generating link...</h2>
        </div>
      );
}

export default DownloadProgress;