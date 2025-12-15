---
title: Foreign Function Interface
description: Load and call native libraries with zero-copy memory access
---

The FFI module provides **zero-copy memory access** and native library loading for high-performance interop with C/C++ libraries.

Unlike traditional FFIs that copy data back and forth, Lune's FFI gives you direct, typed access to memory using efficient pointers and struct views.

> **Warning:** FFI is inherently unsafe. Writing to the wrong memory address can crash the runtime. Always ensure your pointers and offsets are correct.

## The Zero-Copy Workflow

Modern FFI usage in Lune revolves around three core concepts:

1. **Arenas**: Scoped memory allocators that handle cleanup for you.
2. **Pointers**: Two-tiered system (`RawPointer` for byte access, `TypedPointer` for array access).
3. **Structs**: C-ABI compliant schemas that map Lua fields to memory offsets.

### Quick Start

```lua
local ffi = require("@lune/ffi")

-- 1. Create a memory arena (freed when garbage collected)
local arena = ffi.arena()

-- 2. Allocate memory (returns RawPointer)
local raw = arena:alloc(1024)

-- 3. Cast to typed pointer for array access
local floats = ffi.cast(raw, "f32")

-- 4. Direct Zero-Copy Access
floats[0] = 10.5
floats[1] = 20.25

print(floats[0]) --> 10.5
```

## Memory Management (Arenas)

Manual memory management (malloc/free) is error-prone. Lune uses **Arenas** to group allocations together.

```lua
local arena = ffi.arena()

-- All these allocations belong to 'arena'
local p1 = arena:alloc(64)
local p2 = arena:allocArray("i32", 100)

-- When 'arena' goes out of scope and is collected,
-- ALL memory is freed automatically. No manual free() needed.
```

## Pointer System

Lune provides two distinct pointer types to prevent common arithmetic errors.

### RawPointer (void*)
Used for generic memory and byte-level manipulation.
- **Arithmetic**: `ptr + 1` advances by **1 byte**.
- **No Indexing**: You cannot do `ptr[0]`.

### TypedPointer (T*)
Used for accessing data arrays.
- **Arithmetic**: `ptr + 1` advances by **sizeof(T)**.
- **Indexing**: `ptr[0]` reads the first element.

```lua
local raw = arena:alloc(100)

-- Cast void* -> i32*
local ints = ffi.cast(raw, "i32")

ints[0] = 123     -- Writes at offset 0
ints[1] = 456     -- Writes at offset 4 (sizeof i32)
```

## Struct Mapping

Instead of manually calculating byte offsets (e.g., `ptr + 12`), define a Struct schema. Lune calculates standard C layout rules (padding, alignment) for you.

```lua
-- Define layout
local Player = ffi.struct({
    -- { name, type, arraySize? }
    { "x", "f32" },
    { "y", "f32" },
    { "health", "i32" },
    { "name", "u8", 32 },  -- Fixed array [u8; 32]
})

-- Allocate and View
local raw = arena:alloc(Player.size)
local player = ffi.view(raw, Player)

-- Field Access (Read/Write)
player.x = 100.5
player.health = 50

print(player.x, player.health)
```

## Loading Libraries

Use `ffi.load` to open native libraries (`.dll`, `.so`, `.dylib`).

```lua
local lib = ffi.load("kernel32.dll")
```

### Calling Functions

The primary method for calling C functions is `lib:call`. You must provide the function name, return type, and a list of argument types.

```lua
-- DWORD GetCurrentProcessId(void)
local pid = lib:call("GetCurrentProcessId", "u32", {})

print("Process ID:", pid)
```

### Optimized Calls

For better performance, use the optimized methods for specific return types:

| Method | Return Type | Description |
|--------|-------------|-------------|
| `lib:callInt` | `i32` | Fast path for integers |
| `lib:callDouble` | `f64` | Fast path for doubles |
| `lib:callVoid` | `void` | No return value |
| `lib:callString` | `string` | Returns C string |

```lua
-- double sqrt(double)
local val = lib:call("sqrt", "f64", {"f64"}, 16.0)

-- Optimized equivalents
local val = msvcrt:callDouble("sqrt", {"f64"}, 16.0) -- WIP pseudo-example
```

> **Note:** The specialized methods like `callInt` often take fewer arguments or have specialized signatures. Check the API reference.

### Callbacks

You can create Lua functions that C code can call ("function pointers").

```lua
-- 1. Define the callback
-- int comparator(int a, int b)
local cb = ffi.callback(function(a, b)
    print("Called from C:", a, b)
    return a - b
end, "i32", {"i32", "i32"})

-- 2. Pass to C function
-- void qsort(void* base, size_t num, size_t size, int (*compar)(int,int))
msvcrt:call("qsort", "void", {"pointer", "usize", "usize", "pointer"},
    arrayPtr, count, 4, cb.ptr)
```

## Type System

The `ffi.types` table contains constants for all supported C types.

| Type | Size | Aliases |
|------|------|---------|
| `i8`, `u8` | 1 byte | `char`, `byte` |
| `i16`, `u16` | 2 bytes | `short`, `ushort` |
| `i32`, `u32` | 4 bytes | `int`, `uint` |
| `i64`, `u64` | 8 bytes | `long`, `ulong` |
| `f32` | 4 bytes | `float` |
| `f64` | 8 bytes | `double` |
| `pointer` | 4/8 bytes | `void*` |
| `string` | 4/8 bytes | `char*` |

You can check sizes dynamically:

```lua
print(ffi.sizeof("i32"))  --> 4
print(ffi.alignof("f64")) --> 8
```

## Bulk Operations

For high-performance memory manipulation, use the SIMD-optimized bulk operations instead of loops.

```lua
-- Fill memory with 0x00 (memset)
ffi.fill(ptr, 1024, 0)

-- Copy raw memory (memcpy)
ffi.copy(dst, src, 512)
```

## Migration Guide

If you used the legacy API, here is how to upgrade:

| Legacy | Modern | Why? |
|--------|--------|------|
| `ffi.buffer(size)` | `arena:alloc(size)` | Arenas prevent memory leaks. |
| `buf:write(off, val)` | `ffi.write(ptr, off, val)` | Direct access is faster. |
| Automatic arithmetic | `ffi.cast(ptr, "type")` | Explicit casting is safer. |
| `ffi.open()` | `ffi.load()` | Consistent naming convention. |
