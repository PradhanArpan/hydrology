#!/bin/sh
# Rebuild assets/app.js from src/ (needed only when src/*.jsx changes, not for content edits).
# Requires Node.js:  npm i react@18.3.1 react-dom@18.3.1 esbuild@0.21.5
cd "$(dirname "$0")/.." && npx esbuild src/app.jsx --bundle --minify --format=iife \
  --define:process.env.NODE_ENV='"production"' --outfile=assets/app.js --log-level=warning
