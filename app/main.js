const net = require("net");
const fs = require("fs");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
const parseRequest = (requestData) =>{
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
  // socket.write("HTTP/1.1 200 OK\r\n\r\n");
  socket.on("data", (data) => {
    // convert data to string
    const request = parseRequest(data);
    const {method, path, protocol, headers} = request;

    console.log("Recieved request: \n", request);

    // send the response
    if(path === "/"){
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    }
    else if(path.includes('/echo/')){
      // -> sending a response with status code 200 socket.write("HTTP/1.1 200 \r\n\r\n");
      const content = path.split('/echo/')[1]; // take string after /echo/ -> {str}
      // creating -> response
      if(headers["Accept-Encoding"] && headers["Accept-Encoding"].includes("gzip")){
        socket.write(`HTTP/1.1 200 OK\r\n\Content-Type: text/plain\r\nContent-Encoding: gzip\r\n\r\n${content}`);
      }
      else{
        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`);
      }
      // const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`;
      // socket.write(response);
    }
    else if(path.startsWith('/files/') && method === "GET"){
      const filename = path.split('/files/')[1];
      const directory = process.argv[3];

      if(fs.existsSync(`${directory}/${filename}`)){
        const content = fs.readFileSync(`${directory}/${filename}`).toString();
        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`);
      }
      else{
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      }
    }
    else if(path.startsWith('/files/') && method === "POST"){
      // take filename
      const filename = process.argv[3] + "/" + path.substring(7)
      const req = data.toString().split("\r\n");
      const body = req[req.length - 1];
      fs.writeFileSync(filename, body);
      socket.write(`HTTP/1.1 201 Created\r\n\r\n`); 
    }
    else if(path.startsWith("/user-agent")){
      const userAgent = request.headers["User-Agent"];
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`); 
    }
    else{
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
    socket.end();
  });
  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");
