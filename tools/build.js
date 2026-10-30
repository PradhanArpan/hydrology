const esbuild = require("esbuild");
try {
  esbuild.buildSync({
    entryPoints: ["src/app.jsx"],
    bundle: true,
    minify: true,
    format: "iife",
    define: { "process.env.NODE_ENV": '"production"' },
    outfile: "assets/app.js",
    logLevel: "warning"
  });
  console.log("Build successful: assets/app.js updated");
} catch (err) {
  console.error("Build failed:", err);
  process.exit(1);
}
