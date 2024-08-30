const net = require("net");
const fs = require("fs");
const zlib = require("zlib");

console.log("Logs from your program will appear here!");

const parseRequest = (requestData) => {
  const request = requestData.toString().split("\r\n");
  const [method, path, protocol] = request[0].split(" ");

  const headers = {};
  request.slice(1).forEach((header) => {
    const [key, ...valueParts] = header.split(": ");
    if (key && valueParts.length > 0) {
      headers[key.trim()] = valueParts.join(": ").trim();
    }
  });
  return { method, path, protocol, headers };
}

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = parseRequest(data);
    const { method, path, protocol, headers } = request;

    console.log("Received request: \n", request);

    if (path === "/") {
      const response = "Welcome to the server!";
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${response.length}\r\n\r\n${response}`);
      socket.end();
    } 
    else if (path.includes('/echo/')) {
      const content = path.split('/echo/')[1];
      if (headers["Accept-Encoding"] && headers["Accept-Encoding"].includes("gzip")) {
        zlib.gzip(content, (err, result) => {
          if (err) {
            socket.write(`HTTP/1.1 500 Internal Server Error\r\n\r\n`);
            socket.end();
            return;
          } else {
            const contentlen = result.length;
            const response = `HTTP/1.1 200 OK\r\nContent-Encoding: gzip\r\nContent-Type: text/plain\r\nContent-Length: ${contentlen}\r\n\r\n`;
            socket.write(response);
            socket.write(result);
            socket.end();
          }
        });
      } else {
        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`);
        socket.end();
      }
    } 
    else if (path.startsWith('/files/') && method === "GET") {
      const filename = path.split('/files/')[1];
      const directory = process.argv[3];

      if (fs.existsSync(`${directory}/${filename}`)) {
        const content = fs.readFileSync(`${directory}/${filename}`).toString();
        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`);
      } else {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      }
      socket.end();
    } 
    else if (path.startsWith('/files/') && method === "POST") {
      const filename = process.argv[3] + "/" + path.substring(7);
      const req = data.toString().split("\r\n");
      const body = req[req.length - 1];
      fs.writeFileSync(filename, body);
      socket.write(`HTTP/1.1 201 Created\r\n\r\n`);
      socket.end();
    } 
    else if (path.startsWith("/user-agent")) {
      const userAgent = headers["User-Agent"];
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}\r\n`);
      socket.end();
    }     
    else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      socket.end();
    }
  });

  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");
