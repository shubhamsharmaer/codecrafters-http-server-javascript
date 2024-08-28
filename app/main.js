const net = require("net");
const fs = require("fs");
const path = require("path");
const { Socket } = require("dgram");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  // socket.write("HTTP/1.1 200 OK\r\n\r\n");
  socket.on("data", (data) => {
    // convert data to string
    const request = data.toString();
    console.log("Recieved request: \n", request);

    // extract the URL path from the request
    const url = request.split(" ")[1]; // accessing the {str} directly
    const headers = request.split("\r\n");

    //filepath
    let filepath = '';

    // send the response
    if(url === "/"){
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    }
    else if(url.includes('/echo/')){
      // -> sending a response with status code 200 socket.write("HTTP/1.1 200 \r\n\r\n");
      const content = url.split('/echo/')[1]; // take string after /echo/ -> {str}
          // creating -> response
          const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`;
          socket.write(response);
    }
    else if(url === '/user-agent'){
      const userAgent = headers[2].split("User-Agent: ")[1];
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`); 
    }
    else if(url.includes('/files/')){
      const filname = url.split('/files/')[1];
      filepath = path.join(__dirname, filname);

      // check if file exists
      fs.stat(filepath, (err, stat) => {
        if(err || !stat.isFile()){
          socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        }
        else{
          // File exist
          //read File
          fs.readFile(filepath, (err, fileData) => {
            if(err){
              socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
            }
            else{
              socket.write("HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${fileData.length}");
              socket.write(fileData);
            }
          })
        }
      });

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
