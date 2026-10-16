#!/usr/bin/env bash
# Safe production deploy for chaniashoreexcursions.com (Cloudflare Pages project
# chania-shore-excursions, direct upload: there is no Git integration, so pushing never deploys).
#
#   bash scripts/safe-deploy.sh            checks only; prints the deploy command (default)
#   bash scripts/safe-deploy.sh --deploy   checks, then asks you to type "deploy" before uploading
#
# Environment:
#   EXPECTED_BRANCH  branch that may be deployed (default: main)
#   BASELINE_OUT     export of the currently live deployment, for a per-page diff summary
#                    (e.g. /tmp/chania-baseline-out-e405089); skipped with a warning when unset
#
# Steps, stopping at the first failure: clean tree on EXPECTED_BRANCH -> npm ci -> lint, typecheck,
# unit tests -> build -> tree still clean -> seo-qa, predeploy checks, ranking check -> diff vs baseline.
set -euo pipefail

PROJECT="chania-shore-excursions"
EXPECTED_BRANCH="${EXPECTED_BRANCH:-main}"
DEPLOY=0
[[ "${1:-}" == "--deploy" ]] && DEPLOY=1

cd "$(dirname "$0")/.."

step() { printf '\n==> %s\n' "$*"; }
fail() { printf '\nSTOP: %s\n' "$*" >&2; exit 1; }

step "Git state"
branch="$(git rev-parse --abbrev-ref HEAD)"
[[ "$branch" == "$EXPECTED_BRANCH" ]] || fail "on branch '$branch', expected '$EXPECTED_BRANCH' (set EXPECTED_BRANCH to override)"
[[ -z "$(git status --porcelain --untracked-files=all)" ]] || fail "working tree is not clean; commit or stash first"
head="$(git rev-parse HEAD)"
echo "branch $branch at $head"

step "Install (npm ci)"
npm ci --no-audit --no-fund

step "Lint, typecheck, unit tests"
npx eslint
npx tsc --noEmit
npm test

step "Build"
npm run build

[[ -z "$(git status --porcelain --untracked-files=all)" ]] || fail "the build changed tracked files: $(git status --porcelain | head -5 | tr '\n' ' ')"

step "Output checks"
node scripts/seo-qa.mjs
node scripts/predeploy-checks.mjs
node scripts/ranking-check.mjs check

step "Diff against the live baseline"
if [[ -n "${BASELINE_OUT:-}" ]]; then
  node scripts/compare-out.mjs "$BASELINE_OUT" out
else
  echo "WARNING: BASELINE_OUT not set; no per-page diff against the live deployment."
fi

cmd=(npx wrangler pages deploy out --project-name "$PROJECT" --branch main --commit-hash "$head" --commit-message "$(git log -1 --pretty=%s)" --commit-dirty=false)

step "All checks passed"
echo "Production deploy command (uploads out/ to $PROJECT, branch main = production):"
printf '  %q' "${cmd[@]}"
echo
echo "Before deploying, note the current production deployment for rollback:"
echo "  npx wrangler pages deployment list --project-name $PROJECT"

if [[ $DEPLOY -eq 0 ]]; then
  echo
  echo "Not deployed (run with --deploy to upload)."
  exit 0
fi

read -r -p "Type 'deploy' to upload to production: " answer
[[ "$answer" == "deploy" ]] || fail "not confirmed; nothing deployed"
"${cmd[@]}"
