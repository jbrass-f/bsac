// Workaround for a Next.js 16 static-export bug on Windows: segment prefetch files
// should be written as `apply/__next.apply.__PAGE__.txt`, but Windows path separators
// make Next write `apply/__next.apply/__PAGE__.txt` instead, so client prefetches 404.
// Flattens any such `__next.*` directories. It is a no-op for builds made on Linux/macOS.
import { promises as fs } from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");

async function filesUnder(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? filesUnder(full) : [full];
  }));
  return nested.flat();
}

async function walk(dir) {
  let fixed = 0;
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const file of await filesUnder(full)) {
        const rel = path.relative(full, file).split(path.sep).join(".");
        await fs.rename(file, path.join(dir, `${entry.name}.${rel}`));
        fixed++;
      }
      await fs.rm(full, { recursive: true, force: true });
    } else if (entry.name !== "_next") {
      fixed += await walk(full);
    }
  }
  return fixed;
}

const fixed = await walk(OUT);
if (fixed) console.log(`fix-export-segments: flattened ${fixed} prefetch file(s)`);
