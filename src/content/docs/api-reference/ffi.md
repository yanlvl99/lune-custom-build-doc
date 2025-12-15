---
title: FFI
---

Foreign Function Interface for loading native libraries and zero-copy memory access.

## Quick Start

```lua
local ffi = require("@lune/ffi")

-- Create memory arena (auto-cleanup)
local arena = ffi.arena()
local ptr = arena:alloc(1024)

-- Cast to typed pointer for array access
local ints = ffi.cast(ptr, "i32")
ints[0] = 42
print(ints[0]) -- 42

-- Load native library
local lib = ffi.load("kernel32.dll")
local pid = lib:call("GetCurrentProcessId", "u32", {})
print("PID:", pid)
```

---

## Memory Access

### arena

Creates a scoped memory arena. All allocations are freed when GC'd.

```lua
local arena = ffi.arena()
local ptr = arena:alloc(256)
```

### read

Reads a primitive from memory.

```lua
local value = ffi.read(ptr, offset, ctype)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| ptr | RawPointer \| TypedPointer \| Buffer | Memory pointer |
| offset | number | Byte offset |
| ctype | CType | Type to read |

### write

Writes a primitive to memory.

```lua
ffi.write(ptr, offset, ctype, value)
```

### copy

Copies memory (SIMD-optimized memcpy).

```lua
ffi.copy(dst, src, len)
```

> [!TIP]
> Use `ffi.copy` instead of manual loops for large data transfers.

### fill

Fills memory with a byte value (SIMD-optimized memset).

```lua
ffi.fill(ptr, 1024, 0)
```

---

## Pointer System

### RawPointer (void*)

Byte-level arithmetic. Created by `arena:alloc()`.

- `ptr + n` → advances by n bytes
- No indexing - must cast first

**Properties:**
- `addr` - Raw address as number
- `isNull` - Whether pointer is null
- `isManaged` - Whether bounds-checked

**Methods:**
- `read(offset, ctype)` → any
- `write(offset, ctype, value)`
- `offset(bytes)` → RawPointer
- `toLightUserData()` → any

### TypedPointer (T*)

Stride-based arithmetic with array indexing. Created by `ffi.cast()`.

- `ptr + n` → advances by n * sizeof(T) bytes
- `ptr[i]` → reads/writes at index

```lua
local raw = arena:alloc(100)
local ints = ffi.cast(raw, "i32")
ints[0] = 42
ints[1] = 100
print(ints[0], ints[1])  -- 42, 100
```

**Properties:**
- `addr` - Raw address
- `stride` - Bytes per element
- `isNull` - Whether null
- `count` - Element count (if known)

**Methods:**
- `get(index)` → T
- `set(index, value)`
- `toRaw()` → RawPointer

---

## Struct System

### struct

Defines a C-ABI struct layout.

```lua
local Player = ffi.struct({
    { "x", "f32" },
    { "y", "f32" },
    { "health", "i32" },
    { "name", "u8", 32 },  -- Fixed array
})

print(Player.size)            -- 44
print(Player:offsetOf("health"))  -- 8
```

**StructDefinition Properties:**
- `size` - Total size in bytes
- `alignment` - Struct alignment
- `fieldCount` - Number of fields

**Methods:**
- `offsetOf(name)` → number
- `sizeOf(name)` → number
- `fields()` → { string }

### view

Creates a StructView for field access.

```lua
local ptr = arena:alloc(Player.size)
local player = ffi.view(ptr, Player)

player.x = 10.5
player.health = 100
print(player.health)  -- 100
```

---

## Memory Arenas

Scoped allocator with automatic cleanup.

```lua
local arena = ffi.arena()
local p1 = arena:alloc(1024)
local p2 = arena:allocArray("f32", 100)

print(arena.totalAllocated)
arena:reset()  -- Free all
```

> [!WARNING]
> Arenas are NOT thread-safe. Do not share between Luau Actors.

**Properties:**
- `id` - Unique identifier
- `totalAllocated` - Total bytes
- `allocationCount` - Number of allocations

**Methods:**
- `alloc(size)` → RawPointer
- `allocAligned(size, align)` → RawPointer
- `allocType(ctype)` → RawPointer
- `allocArray(ctype, count)` → RawPointer
- `reset()`

---

## Library Loading

### load

Loads a native library (.dll, .so, .dylib).

```lua
local lib = ffi.load("kernel32.dll")
```

### open

> [!CAUTION]
> **Deprecated**: Use `ffi.load()` instead.

Legacy alias for `ffi.load`.

### Library Methods

- `hasSymbol(name)` → boolean
- `getSymbol(name)` → RawPointer?
- `listExports()` → { ExportInfo }
- `call(name, ret, args, ...)` → any
- `close()`

> [!NOTE]
> `lib:call()` is the legacy API. Future versions will support lazy symbol resolution.

---

## Pointer Operations

### ptr

Creates a RawPointer from numeric address.

```lua
local ptr = ffi.ptr(0x12345678)
```

### cast

Casts to typed pointer or struct view.

```lua
local ints = ffi.cast(raw, "i32")
local player = ffi.cast(raw, PlayerDef)
```

### isNull

Checks if pointer is null.

```lua
if ffi.isNull(ptr) then
    print("null pointer")
end
```

---

## Type Reference

| Type | Size | Aliases |
|------|------|---------|
| void | 0 | - |
| bool | 1 | - |
| i8 | 1 | char, int8 |
| u8 | 1 | uchar, byte |
| i16 | 2 | short, int16 |
| u16 | 2 | ushort, uint16 |
| i32 | 4 | int, int32 |
| u32 | 4 | uint, uint32 |
| i64 | 8 | long, int64 |
| u64 | 8 | ulong, uint64 |
| isize | Platform | ssize_t, ptrdiff_t |
| usize | Platform | size_t |
| f32 | 4 | float |
| f64 | 8 | double |
| pointer | Platform | ptr, void* |
| string | Platform | cstring, char* |

### sizeof / alignof

```lua
ffi.sizeof("i32")   -- 4
ffi.alignof("f64")  -- 8
```

---

## Callbacks

Create Lua functions callable from C.

```lua
local callback = ffi.callback(function(a, b)
    return a + b
end, "i32", {"i32", "i32"})

print(callback.ptr)  -- Function pointer
```

**Properties:**
- `ptr` - C function pointer
- `retType` - Return type
- `argCount` - Argument count
- `isValid` - Whether valid

---

## Buffer (Legacy)

> [!NOTE]
> Prefer `ffi.arena()` for new code.

```lua
local buf = ffi.buffer(1024)
buf:write(0, "i32", 42)
print(buf:read(0, "i32"))  -- 42
```

**Methods:**
- `read(offset, ctype)` / `write(offset, ctype, value)`
- `zero()` - Fill with zeros
- `readBytes(offset, len)` / `writeBytes(offset, bytes)`
- `readString(offset?)` / `writeString(offset, s)`
- `slice(offset, size)` → Buffer
