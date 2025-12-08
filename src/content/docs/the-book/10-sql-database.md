---
title: SQL Database
description: Working with SQLite databases in Lune
---

Lune Custom Build includes a built-in SQLite database module for persistent data storage.

## Basic Usage

```lua
local sql = require("@lune/sql")

-- Open a database file
local db = sql.open("mydata.db")

-- Or use an in-memory database
local mem = sql.memory()
```

## Creating Tables

Use `exec` for schema operations:

```lua
db:exec([[
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
]])
```

## Inserting Data

**Always use parameterized queries** to prevent SQL injection:

```lua
db:query("INSERT INTO users (name, email) VALUES (?, ?)", {
    "Alice",
    "alice@example.com"
})
```

## Querying Data

```lua
local users = db:query("SELECT * FROM users WHERE name = ?", { "Alice" })

for _, user in users do
    print(user.id, user.name, user.email)
end
```

## Prepared Statements

For repeated queries, use prepared statements for better performance:

```lua
local stmt = db:prepare("INSERT INTO users (name, email) VALUES (?, ?)")

stmt:execute({ "Bob", "bob@example.com" })
stmt:execute({ "Charlie", "charlie@example.com" })
stmt:execute({ "Diana", "diana@example.com" })
```

## Transactions

```lua
db:exec("BEGIN TRANSACTION")

local success, err = pcall(function()
    db:query("INSERT INTO users (name) VALUES (?)", { "User1" })
    db:query("INSERT INTO users (name) VALUES (?)", { "User2" })
end)

if success then
    db:exec("COMMIT")
else
    db:exec("ROLLBACK")
    error(err)
end
```

## Closing the Database

```lua
db:close()
```

## Security

> **Important:** Always use parameterized queries with `?` placeholders. Never concatenate user input directly into SQL strings.

```lua
-- ✅ SAFE
db:query("SELECT * FROM users WHERE id = ?", { userId })

-- ❌ DANGEROUS - SQL Injection vulnerable!
db:query("SELECT * FROM users WHERE id = " .. userId)
```
