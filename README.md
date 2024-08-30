[![progress-banner](https://backend.codecrafters.io/progress/http-server/e71579d5-a376-417d-92c5-151316f9b670)](https://app.codecrafters.io/users/codecrafters-bot?r=2qF)

This is a starting point for JavaScript solutions to the
["Build Your Own HTTP server" Challenge](https://app.codecrafters.io/courses/http-server/overview).

[HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) is the
protocol that powers the web. In this challenge, you'll build a HTTP/1.1 server
that is capable of serving multiple clients.

Along the way you'll learn about TCP servers,
[HTTP request syntax](https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html),
and more.

**Note**: If you're viewing this repo on GitHub, head over to
[codecrafters.io](https://codecrafters.io) to try the challenge.

## ✨ Features

- Handles **GET**, **POST**, requests.
- Supports multiple endpoints.
- Supports **JSON** and **plain text** response formats.
- Includes basic error handling and logging.

## ⚙️ Installation

1. Clone the repository using Git:
    ```bash
    git clone https://github.com/shubhamsharmaer/codecrafters-http-server-javascript.git
    ```

2. Navigate to the project directory:
    ```bash
    cd codecrafters-http-server-javascript
    ```

3. Install the dependencies using npm:
    ```bash
    npm install
    ```

## 🚀 Start the Server

   ```bash
      ./your_program.sh
   ```
   Alternatively, you can use Nodejs as well
   ```bash
      node app/main.js
   ``` 

## How to Send Requests?

- **Using `curl`**:
  Open powershell and type:
    ```bash
    wsl
    ./your_program.sh
    curl http://localhost:4221/
    ```
  This will send a GET request to the root endpoint and return a welcome message.

- **Using a `Web Browser`**:
   Open a web browser and navigate to `http://localhost:4221/`. This will send a GET request to the root endpoint and return a welcome message.

   **If you don't have curl or wsl, install them:**

   For `wsl`:
   ```sh
   wsl --install
   ```

   For `curl`: [How to install curl](https://ultahost.com/knowledge-base/install-curl-on-windows/#:~:text=Installing%20the%20Curl%20command%20on%20Windows,-Following%20are%20the&text=Download%20the%20Curl%20executable%20file,example%20C%3A%5CCurl%20location)


## 📋 Available Endpoints

The server provides the following endpoints:

- **`/`**: Returns a welcome message.
- **`/echo`**: Echoes back the request body. If the `Accept-Encoding` header includes `gzip`, the response will be gzipped.
- **`/files/:filename`**:
  - **GET**: Returns the file content from the server’s directory. Requires the directory to be specified as a command-line argument.
  - **POST**: Saves the request body as a file in the server’s directory. Requires the directory to be specified as a command-line argument.
- **`/user-agent`**: Returns the `User-Agent` header from the request.

## 🧪 Testing Server

Here are some possible requests you can try:
Use **Powershell**, **wsl**, **curl** if you don't have any of this, please check above info for further process.

### 🔍 GET Requests

1. **Respond with 200 OK**:
    ```bash
    curl http://localhost:4221/
    ```
   Expected response:
   ```bash
   StatusCode        : 200
   StatusDescription : OK
   Content           : Welcome to the server!
   RawContent        : HTTP/1.1 200 OK
                    Content-Length: 22
                    Content-Type: text/plain
   ```

2. **Extract URL Path**: You will then send two HTTP requests to your server.

   First, You will send a GET request, with a random string as the path:
    ```bash
     curl -v http://localhost:4221/abcdefg
    ```

    Your server must respond to this request with a 404 response:
    ```bash
     HTTP/1.1 404 Not Found
    ```

   Then, You will send a GET request, with the path /:
    ```bash
     HTTP/1.1 200 OK
    ``` 

4. **Respond with body**: You will then send a GET request to the /echo/{str} endpoint on your server, with some random string.

   Request:
    ```bash
    curl -v http://localhost:4221/echo/abc
    ```

   Expected response:
   ```bash
    HTTP/1.1 404 Not Found
    ```

5. **User-Agent endpoint**:

   Request:
    ```bash
    curl http://localhost:4221/user-agent
    ```

   Your server must respond with a 200 response that contains the following parts:
    - Content-Type header set to text/plain.
    - Content-Length header set to the length of the given string.
    - Response body set to the given string.
   
   Expected response:
   ```bash
   < HTTP/1.1 200 OK
   < Content-Type: text/plain
   < Content-Length: 3
   < abc
   ```

   Here's a breakdown of the response:
   ```bash
   // Status line
   HTTP/1.1 200 OK
   \r\n                          // CRLF that marks the end of the status line

   // Headers
   Content-Type: text/plain\r\n  // Header that specifies the format of the response body
   Content-Length: 3\r\n         // Header that specifies the size of the response body, in bytes
   \r\n                          // CRLF that marks the end of the headers

   // Response body
   abc                           // The string from the request
   ```

6. **Read header**: The /user-agent endpoint, which reads the User-Agent request header and returns it in the response body. The User-Agent header describes the client's user agent.

   /user-agent endpoint must read the User-Agent header, and return it in your response body.
   
   Request:
   ```bash
   curl -v --header "User-Agent: foobar/1.2.3" http://localhost:4221/user-agent
   ```

   Here's a breakdown of the request:
   ```bash
   // Request line
   GET
   /user-agent
   HTTP/1.1
   \r\n

   // Headers
   Host: localhost:4221\r\n
   User-Agent: foobar/1.2.3\r\n  // Read this value   
   Accept: */*\r\n
   \r\n

   // Request body (empty)
   ```

   Your server must respond with a 200 response that contains the following parts:
   - Content-Type header set to text/plain.
   - Content-Length header set to the length of the User-Agent value.
   - Message body set to the User-Agent value.

   Expected Response:
   ```bash
   < HTTP/1.1 200 OK
   < Content-Type: text/plain
   < Content-Length: 12
   < foobar/1.2.3
   ```

8. **Return a file**: The /files/{filename} endpoint, which returns a requested file to the client.

   ### Tests
   You will execute your program with a --directory flag. The --directory flag specifies the directory where the files are stored, as an absolute path. 

   ```bash
   ./your_program.sh --directory /tmp/
   ```
   
   You will then send two GET requests to the /files/{filename} endpoint on your server.
   ### First request: The first request will ask for a file that exists in the files directory:

   ```bash
   $ echo -n 'Hello, World!' > /tmp/foo
   $ curl -i http://localhost:4221/files/foo
   ```

   Your server must respond with a 200 response that contains the following parts:
   - Content-Type header set to application/octet-stream.
   - Content-Length header set to the size of the file, in bytes.
   - Response body set to the file contents.

   Expected Respons:
   
   ```bash
   HTTP/1.1 200 OK
   Content-Type: application/octet-stream
   Content-Length: 13
   Hello, World!
   ```

   ### Second request: The second request will ask for a file that doesn't exist in the files directory:

   ```bash
   curl -i http://localhost:4221/files/non_existant_file
   ```
   
   Expected Respons:
   ```bash
   HTTP/1.1 404 Not Found
   ```

### 📝 POST Requests

1. **Read request body**: The /files/{filename} endpoint, which accepts text from the client and creates a new file with that text.
   Request body: A request body is used to send data from the client to the server.

   Here's an example of a POST /files/{filename} request:
    ```bash
    // Request line
   POST /files/number HTTP/1.1
   \r\n

   // Headers
   Host: localhost:4221\r\n
   User-Agent: curl/7.64.1\r\n
   Accept: */*\r\n
   Content-Type: application/octet-stream  // Header that specifies the format of the request body
   Content-Length: 5\r\n                   // Header that specifies the size of the request body, in bytes
   \r\n

   // Request Body
   12345
    ```

   ### Tests
   You will execute your program with a --directory flag. The --directory flag specifies the directory to create the file in, as an absolute path.

   ```bash
   ./your_program.sh --directory /tmp/
   ```

   You will then send a POST request to the /files/{filename} endpoint on your server, with the following parts:
   - Content-Type header set to application/octet-stream.
   - Content-Length header set to the size of the request body, in bytes.
   - Request body set to some random text.
  
   Request:
   ```bash
   curl -v --data "12345" -H "Content-Type: application/octet-stream" http://localhost:4221/files/file_123.txt
   ```

   Expected Response:
   ```bash
   HTTP/1.1 201 Created
   ```

2. **Gzip compression**:

   ### Tests: You will execute your program like this:
   ```bash
   ./your_program.sh
   ```

   Then, you will send a GET request to the /echo/{str} endpoint on your server. The request will contain an Accept-Encoding header that includes gzip. 
   ```bash
   curl -v -H "Accept-Encoding: gzip" http://localhost:4221/echo/abc | hexdump -C
   ```

   Your server's response must contain the following:
   - 200 response code.
   - Content-Type header set to text/plain.
   - Content-Encoding header set to gzip.
   - Content-Length header set to the size of the compressed body.
   - Response body set to the gzip-compressed str parameter.
   
   Expected Response:
   ```bash
   HTTP/1.1 200 OK
   Content-Encoding: gzip
   Content-Type: text/plain
   Content-Length: 23

   1F 8B 08 00 00 00 00 00  // Hexadecimal representation of the response body
   00 03 4B 4C 4A 06 00 C2
   41 24 35 03 00 00 00
   ```

### ⚠️ Error Handling

1. **Invalid endpoint**:
    ```bash
    curl http://localhost:4221/invalid
    ```
   Expected response: "404 Not Found"

2. **Invalid request method**:
    ```bash
    curl -X PATCH http://localhost:4221/files
    ```
   Expected response: "405 Method Not Allowed"

3. **Invalid request body**:
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{" invalid json"}' http://localhost:4221/files
    ```
   Expected response: "400 Bad Request"

## 🛠️ Troubleshooting

- Ensure that **Node.js** and **npm** are installed on your system.
- Verify that dependencies are correctly installed using `npm install`.
- Make sure the server is running using `./your_program.sh` or `node app/main.js`.
- Ensure the server directory for file operations is provided as a command-line argument.
- If issues arise, check the server logs for error messages.

## 🤝 Connect with Us

- [LinkedIn](https://www.linkedin.com/in/shubhamsharmaer)
- [Twitter](https://twitter.com/shubhamsharmaer)
