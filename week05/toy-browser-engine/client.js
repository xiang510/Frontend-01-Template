const net = require("net");

class Request {
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host;
    this.path = options.path || "/";
    this.port = options.port || "80";
    this.body = options.body || {};
    this.headers = options.headers || {};

    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (
      this.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
      this.bodyText = Object.keys(this.body)
        .map((k) => `${k}=${encodeURIComponent(this.body[k])}`)
        .join("&");
    }
    // console.log(this.bodyText);
    this.headers["Content-Length"] = this.bodyText.length;
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r\nHost: ${
      this.host
    }\r\n${Object.keys(this.headers)
      .map((k) => `${k}: ${this.headers[k]}`)
      .join("\r\n")}\r\n\r\n`;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      if (connection) {
        connection.write(this.toString());
      } else {
        // console.log(this.toString());
        connection = net.createConnection(
          { port: this.port, host: this.host },
          () => {
            connection.write(this.toString());
          }
        );
      }

      connection.on("data", (data) => {
        parser.receive(data.toString());
        // if (parser.isFinished) {
        //   resolve(parser.response);
        // }
        // console.log(parser.statusLine)
        // console.log(parser.headers);
        // resolve(data.toString());
        connection.end();
      });
      connection.on("error", (err) => {
        reject(err);
        connection.end();
      });
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
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParser = null;
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s|S])+/);

    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(""),
    };
  }

  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }

  receiveChar(char) {
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === "\r") {
        this.current = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === "\n") {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ":") {
        this.current = this.WAITING_HEADER_SPACE;
      } else if (char === "\r") {
        this.current = this.WAITING_HEADER_BLOCK_END;
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === " ") {
        this.current = this.WAITING_HEADER_VALUE;
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === "\r") {
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === "\n") {
        this.current = this.WAITING_HEADER_NAME;
        this.headerName = "";
        this.headerValue = "";
      }
    } 
    else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (char === "\n") {
        this.current = this.WAITING_BODY;
        if (this.headers["Transfer-Encoding"] === "chunked") {
          this.bodyParser = new TrunkedBodyParser();
        }
      }
    } else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char);
    }
  }
}

class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;

    this.isFinished = false;
    this.length = 0;
    this.content = [];

    this.current = this.WAITING_LENGTH;
  }

  receiveChar(char) {
    // console.log(JSON.stringify(char));
    if (this.current === this.WAITING_LENGTH) {
      if (char === "\r") {
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.current = this.WAITING_LENGTH_LINE_END;
      } else {

        this.length *= 10;
        this.length += char.charCodeAt(0) - "0".charCodeAt(0);

      }
    } else if (this.current === this.WAITING_LENGTH_LINE_END) {
      if (char === "\n") {
        this.current = this.READING_TRUNK;
      }
    } else if (this.current === this.READING_TRUNK) {
    
      this.content.push(char);

      console.log(this.content)
      this.length--;

        // console.log(this.length)
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE;
      }
    } else if (this.current === this.WAITING_NEW_LINE) {
      if (char === "\r") {
        this.current = this.WAITING_NEW_LINE_END;
      }
    } else if (this.current === this.WAITING_NEW_LINE_END) {
      if (char === "\n") {
        this.current = this.WAITING_LENGTH;
      }
    }

  }
}

void (async function () {
  let req = new Request({
    method: "GET",
    host: "127.0.0.1",
    port: "8000",
    path: "/",
    body: {
      name: "shawn",
    },
    headers: {
      uuid: "id123",
      "Content-Type": "application/json",
    },
  });
  let result = await req.send();
  console.log(result);
})();

// const client = net.createConnection(
//     {
//         port: '8000',
//         host: '127.0.0.1',
//     },
//     () => {
//         console.log('conneted');
//         client.write('GET / HTTP/1.1\r\n');
//         client.write('Host: 127.0.0.1\r\n');
//         client.write('Content-Type: application/json\r\n');
//         client.write('Body: {name: "shawn"}\r\n');
//         client.write('Content-Length: 14\r\n');
//         client.write('\r\n');

//         client.write(req.toString())
//     }
// );

// client.on('data', (data) => {
//     console.log(data.toString())
// });

// client.on('end', () => {
//     console.log('disconnected');
// });
