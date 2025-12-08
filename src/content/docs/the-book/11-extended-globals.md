---
title: Extended Globals
description: Additional global functions in Lune Custom Build
---

# Extended Globals

Lune Custom Build extends the standard Luau globals with additional utility functions.

## Math Extensions

### math.clamp

Clamps a value between a minimum and maximum:

```lua
math.clamp(5, 0, 10)   --> 5
math.clamp(-5, 0, 10)  --> 0
math.clamp(15, 0, 10)  --> 10
```

### math.lerp

Linear interpolation between two values:

```lua
math.lerp(0, 100, 0.5)  --> 50
math.lerp(0, 100, 0.25) --> 25
math.lerp(10, 20, 0.5)  --> 15
```

### math.inverseLerp

Returns the interpolation factor for a value between min and max:

```lua
math.inverseLerp(0, 100, 50)  --> 0.5
math.inverseLerp(0, 100, 25)  --> 0.25
```

### math.map

Maps a value from one range to another:

```lua
math.map(5, 0, 10, 0, 100)  --> 50
math.map(0.5, 0, 1, 0, 255) --> 127.5
```

### math.sign

Returns the sign of a number (-1, 0, or 1):

```lua
math.sign(5)   --> 1
math.sign(-5)  --> -1
math.sign(0)   --> 0
```

### math.roundTo

Rounds a number to a specified number of decimal places:

```lua
math.roundTo(3.14159, 2)  --> 3.14
math.roundTo(3.14159, 0)  --> 3
math.roundTo(123.456, 1)  --> 123.5
```

### math.tau

The constant τ (tau) = 2π:

```lua
print(math.tau)  --> 6.283185307179586
```

## Colored Warn

The `warn` function outputs colored text to stderr:

```lua
warn("Something unexpected happened")
-- Prints in yellow: [WARN] Something unexpected happened
```

## UUID Generation

### uuid.v4

Generates a random UUID (version 4):

```lua
local id = uuid.v4()
print(id)  --> "550e8400-e29b-41d4-a716-446655440000"
```

### uuid.v7

Generates a time-ordered UUID (version 7):

```lua
local id = uuid.v7()
print(id)  --> "018d5f3c-a8e7-7000-8000-000000000000"
```

> **Tip:** Use `uuid.v7()` when you need IDs that sort chronologically, such as for database primary keys.
