---
title: FFI (Foreign Function Interface)
description: Load and call native libraries from Luau with no limitations
---

FFI allows you to load native libraries (.dll, .so, .dylib) and call functions with **any signature** using the powerful libffi backend.

> **Warning:** FFI is inherently unsafe. Incorrect usage can crash the runtime. Only use with trusted native libraries.

## Quick Start

```lua
local ffi = require("@lune/ffi")

-- Load a native library
local lib = ffi.open("mylib.dll")  -- Windows
-- local lib = ffi.open("./libmylib.so")  -- Linux
-- local lib = ffi.open("./libmylib.dylib")  -- macOS
```

## Calling Functions (Dynamic API)

The most powerful feature is `lib:call()` which supports **any function signature**:

```lua
-- lib:call(functionName, returnType, argTypes, ...)
local result = lib:call("add", "i32", {"i32", "i32"}, 10, 20)
print(result)  --> 30

-- Void function
lib:call("initialize", "void", {})

-- String return
local name = lib:call("get_name", "string", {})

-- Pointer operations
local ptr = lib:call("malloc", "pointer", {"u64"}, 1024)
lib:call("free", "void", {"pointer"}, ptr)
```

## Supported Types

| Type | Description | Lua Equivalent |
|------|-------------|----------------|
| `void` | No return value | `nil` |
| `bool` | Boolean | `boolean` |
| `i8`, `u8` | 8-bit integers | `number` |
| `i16`, `u16` | 16-bit integers | `number` |
| `i32`, `u32` | 32-bit integers (int) | `number` |
| `i64`, `u64` | 64-bit integers (long) | `number` |
| `f32` | 32-bit float | `number` |
| `f64` | 64-bit double | `number` |
| `pointer` | Raw pointer | `lightuserdata` or `nil` |
| `string` | C string (char*) | `string` or `nil` |

**Type aliases:** `int`=`i32`, `uint`=`u32`, `long`=`i64`, `float`=`f32`, `double`=`f64`, `char`=`i8`, `size_t`=`u64`

## Memory Buffers

Allocate and manipulate raw memory for struct handling:

```lua
-- Create a 64-byte buffer
local buf = ffi.buffer(64)

-- Write values
buf:write(0, "i32", 42)       -- Write int at offset 0
buf:write(4, "f64", 3.14)     -- Write double at offset 4
buf:writeString(12, "Hello")  -- Write string at offset 12

-- Read values
local num = buf:read(0, "i32")
local pi = buf:read(4, "f64")
local str = buf:readString(12)

-- Get pointer for passing to C functions
local ptr = buf.ptr
lib:call("process_data", "void", {"pointer"}, ptr)

-- Zero the buffer
buf:zero()
```

## Convenience Methods

For simple cases, use these shortcuts:

```lua
-- No arguments, returns i32
local version = lib:callInt("get_version")

-- One i32 argument, returns i32
local doubled = lib:callIntArg("double", 21)

-- No arguments, returns f64
local pi = lib:callDouble("get_pi")

-- No arguments, returns string
local name = lib:callString("get_name")

-- No arguments, no return
lib:callVoid("initialize")
```

## Working with Pointers

```lua
-- Get raw symbol address
local funcPtr = lib:getSymbol("my_function")

-- Check for null
if ffi.isNull(ptr) then
    print("Pointer is null")
end

-- ffi.null is a null pointer constant
local nullPtr = ffi.null

-- Read string from pointer
local str = ffi.string(ptr)
local strWithLen = ffi.string(ptr, 10)  -- Read exactly 10 bytes

-- Cast pointer to value
local value = ffi.cast(ptr, "i32")
```

## Type Utilities

```lua
-- Get size of type
local size = ffi.sizeof("i32")  --> 4
local ptrSize = ffi.sizeof("pointer")  --> 8

-- Type constants
local t = ffi.types
print(t.int)     --> "i32"
print(t.double)  --> "f64"
```

## Complete Example

### C Code (mathlib.c)

```c
#ifdef _WIN32
#define EXPORT __declspec(dllexport)
#else
#define EXPORT
#endif

EXPORT int add(int a, int b) {
    return a + b;
}

EXPORT double calculate(double x, double y, int op) {
    switch(op) {
        case 0: return x + y;
        case 1: return x - y;
        case 2: return x * y;
        case 3: return x / y;
        default: return 0;
    }
}

EXPORT void process_buffer(int* data, int size) {
    for (int i = 0; i < size; i++) {
        data[i] *= 2;
    }
}
```

### Luau Code

```lua
local ffi = require("@lune/ffi")

local lib = ffi.open("mathlib.dll")

-- Call with multiple arguments
local sum = lib:call("add", "i32", {"i32", "i32"}, 10, 20)
print("10 + 20 =", sum)  --> 30

-- Mixed types
local result = lib:call("calculate", "f64", {"f64", "f64", "i32"}, 10.5, 2.5, 2)
print("10.5 * 2.5 =", result)  --> 26.25

-- Pass buffer to C
local buf = ffi.buffer(16)  -- 4 ints
buf:write(0, "i32", 1)
buf:write(4, "i32", 2)
buf:write(8, "i32", 3)
buf:write(12, "i32", 4)

lib:call("process_buffer", "void", {"pointer", "i32"}, buf.ptr, 4)

-- Read back doubled values
for i = 0, 3 do
    print(buf:read(i * 4, "i32"))  --> 2, 4, 6, 8
end

lib:close()
```

## API Reference

### ffi

| Function | Description |
|----------|-------------|
| `ffi.open(path)` | Load a native library |
| `ffi.buffer(size)` | Allocate a memory buffer |
| `ffi.string(ptr, len?)` | Read string from pointer |
| `ffi.cast(ptr, type)` | Read value from pointer |
| `ffi.sizeof(type)` | Get size of type in bytes |
| `ffi.alignof(type)` | Get alignment of type |
| `ffi.isNull(ptr)` | Check if pointer is null |
| `ffi.null` | Null pointer constant |
| `ffi.types` | Type constants table |

### NativeLibrary

| Method | Description |
|--------|-------------|
| `lib:call(name, retType, argTypes, ...)` | Call any function |
| `lib:callInt(name)` | Call function returning i32 |
| `lib:callIntArg(name, arg)` | Call with i32 arg, returns i32 |
| `lib:callDouble(name)` | Call function returning f64 |
| `lib:callString(name)` | Call function returning string |
| `lib:callVoid(name)` | Call void function |
| `lib:getSymbol(name)` | Get raw symbol pointer |
| `lib:hasSymbol(name)` | Check if symbol exists |
| `lib:close()` | Unload library |
| `lib.path` | Library path (readonly) |

### Buffer

| Property/Method | Description |
|----------------|-------------|
| `buf.size` | Buffer size in bytes |
| `buf.ptr` | Raw pointer to buffer |
| `buf:read(offset, type)` | Read typed value |
| `buf:write(offset, type, value)` | Write typed value |
| `buf:readBytes(offset, len)` | Read raw bytes |
| `buf:writeBytes(offset, bytes)` | Write raw bytes |
| `buf:readString(offset?)` | Read null-terminated string |
| `buf:writeString(offset, str)` | Write string with null terminator |
| `buf:zero()` | Fill buffer with zeros |
| `buf:slice(offset, size)` | Get sub-buffer view |
