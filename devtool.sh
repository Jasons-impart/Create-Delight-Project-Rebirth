#!/usr/bin/env sh
set -eu

case "$(uname -s 2>/dev/null || echo unknown)" in
  MINGW*|MSYS*|CYGWIN*)
    echo "devtool.sh is for Linux/macOS. On Windows, run .\\devtool.bat instead." >&2
    exit 1
    ;;
esac

cd "$(dirname "$0")"
exec node scripts/devtool.mjs "$@"
