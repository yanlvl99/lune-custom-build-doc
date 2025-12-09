---
title: FFI
---

Foreign Function Interface (FFI) for loading and calling native libraries.

#### Example usage

```lua
local ffi = require("@lune/ffi")

-- Load a native library
local lib = ffi.open("C:\\Windows\\System32\\user32.dll")

-- List all exported functions
local exports = lib:listExports()
print("Found", #exports, "exports")

-- Call a function with specific types
local result = lib:call("GetSystemMetrics", "i32", {"i32"}, 0)
print("Screen width:", result)

-- Create a callback for C code to call
local callback = ffi.callback(function(a, b)
    return a + b
end, "i32", {"i32", "i32"})

print("Callback pointer:", callback.ptr)
```

## Functions

### open

Opens a native library (.dll, .so, .dylib) at the specified path.

#### Parameters

- `path` The path to the native library file

#### Returns

- A `NativeLibrary` handle

---

### buffer

Creates a new memory buffer of the specified size.

#### Parameters

- `size` The size of the buffer in bytes

#### Returns

- A `Buffer` object

---

### callback

Creates a callback function pointer from a Lua function.

#### Parameters

- `fn` The Lua function to wrap
- `retType` The C return type
- `argTypes` Array of C argument types

#### Returns

- A `FfiCallback` object with the function pointer

---

### sizeof

Returns the size in bytes of a C type.

#### Parameters

- `ctype` The C type name

#### Returns

- Size in bytes

---

### alignof

Returns the alignment of a C type.

#### Parameters

- `ctype` The C type name

#### Returns

- Alignment in bytes

---

### isNull

Checks if a pointer is null.

#### Parameters

- `ptr` The pointer to check

#### Returns

- `true` if the pointer is null

---

### cast

Casts a pointer to a specific C type.

#### Parameters

- `ptr` The pointer to cast
- `ctype` The target C type

#### Returns

- The casted value

---

## Types

### CType

C type identifiers used in FFI calls:

- `void` - No return value
- `bool` - Boolean
- `i8`, `u8` - 8-bit integers
- `i16`, `u16` - 16-bit integers
- `i32`, `u32` - 32-bit integers
- `i64`, `u64` - 64-bit integers
- `f32`, `f64` - Floating point
- `pointer` - Raw pointer
- `string` - C string

---

### NativeLibrary

A handle to a loaded native library.

#### Properties

- `path` - The path of the loaded library

#### Methods

- `getSymbol(name)` - Get a symbol pointer
- `hasSymbol(name)` - Check if symbol exists
- `listExports()` - List all exported functions
- `call(name, retType, argTypes, ...)` - Call a function
- `close()` - Close the library

---

### FfiCallback

A callback that can be passed to C functions.

#### Properties

- `ptr` - The C function pointer
- `retType` - The return type
- `argCount` - Number of arguments
- `isValid` - Whether the callback is valid

#### Methods

- `getPtr()` - Get the function pointer

---

### Buffer

A memory buffer for reading/writing native data.

#### Properties

- `size` - Buffer size in bytes
- `ptr` - Raw pointer to buffer

#### Methods

- `read(offset, ctype)` - Read a value
- `write(offset, ctype, value)` - Write a value
- `zero()` - Fill with zeros
- `readBytes(offset, len)` - Read bytes
- `writeBytes(offset, bytes)` - Write bytes
- `readString(offset?)` - Read a C string
- `writeString(offset, s)` - Write a string
- `slice(offset, size)` - Get a slice

---

### ExportInfo

Information about an exported function.

#### Properties

- `name` - The export name
- `ordinal` - The ordinal number (optional, Windows only)

---
