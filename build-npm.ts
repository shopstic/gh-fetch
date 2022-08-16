import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.142.0/path/mod.ts";
import { build } from "https://deno.land/x/dnt@0.30.0/mod.ts";
import packageJson from "./package.json" assert { type: "json" };

const currentPath = dirname(fromFileUrl(import.meta.url));
const distPath = join(currentPath, "dist");

const version = Deno.args[0];

if (typeof version !== "string") {
  throw new Error("Version is required, pass it as the first argument");
}

try {
  await Deno.remove(distPath, { recursive: true });
} catch {
  // Ignore
}

await Deno.mkdir(distPath);

await build({
  entryPoints: ["./src/index.ts"],
  outDir: distPath,
  test: false,
  shims: {
    deno: true,
  },
  package: {
    ...packageJson,
    version,
  },
  compilerOptions: {
    lib: ["es2020", "dom"],
  },
});

await Deno.copyFile(join(currentPath, "LICENSE"), join(distPath, "LICENSE"));
