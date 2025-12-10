---
title: Editor Setup
---

Lune prioritizes developer experience, providing type definitions and documentation for many editors and tools without any additional downloads.

## Quick Setup

Run this command to configure your project for editor support:

```bash title="Terminal"
lune --init
```

This creates:
- `.luaurc` - Luau LSP configuration with path aliases
- `lune.config.json` - Lune project configuration
- `lune_packages/` - Directory for installed packages

## Luau Language Server

The [Luau Language Server](https://github.com/JohnnyMorganz/luau-lsp) (`luau-lsp`) provides excellent editor support including:

- **Autocomplete** for all `@lune/*` modules
- **Type checking** with full type definitions
- **Hover documentation** for functions and types
- **Go to definition** support

### VS Code

1. Install the [Luau LSP extension](https://marketplace.visualstudio.com/items?itemName=JohnnyMorganz.luau-lsp)
2. Run `lune --init` in your project
3. Restart VS Code

### Neovim

Add to your LSP config:

```lua
require('lspconfig').luau_lsp.setup({
    -- Configuration here
})
```

### Other Editors

Any editor supporting the Language Server Protocol can use `luau-lsp`. Check your editor's documentation for LSP setup.

## Troubleshooting

If autocomplete isn't working:

1. Make sure you ran `lune --init`
2. Check that `.luaurc` exists in your project root
3. Restart your editor/language server

---

← [Command Line Usage](/getting-started/2-command-line-usage/) | **Next:** [Security](/getting-started/4-security/) →
