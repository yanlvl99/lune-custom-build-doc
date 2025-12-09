---
title: Command-Line Usage
---

## Running Scripts

Once you've written a script file, for example `script-name.luau`, you can run it:

```bash title="Terminal"
lune script-name.luau
```

Or using the legacy syntax:

```bash title="Terminal"
lune run script-name
```

Lune will look for the file in:

- The current directory
- The folder `lune` in the current directory
- The folder `.lune` in the current directory
- The folder `lune` in your home directory
- The folder `.lune` in your home directory

## Package Management

### Initialize a project

```bash title="Terminal"
lune --init
```

Creates `lune.config.json`, `.luaurc`, and `lune_packages/` directory.

### Install packages

```bash title="Terminal"
lune --install colors networking
```

Or install a specific version:

```bash title="Terminal"
lune --install colors@1.0.0
```

Or install from config file:

```bash title="Terminal"
lune --install
```

### Update packages

```bash title="Terminal"
lune --updpkg
```

Updates all packages to their latest versions. After updating, the versions are locked in `lune.config.json`.


## Listing Scripts

```bash title="Terminal"
lune --list
```

Lists all scripts found in `lune` or `.lune` directories.

## Building Executables

```bash title="Terminal"
lune --build script.luau
```

Compiles your script into a standalone executable.

## REPL

```bash title="Terminal"
lune --repl
```

Starts an interactive Luau REPL session.

## Advanced Usage

```bash title="Terminal"
lune run -
```

Runs a script passed via stdin:

```bash title="Terminal"
echo "print 'Hello, terminal!'" | lune run -
```

---

**Note:** Lune supports both `.luau` and `.lua` extensions, but `.luau` is recommended.
