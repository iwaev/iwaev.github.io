#!/usr/bin/env bash
# Builds the site and publishes the rendered output to the public Pages repo
# (iwaev/iayc-org) using the repo deploy key. No GitHub Actions required.
#
# One-time setup on a new machine:
#   curl -fsSL https://mise.run | sh          # toolchain manager
#   mise install                              # ruby + node from mise.toml
#   sudo apt install -y build-essential       # for native gems
#   put the deploy key at ~/iayc-backup/iayc-pages-deploy (or set DEPLOY_KEY)
set -euo pipefail
cd "$(dirname "$0")/.."

DEPLOY_KEY="${DEPLOY_KEY:-$HOME/iayc-backup/iayc-pages-deploy}"
PUBLISH_DIR="${PUBLISH_DIR:-$HOME/iayc-org-publish}"
export GIT_SSH_COMMAND="ssh -i $DEPLOY_KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
if [ -n "$(git status --porcelain)" ]; then
  echo "WARNING: uncommitted changes present - they WILL be included in the published build."
  echo "         Commit or stash first if you only want committed work to ship. Continuing in 3s..."
  sleep 3
fi

./scripts/build.sh

if [ ! -d "$PUBLISH_DIR/.git" ]; then
  git clone git@github.com:iwaev/iayc-org.git "$PUBLISH_DIR"
fi
rsync -a --delete --exclude '.git' _site/ "$PUBLISH_DIR/"
echo "iayc.org" > "$PUBLISH_DIR/CNAME"
cd "$PUBLISH_DIR"
git add -A
if git diff --cached --quiet; then
  echo "nothing to publish"
else
  git -c user.name="IAYC Site Publisher" -c user.email="publisher@iayc.org" \
    commit -m "Publish site $(date -u +%Y-%m-%dT%H:%MZ)"
  git push origin main
  echo "== published =="
fi
