const net = require('net');

class Request {
    constructor(options) {
        this.method = options.method || 'GET';
        this.host = options.host;
        this.port = options.port || '80';
        this.body = options.body || {};
        this.headers = options.headers || {};

        if (!this.headers['Content-Type']) {
            this.headers['Content-TYpe'] = 'application/x-www-form-urlencoded';
        }

        if (this.headers['Content-Type'] === 'application/json') {
            this.bodyText = JSON.stringify(this.body);
        } else if (
            this.headers['Content-Type'] === 'application/x-www-form-urlencoded'
        ) {
            this.bodyText = Object.keys(this.body).map(
                (k) => `${k}=${encodeURIComponent(this.body[k])}`
            );
        }

        this.headers['Content-Length'] = this.bodyText.length;
    }

    toString() {
        return `${this.method} / HTTP/1.1\r
            Host: ${this.host}\r
            ${Object.keys(this.headers)
                .map((k) => `${k}:${this.headers[k]}`)
                .join(',')}
        `;
    }

    send(connection) {
        if (connection) {
            connection.write(this.toString());
        } else {
            connection = net.createConnection(
                { port: this.port, host: this.host },
                () => {
                    connection.write(this.toString());
                }
            );
        }

        connection.on('data', (data) => {
            connection.end();
        });
        connection.on('error', (err) => {
            connection.end();
        });
    }
}

class Response {}

class ResponseParser {
    constructor() {
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6;
        this.WAITING_BODY = 7;

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = '';
        this.headers = {};
        this.headerName = '';
        this.headerValue = '';
        this.bodyParser = null;
    }
    receive(string) {
        for (let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i));
        }
    }

    receiveChar(char) {
        if (this.current === this.WAITING_STATUS_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END;
            } else {
                this.statusLine += char;
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_NAME) {
            if (char === ':') {
                this.current = this.WAITING_HEADER_SPACE;
            } else {
                this.headerName += char;
            }
        } else if (this.current === this.WAITING_HEADER_SPACE) {
            if (char === ' ') {
                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if (char === '\r') {
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
            } else {
                this.headerValue += char;
            }
        } else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        }
    }
}

class TrunkedBodyParser {
    constructor() {
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 3;

        this.isFinished = false;
        this.length = 0;
        this.content = [];

        this.current = this.WAITING_LENGTH;
    }

    receiveChar(char) {
        if (this.current === this.WAITING_LENGTH) {
            if (char === '\r') {
                this.current = this.WAITING_LENGTH_LINE_END;
            } else {
                this.length *= 10;
                this.length += char.charCodeAt(0) - '0'.charAt(0);
            }
        } else if (this.current === this.WAITING_LENGTH_LINE_END) {
            if (char === '\n') {
                this.current = this.READING_TRUNK;
            }
        } else if (this.current === this.READING_TRUNK) {
        }
    }
}
// const client = net.createConnection(
//     {
//         port: '8000',
//         host: 'localhost',
//     },
//     () => {
//         console.log('conneted');
//         client.write('GET / HTTP/1.1\r\n');
//         client.write('Host: 127.0.0.1\r\n');
//         client.write('Content-Type: application/json\r\n');
//         client.write('Body: {key: "111"}');
//         // client.write('Content-Length: 100');
//     }
// );

// client.on('data', (d) => {
//     console.log(d.toString());
//     client.end();
// });

// client.on('end', () => {
//     console.log('disconnected');
// });
