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

        clients.add(res);
    }

    res.on('close', () => {
        console.log("Connection closed in middleware.");
        clients.delete(res);
    });

    res.sendSSE = (event, text) => {
        let data = 
            `id: ${id}\n` + 
            `event: ${event}\n` +
            `data: ${text}\n\n`;
            
        console.log(`Sending to ${clients.size} clients`)
        for (let client of clients) {
            client.write(data);
        }
        id++;
    }

    next();
}

module.exports = sse;