// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  base: "/lune-custom-build-doc/",
  site: "https://yanlvl99.github.io",
  integrations: [
    starlight({
      title: "Lune Custom Build",
      logo: {
        src: "./src/assets/logo.svg",
        replacesTitle: true,
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/yanlvl99/lune-custom-build",
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            {
              label: "Installation",
              slug: "getting-started/1-installation",
            },
            {
              label: "Command-Line Usage",
              slug: "getting-started/2-command-line-usage",
            },
            {
              label: "Editor Setup",
              slug: "getting-started/3-editor-setup",
            },
            {
              label: "Security",
              slug: "getting-started/4-security",
            },
            {
              label: "Useful Examples",
              slug: "getting-started/5-useful-examples",
            },
          ],
        },
        {
          label: "Package Manager",
          items: [
            {
              label: "Initialize Project",
              slug: "packages/1-init",
            },
            {
              label: "Installing Packages",
              slug: "packages/2-install",
            },
            {
              label: "Creating Packages",
              slug: "packages/3-creating",
            },
            {
              label: "Registry",
              slug: "packages/4-registry",
            },
          ],
        },
        {
          label: "The Lune Book",
          items: [
            {
              label: "1 ∙ Hello, Lune!",
              slug: "the-book/1-hello-lune",
            },
            {
              label: "2 ∙ The Standard Library",
              slug: "the-book/2-standard-library",
            },
            {
              label: "3 ∙ Input & Output",
              slug: "the-book/3-input-output",
            },
            {
              label: "4 ∙ Arguments",
              slug: "the-book/4-arguments",
            },
            {
              label: "5 ∙ Networking",
              slug: "the-book/5-networking",
            },
            {
              label: "6 ∙ Working with Files",
              slug: "the-book/6-working-with-files",
            },
            {
              label: "7 ∙ Modules",
              slug: "the-book/7-modules",
            },
            {
              label: "8 ∙ Spawning Processes",
              slug: "the-book/8-spawning-processes",
            },
            {
              label: "9 ∙ The Task Scheduler",
              slug: "the-book/9-task-scheduler",
            },
            {
              label: "10 ∙ SQL Database",
              slug: "the-book/10-sql-database",
            },
            {
              label: "11 ∙ Extended Globals",
              slug: "the-book/11-extended-globals",
            },
            {
              label: "12 ∙ UDP & TCP Sockets",
              slug: "the-book/12-udp-tcp-sockets",
            },
            {
              label: "13 ∙ FFI (Native Libraries)",
              slug: "the-book/13-ffi",
            },
          ],
        },
        {
          label: "Roblox",
          items: [
            {
              label: "Introduction",
              slug: "roblox/1-introduction",
            },
            {
              label: "Example Scripts",
              slug: "roblox/2-examples",
            },
          ],
        },
        {
          label: "API Reference",
          items: [
            { label: "DateTime", slug: "api-reference/datetime" },
            { label: "FFI", slug: "api-reference/ffi" },
            { label: "FS (File System)", slug: "api-reference/fs" },
            { label: "Luau", slug: "api-reference/luau" },
            { label: "Net", slug: "api-reference/net" },
            { label: "Process", slug: "api-reference/process" },
            { label: "Regex", slug: "api-reference/regex" },
            { label: "Roblox", slug: "api-reference/roblox" },
            { label: "Serde", slug: "api-reference/serde" },
            { label: "SQL", slug: "api-reference/sql" },
            { label: "Stdio", slug: "api-reference/stdio" },
            { label: "Task", slug: "api-reference/task" },
          ],
        },
      ],
    }),
  ],
});
