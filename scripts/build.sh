#!/usr/bin/env bash
# Builds the Jekyll site into _site/ (production mode).
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="$HOME/.local/bin:$PATH"

mise x -- npm install --no-fund --no-audit
mise x -- npx @tailwindcss/cli -i ./assets/css/base.css -o ./assets/css/compiled.css
mise x -- bundle install
JEKYLL_ENV=production mise x -- bundle exec jekyll build
echo "built _site/"
