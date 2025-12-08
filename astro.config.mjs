// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  base: "/",
  site: "https://yanlvl99.github.io/lune-custom-build-doc",
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
          autogenerate: { directory: "api-reference" },
        },
      ],
    }),
  ],
});
