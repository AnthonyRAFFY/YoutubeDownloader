const express = require('express')
const redis = require('redis')
const sse = require('./sse');
const app = express()
const port = 3000
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');


var corsOptions = {
  origin: "http://192.168.1.10:10500"
};


app.use(express.json());
app.use(cors(corsOptions));

const client = redis.createClient({url :  `redis://${process.env.REDIS_URL}`, legacyMode: true});
client.connect();

app.post('/job/create', function(req, res) {
  const url = req.body.url;

  // TO-DO (Need a middleware sanitizer for YouTube URLs)
  
  // Generate UUID
  jobId = uuidv4();

  client.sAdd('jobs', jobId);
  client.set(`jobs:${jobId}:url`, url);

  client.rPush("jobsQueue", jobId);
  // TO-DO (Generate a job in REDIS + Send URL to worker + jobId to client)
  res.json({"jobId" : jobId})
});


app.get('/stream/:job', sse, async (req, res) => {

    
    res.initSSE();

    let tempClient = redis.createClient({url :  `redis://${process.env.REDIS_URL}`, legacyMode: true});
    await tempClient.connect();

    const xread = ({ stream, id }) => {
      tempClient.xRead('BLOCK', 0, 'STREAMS', stream, id, (err, str) => {
          if (err) return console.error('Error reading from stream:', err);
      
          str[0][1].forEach(message => {
            id = message[0];
            res.sendSSE(message[1][1], message[1][3]);
          });

          setTimeout(() => xread({ stream, id }), 0)
        });
      }
      
      xread({ stream: req.params.job, id: '0' })

    res.on('close', () => {
        console.log("Connection closed in main.");
        // TO-DO(Find a way to disconnect redis client without error)
        // tempClient.disconnect();
        res.end();
    });
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Starting Youtube-Downloader back-end ${port}`)
})