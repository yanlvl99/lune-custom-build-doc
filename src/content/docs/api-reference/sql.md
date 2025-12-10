---
title: SQL
---

The SQL library provides SQLite database access for persistent data storage.

## Types

### Database

A SQLite database connection handle.

## Functions

### `open`

Opens or creates a SQLite database file.

```luau
function sql.open(path: string): Database
```

**Example:**

```luau
local sql = require("@lune/sql")

local db = sql.open("myapp.db")
-- Use the database...
db:close()
```

## Database Methods

### `execute`

Executes a SQL statement without returning results. Use for INSERT, UPDATE, DELETE, CREATE, etc.

```luau
function Database:execute(query: string, ...any): ()
```

**Example:**

```luau
-- Create table
db:execute([[
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE
    )
]])

-- Insert with parameters
db:execute("INSERT INTO users (name, email) VALUES (?, ?)", "John", "john@example.com")
```

### `query`

Executes a SQL query and returns results as a table of rows.

```luau
function Database:query(query: string, ...any): { [number]: { [string]: any } }
```

**Example:**

```luau
local users = db:query("SELECT * FROM users WHERE name LIKE ?", "%John%")

for _, user in ipairs(users) do
    print(user.id, user.name, user.email)
end
```

### `close`

Closes the database connection.

```luau
function Database:close(): ()
```

## Complete Example

```luau
local sql = require("@lune/sql")

-- Open database
local db = sql.open("example.db")

-- Create table
db:execute([[
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
]])

-- Insert data
db:execute("INSERT INTO todos (title) VALUES (?)", "Learn Lune")
db:execute("INSERT INTO todos (title) VALUES (?)", "Build an app")

-- Query data
local todos = db:query("SELECT * FROM todos WHERE completed = ?", 0)

print("Pending todos:")
for _, todo in ipairs(todos) do
    print("  -", todo.title)
end

-- Update data
db:execute("UPDATE todos SET completed = 1 WHERE title = ?", "Learn Lune")

-- Close connection
db:close()
```

---

← [Stdio](/lune-custom-build-doc/api-reference/stdio/) | **Next:** [Task](/lune-custom-build-doc/api-reference/task/) →
