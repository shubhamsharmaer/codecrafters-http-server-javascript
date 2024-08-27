const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  // socket.write("HTTP/1.1 200 OK\r\n\r\n");
  socket.on("data", (data) => {
    // convert data to string
    const request = data.toString();
    console.log("Recieved request: ", request);

    // extract the URL path from the request
    const requestLine = request.split("\r\n")[0];
    const [method, path, version] = requestLine.split(" ");

    // send the response
    if(path === "/"){
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
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
