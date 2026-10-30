#!/usr/bin/env bash
set -euo pipefail

target="$1"
source_dir="$2"

if [ -z "${BASELINES_KEY:-}" ]; then
  echo "::error title=Missing secret BASELINES_KEY::BASELINES_KEY is not set, so e-suiss/ui-baselines cannot be updated. Create a deploy key with write access in e-suiss/ui-baselines (Settings > Deploy keys), add its private key as the BASELINES_KEY secret in e-suiss/ui (Settings > Secrets and variables > Actions), then run the workflow again with update set to publish."
  exit 1
fi

mkdir -p ~/.ssh
ssh-keyscan github.com >> ~/.ssh/known_hosts 2> /dev/null
printf '%s\n' "$BASELINES_KEY" > ~/.ssh/baselines
chmod 600 ~/.ssh/baselines
export GIT_SSH_COMMAND="ssh -i $HOME/.ssh/baselines -o IdentitiesOnly=yes"

work="$(mktemp -d)"
git clone --quiet --depth 1 git@github.com:e-suiss/ui-baselines.git "$work"
cd "$work"
if [ -z "${ONLY:-}" ]; then
  rm -rf "$target"
fi
mkdir -p "$target"
cp -R "$source_dir"/. "$target"/
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git checkout --quiet --orphan screenshots
git add --all
git commit --quiet --message "chore: reference screenshots for e-suiss/ui@${SOURCE:-unknown}"
git push --quiet --force origin screenshots:main
