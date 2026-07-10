#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
PACKAGE_DIR="$ROOT_DIR/trainee-package"

rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

copy_path() {
  src="$1"
  dest="$PACKAGE_DIR/$1"
  mkdir -p "$(dirname "$dest")"
  cp -R "$ROOT_DIR/$src" "$dest"
}

copy_path "pages"
copy_path "lib"
copy_path "prisma"
copy_path "repositories"
copy_path "tests/visible"
copy_path "tests/helpers"
copy_path ".github"
copy_path "scripts/package-trainee.sh"
copy_path ".env.example"
copy_path ".gitignore"
copy_path "CHALLENGE.md"
copy_path "SUBMISSION.md"
copy_path "README.md"
copy_path "package.json"
copy_path "tsconfig.json"
copy_path "jest.config.js"
copy_path "eslint.config.js"
copy_path "docker-compose.yml"
copy_path "next-env.d.ts"
copy_path "types"

rm -rf "$PACKAGE_DIR/instructor"
rm -rf "$PACKAGE_DIR/tests/hidden"
rm -rf "$PACKAGE_DIR/coverage" "$PACKAGE_DIR/reports"

chmod +x "$PACKAGE_DIR/scripts/package-trainee.sh"
printf '%s\n' "$PACKAGE_DIR"
