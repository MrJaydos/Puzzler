#!/bin/sh
set -e

# Run Prisma migrations
node node_modules/prisma/build/index.js migrate deploy

# Seed default puzzles (idempotent — uses INSERT OR REPLACE)
node prisma/seed.mjs

# Start the app
exec node server.js
