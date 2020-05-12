const http = require('http');

const server = http.createServer((req, res) => {
    // console.log(req)
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('uuid', 'customer123');
    res.writeHead(200, { 'Content-Type': 'application/json'})
    res.end('{name: "Jon"}');
});

server.listen('8000', () => {
    console.log('server is running.')
});
