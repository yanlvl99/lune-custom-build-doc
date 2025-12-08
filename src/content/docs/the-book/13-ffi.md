---
title: FFI (Foreign Function Interface)
description: Load and call native libraries from Luau
---

FFI allows you to load native libraries (.dll, .so, .dylib) and call functions from them.

> **Warning:** FFI is inherently unsafe. Incorrect usage can crash the runtime. Only use with trusted native libraries.

## Basic Usage

```lua
local ffi = require("@lune/ffi")

-- Load a native library
local lib = ffi.open("mylib.dll")  -- Windows
-- local lib = ffi.open("./libmylib.so")  -- Linux
-- local lib = ffi.open("./libmylib.dylib")  -- macOS
```

## Calling Functions

### Functions returning integers

```lua
-- Function with no arguments returning int
local result = lib:callInt("get_version")
print("Version:", result)

-- Function with int argument returning int
local doubled = lib:callIntArg("double", 21)
print("Doubled:", doubled)  --> 42
```

### Functions returning doubles

```lua
local pi = lib:callDouble("get_pi")
print("PI:", pi)  --> 3.14159...
```

### Functions returning strings

```lua
local name = lib:callString("get_name")
print("Name:", name)
```

### Void functions

```lua
lib:callVoid("initialize")
```

## Checking for Symbols

```lua
if lib:hasSymbol("my_function") then
    lib:callVoid("my_function")
else
    print("Function not found")
end
```

## Closing the Library

```lua
lib:close()
```

## Example: Using a C Library

### C Code (mymath.c)

```c
#ifdef _WIN32
#define EXPORT __declspec(dllexport)
#else
#define EXPORT
#endif

EXPORT int add(int a) {
    return a + a;
}

EXPORT double get_pi() {
    return 3.14159265358979;
}

EXPORT const char* get_greeting() {
    return "Hello from C!";
}
```

### Compile

```bash
# Windows (MSVC)
cl /LD mymath.c /Fe:mymath.dll

# Linux
gcc -shared -fPIC -o libmymath.so mymath.c

# macOS
gcc -shared -fPIC -o libmymath.dylib mymath.c
```

### Luau Code

```lua
local ffi = require("@lune/ffi")

local lib = ffi.open("mymath.dll")

local doubled = lib:callIntArg("add", 21)
print("21 + 21 =", doubled)  --> 42

local pi = lib:callDouble("get_pi")
print("PI =", pi)

local greeting = lib:callString("get_greeting")
print(greeting)  --> Hello from C!

lib:close()
```

## Limitations

Current FFI implementation supports:
- Functions with 0 or 1 integer argument
- Return types: int, double, string (char*), void

For more complex function signatures, consider wrapping your C functions with simpler interfaces.
