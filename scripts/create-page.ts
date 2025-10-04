#!/usr/bin/env bun

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

interface CreatePageOptions {
  name: string;
  title: string;
  description: string;
  icon: string;
}

async function updateSidebarItems(
  routeName: string,
  title: string,
  icon: string
) {
  const sidebarItemsPath = join(
    process.cwd(),
    "src",
    "lib",
    "sidebar-items.ts"
  );

  // Read the current sidebar-items.ts file
  let content = await readFile(sidebarItemsPath, "utf-8");

  // Check if the icon is already imported
  const iconImportRegex = new RegExp(`\\b${icon}\\b`);
  const importMatch = content.match(/import\s+{([^}]+)}\s+from\s+"@phosphor-icons\/react";/);

  if (importMatch && !iconImportRegex.test(importMatch[1])) {
    // Get the current imports
    const currentImports = importMatch[1].trim();

    // Add the new icon to the imports (alphabetically sorted)
    const imports = currentImports
      .split(',')
      .map(i => i.trim())
      .filter(i => i && i !== 'type Icon')
      .concat(icon)
      .sort();

    // Rebuild import statement
    const newImports = `import {\n  ${imports.join(',\n  ')},\n}`;

    content = content.replace(
      /import\s+{[^}]+}\s+from\s+"@phosphor-icons\/react";/,
      `import type { Icon } from "@phosphor-icons/react";\n${newImports} from "@phosphor-icons/react";`
    );
  }

  // Add the new menu item before the closing bracket
  const newMenuItem = `  { key: "${routeName}", label: "${title}", href: "/${routeName}", icon: ${icon} },`;

  // Find the last menu item and add the new one after it
  content = content.replace(
    /(export const menuItems: MenuItem\[\] = \[[^\]]+)/,
    `$1\n${newMenuItem}`
  );

  await writeFile(sidebarItemsPath, content);
  console.log(`✓ Updated sidebar-items.ts with new menu item`);
}

async function createPage(options: CreatePageOptions) {
  const { name, title, description, icon } = options;

  // Convert name to kebab-case for route
  const routeName = name.toLowerCase().replace(/\s+/g, "-");

  // Convert name to PascalCase for component
  const componentName = name
    .split(/[\s-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  // Create page directory
  const pageDir = join(process.cwd(), "src", "app", routeName);
  await mkdir(pageDir, { recursive: true });

  // Create page.tsx
  const pageContent = `"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";

export default function ${componentName}Page() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">${title}</h1>
        <p className="text-gray-600">${description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Sample Card 1</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">1,234</p>
            <p className="text-sm text-gray-500 mt-2">Sample metric</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Sample Card 2</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">5,678</p>
            <p className="text-sm text-gray-500 mt-2">Another metric</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Sample Card 3</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">9,012</p>
            <p className="text-sm text-gray-500 mt-2">Third metric</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
`;

  await writeFile(join(pageDir, "page.tsx"), pageContent);
  console.log(`✓ Created page: src/app/${routeName}/page.tsx`);

  // Update sidebar-items.ts
  await updateSidebarItems(routeName, title, icon);

  console.log("\nNext steps:");
  console.log(`1. Run the dev server: bun run dev`);
  console.log(`2. Navigate to: http://localhost:3000/${routeName}`);
  console.log("\nDone! Your new page has been added to the sidebar.");
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(`
Usage: bun run create-page [options]

Options:
  --name <name>           Page name (required)
  --title <title>         Page title (optional, defaults to name)
  --description <desc>    Page description (optional)
  --icon <icon>           Phosphor icon name (optional, defaults to FileIcon)
  -h, --help             Show this help message

Examples:
  bun run create-page --name products --icon PackageIcon
  bun run create-page --name "team" --title "Team Members" --description "Manage your team" --icon UsersIcon
  `);
  process.exit(0);
}

// Parse arguments
const options: Partial<CreatePageOptions> = {};
for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace(/^--/, "");
  const value = args[i + 1];
  options[key as keyof CreatePageOptions] = value;
}

if (!options.name) {
  console.error("Error: --name is required");
  process.exit(1);
}

// Set defaults
const finalOptions: CreatePageOptions = {
  name: options.name,
  title: options.title || options.name,
  description:
    options.description || `Manage and view your ${options.name.toLowerCase()}`,
  icon: options.icon || "FileIcon",
};

// Create the page
createPage(finalOptions).catch((error) => {
  console.error("Error creating page:", error);
  process.exit(1);
});
