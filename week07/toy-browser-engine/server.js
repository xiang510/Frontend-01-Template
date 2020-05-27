const http = require('http');

const server = http.createServer((req, res) => {
    // console.log(req)
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('uuid', 'customer123');
    // res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.writeHead(200, { 'Content-Type': 'text/html' });
    // res.end('{name: "Jon"}');

    res.end(`<html maaa=a >
    <head>
        <style>
    body div #myid{
        width:100px;
        background-color: #ff5000;
    }
    body div img{
        width:30px;
        background-color: #ff1111;
    }
        </style>
    </head>
    <body>
        <div>
            <img id="myid"/>
            <img />
        </div>
    </body>
    </html>`);
});

server.listen('8000', () => {
    console.log('server is running.');
});
