# Changesets

This monorepo uses [Changesets](https://github.com/changesets/changesets) to version and publish packages.

## Adding a changeset

When your PR changes `polymarket-react-sdk`, add a changeset:

```bash
pnpm changeset
```

CI only requires changesets when `packages/react/**` files change.

## Release flow

1. Configure npm (`NPM_TOKEN` or OIDC trusted publishing for `release.yml`).
2. Set repository variable **`ENABLE_NPM_PUBLISH`** to `true`.
3. Merge PRs with changesets to `main`.
4. Release workflow opens a **Version Packages** PR (runs `changeset version`,
   which bumps versions, updates changelogs, and **deletes consumed changeset
   files**), then publishes on merge.

If `.changeset/pre.json` has `"mode": "exit"`, the next Version Packages PR
promotes out of prerelease (e.g. `0.1.0-beta.N` → `0.1.0`) and removes
`pre.json`.

Manual release: **Actions → Release → Run workflow**.
