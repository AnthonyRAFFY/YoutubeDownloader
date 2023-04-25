const express = require('express')
const redis = require('redis')
const app = express()
const port = 3000

const client = redis.createClient({url :  `redis://${process.env.REDIS_URL}`, legacyMode: true});
client.connect();

app.get('/stream/:job', async (req, res) => {

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    res.write('\n');

    const xread = ({ stream, id }) => {
        client.xRead('BLOCK', 0, 'STREAMS', stream, id, (err, str) => {
          if (err) return console.error('Error reading from stream:', err);
      
          str[0][1].forEach(message => {
            id = message[0];
            console.log(message[1]);
            res.write(message[1][1] + "\n");
          });
      
          setTimeout(() => xread({ stream, id }), 0)
        });
      }
      
      xread({ stream: req.params.job, id: '$' })

    res.on('close', () => {
        res.end();
    });
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})