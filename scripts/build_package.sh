#!/bin/sh
set -e
npx tsc
npx rollup -c rollup.config.js

