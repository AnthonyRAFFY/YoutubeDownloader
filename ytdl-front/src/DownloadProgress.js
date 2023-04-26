import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import "./DownloadProgress.css";

function DownloadProgress() {

    const location = useLocation();
    const output = useRef("");
    const [finalOutput, setFinalOutput] = useState("");

    useEffect(() => {

        console.log("Init")
        const sse = new EventSource(`http://192.168.1.10:10501/stream/${location.state.jobId}`);

        function appendOutput(e) {
          output.current = output.current + "\n" + e.data;
          setFinalOutput(output.current);
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
        <textarea id="console" rows="10" readonly="" name="log" value={finalOutput}>
        </textarea>
      );
}

export default DownloadProgress;