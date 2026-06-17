#!/bin/sh
set -e

# Run Prisma migrations
node node_modules/prisma/build/index.js migrate deploy

# Start the app
exec node server.js
