import { readFile, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const projectRoot = process.cwd();
const entryPath = path.join(projectRoot, ".prerender", "entry-server.js");
const indexPath = path.join(projectRoot, "dist", "index.html");
const { render } = await import(`${pathToFileURL(entryPath).href}?v=${Date.now()}`);
const markup = render();
const template = await readFile(indexPath, "utf8");
const marker = '<div id="root"></div>';

if (!template.includes(marker)) {
  throw new Error("Prerender root marker was not found in dist/index.html");
}

await writeFile(indexPath, template.replace(marker, `<div id="root">${markup}</div>`));
await rm(path.join(projectRoot, ".prerender"), { recursive: true, force: true });

