
const { log } = require('./logger');

// SSE Middleware
let clients = new Set();
let id = 0;

sse = (req, res, next) => {

    
    res.initSSE = () => {
        res.writeHead(200, {
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive'
        });

        log("New client");
        clients.add(res);
    }

    res.on('close', () => {
        clients.delete(res);
        log(`Removing a client. ${clients.size} remaining`)
    });

    res.sendSSE = (event, text) => {
        let data = 
            `id: ${id}\n` + 
            `event: ${event}\n` +
            `data: ${text}\n\n`;
            
        for (let client of clients) {
            client.write(data);
        }
        id++;
    }

    next();
}

module.exports = sse;