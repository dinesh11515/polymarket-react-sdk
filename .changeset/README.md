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
4. Release workflow opens a **Version Packages** PR, then publishes on merge.

Manual release: **Actions → Release → Run workflow**.
