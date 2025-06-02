# CI/CD Setup Guide

This document explains how to set up and configure the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the ONNX-JS Parser project.

## Overview

The project includes several GitHub Actions workflows:

1. **CI Workflow** (`.github/workflows/ci.yml`) - Runs on every push and pull request
2. **Release Workflow** (`.github/workflows/release.yml`) - Triggers on version tags
3. **Dependencies Check** (`.github/workflows/dependencies.yml`) - Weekly dependency audits

## Prerequisites

- GitHub repository with Actions enabled
- Node.js 16+ for local development
- npm access token (for releases)

## Initial Setup

### 1. Verify Configuration

Run the setup script to validate your CI environment:

```bash
npm run setup:ci
```

This script will check:
- ✅ Required files exist
- ✅ Package.json scripts are configured
- ✅ Node.js version compatibility
- ✅ CI workflow syntax
- ✅ All npm scripts work correctly

### 2. Update Repository URLs

Update the following files with your actual repository URLs:

**package.json:**
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/onnx-js-parser.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/onnx-js-parser/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/onnx-js-parser#readme"
}
```

**README.md:**
Replace `yourusername` in all badge URLs with your actual GitHub username.

### 3. Configure GitHub Secrets

For the release workflow to work, you need to set up the following secrets in your GitHub repository:

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add the following secrets:

| Secret Name | Description | Required For |
|-------------|-------------|--------------|
| `NPM_TOKEN` | npm authentication token | Publishing to npm |

#### Getting an npm Token

1. Login to npm: `npm login`
2. Create a token: `npm token create --access public`
3. Copy the token and add it as `NPM_TOKEN` secret

### 4. Branch Protection Rules

Configure branch protection for your main branch:

1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Status checks: `Code Quality`, `Test (18)`, `Build`
   - ✅ Restrict pushes that create files larger than 100 MB

## Workflows Explained

### CI Workflow

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**

1. **Code Quality** (`lint`)
   - ESLint checking
   - Prettier format validation
   - Runs on Node.js 18

2. **Test** (`test`)
   - Matrix testing on Node.js 16, 18, 20
   - Runs unit tests with coverage
   - Uploads coverage to Codecov (Node.js 18 only)

3. **Build** (`build`)
   - Builds the project
   - Validates build artifacts
   - Uploads dist folder as artifact

4. **Test Built Package** (`test-built-package`)
   - Tests CommonJS and ES Module imports
   - Validates the built package works correctly

5. **Security Audit** (`security`)
   - Runs `npm audit` for security vulnerabilities

### Release Workflow

**Triggers:**
- Push tags matching `v*` (e.g., `v1.0.0`)

**Jobs:**

1. **Test Before Release**
   - Runs full test suite
   - Ensures code quality

2. **Build for Release**
   - Creates production build
   - Uploads artifacts

3. **Publish to NPM**
   - Publishes package to npm registry
   - Uses `NPM_TOKEN` secret

4. **Create GitHub Release**
   - Creates GitHub release with generated notes
   - Attaches build artifacts

### Dependencies Check Workflow

**Triggers:**
- Scheduled: Every Monday at 9:00 AM UTC
- Manual trigger via workflow dispatch

**Jobs:**
- Checks for outdated dependencies
- Runs security audit
- Creates GitHub issue if problems found

## Creating a Release

To create a new release:

1. Update version in `package.json`:
   ```bash
   npm version patch|minor|major
   ```

2. Push the tag:
   ```bash
   git push origin --tags
   ```

3. The release workflow will automatically:
   - Run tests
   - Build the package
   - Publish to npm
   - Create GitHub release

## Monitoring CI/CD

### Status Badges

The README includes several status badges:

- **CI Status**: Shows if the latest build passed
- **Release Status**: Shows if the latest release was successful
- **npm Version**: Shows the current published version
- **Code Coverage**: Shows test coverage percentage
- **License**: Shows the project license
- **Node.js Version**: Shows supported Node.js versions

### GitHub Actions Tab

Monitor workflow runs in the GitHub Actions tab:
- View detailed logs for each job
- Re-run failed workflows
- Download artifacts

### Notifications

Configure notifications for:
- Failed CI runs
- Security vulnerabilities
- Dependency updates

## Troubleshooting

### Common Issues

1. **Tests fail in CI but pass locally**
   - Check Node.js version differences
   - Verify environment variables
   - Check file system case sensitivity

2. **Build artifacts missing**
   - Ensure `npm run build` completes successfully
   - Check rollup configuration
   - Verify dist folder is created

3. **NPM publish fails**
   - Verify `NPM_TOKEN` secret is set
   - Check package name conflicts
   - Ensure version number is incremented

4. **Coverage upload fails**
   - Verify codecov integration
   - Check if coverage files are generated
   - Ensure CODECOV_TOKEN is set (if using private repo)

### Getting Help

1. Check workflow logs in GitHub Actions tab
2. Run `npm run setup:ci` to validate configuration
3. Check individual npm scripts: `npm run test`, `npm run build`, etc.
4. Review error messages and stack traces

## Best Practices

1. **Keep workflows fast**
   - Use caching for dependencies
   - Parallelize independent jobs
   - Avoid unnecessary work

2. **Secure your secrets**
   - Never commit tokens to git
   - Use environment-specific secrets
   - Rotate tokens regularly

3. **Test thoroughly**
   - Test on multiple Node.js versions
   - Include integration tests
   - Maintain high code coverage

4. **Monitor and maintain**
   - Review dependency updates weekly
   - Monitor security advisories
   - Keep workflow actions up to date

## Advanced Configuration

### Custom Test Environments

To test against different environments, modify the test matrix in `.github/workflows/ci.yml`:

```yaml
strategy:
  matrix:
    node-version: [16, 18, 20]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

### Additional Quality Checks

Add more quality gates:

```yaml
- name: Check bundle size
  run: npm run build && npx bundlesize

- name: Lighthouse CI
  run: npx lhci autorun
```

### Deployment Staging

Add staging deployment before production:

```yaml
deploy-staging:
  name: Deploy to Staging
  environment: staging
  # deployment steps
``` 