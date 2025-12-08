---
title: UDP & TCP Sockets
description: Low-level network programming with UDP and TCP
---

# UDP & TCP Sockets

Lune Custom Build provides low-level socket APIs for network programming.

## UDP Sockets

UDP (User Datagram Protocol) is connectionless and suitable for real-time applications.

### Binding a UDP Socket

```lua
local net = require("@lune/net")

local socket = net.udp.bind("0.0.0.0:8080")
print("Bound to:", socket.address)
```

### Sending Data

```lua
-- Send to specific address
socket:sendTo("Hello, World!", "192.168.1.100:9000")
```

### Receiving Data

```lua
local result = socket:recvFrom(1024) -- max 1024 bytes
print("Received:", result.data)
print("From:", result.address)
```

### Connected UDP

For repeated communication with the same peer:

```lua
socket:connect("192.168.1.100:9000")

socket:send("Hello")
local data = socket:recv(1024)
```

## TCP Server

TCP (Transmission Control Protocol) provides reliable, ordered communication.

### Creating a TCP Server

```lua
local net = require("@lune/net")

local server = net.tcp.listen("0.0.0.0:3000")
print("Server listening on port 3000")
```

### Accepting Connections

```lua
-- Accept a single connection
local conn = server:accept()
print("Client connected from:", conn.address)

local data = conn:read(1024)
conn:write("HTTP/1.1 200 OK\r\n\r\nHello!")
conn:close()
```

### Serve Loop

For handling multiple connections:

```lua
server:serve(function(conn)
    local request = conn:read(4096)
    
    -- Parse request and generate response
    local response = "HTTP/1.1 200 OK\r\n"
        .. "Content-Type: text/plain\r\n"
        .. "\r\n"
        .. "Hello from Lune!"
    
    conn:write(response)
    conn:close()
end)
```

## Example: Echo Server

```lua
local net = require("@lune/net")

local server = net.tcp.listen("0.0.0.0:7")

print("Echo server running on port 7")

server:serve(function(conn)
    while true do
        local data = conn:read(1024)
        if not data or #data == 0 then
            break
        end
        conn:write(data)
    end
    conn:close()
end)
```

## Example: UDP Game Server

```lua
local net = require("@lune/net")

local socket = net.udp.bind("0.0.0.0:27015")
print("Game server listening on UDP 27015")

while true do
    local result = socket:recvFrom(512)
    local packet = result.data
    local client = result.address
    
    -- Process packet and send response
    socket:sendTo("ACK", client)
end
```
