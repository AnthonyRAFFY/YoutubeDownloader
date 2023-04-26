const express = require('express')
const redis = require('redis')
const sse = require('./sse');
const app = express()
const port = 3000
const cors = require('cors');


var corsOptions = {
  origin: "http://192.168.1.10:10500"
};
app.use(cors(corsOptions));


app.get('/stream/:job', sse, async (req, res) => {

    
    res.initSSE();

    let client = redis.createClient({url :  `redis://${process.env.REDIS_URL}`, legacyMode: true});
    await client.connect();

    const xread = ({ stream, id }) => {
        client.xRead('BLOCK', 0, 'STREAMS', stream, id, (err, str) => {
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
        // client.disconnect();
        res.end();
    });
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Starting Youtube-Downloader back-end ${port}`)
})