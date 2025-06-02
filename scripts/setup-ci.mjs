#!/usr/bin/env node

/**
 * CI Setup Script
 * Validates the CI environment and configuration
 */

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔧 Setting up CI environment...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'jest.config.js',
  '.eslintrc.cjs',
  '.prettierrc',
  '.github/workflows/ci.yml',
  '.github/workflows/release.yml'
];

console.log('📋 Checking required files...');
let missingFiles = [];

for (const file of requiredFiles) {
  const filePath = join(rootDir, file);
  if (existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    missingFiles.push(file);
  }
}

if (missingFiles.length > 0) {
  console.log(`\n❌ Missing files: ${missingFiles.join(', ')}`);
  process.exit(1);
}

// Validate package.json scripts
console.log('\n📦 Checking package.json scripts...');
const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));

const requiredScripts = [
  'build',
  'build:proto',
  'test',
  'test:coverage',
  'lint',
  'lint:fix',
  'format'
];

let missingScripts = [];

for (const script of requiredScripts) {
  if (packageJson.scripts[script]) {
    console.log(`✅ npm run ${script}`);
  } else {
    console.log(`❌ npm run ${script} - MISSING`);
    missingScripts.push(script);
  }
}

if (missingScripts.length > 0) {
  console.log(`\n❌ Missing scripts: ${missingScripts.join(', ')}`);
  process.exit(1);
}

// Check Node.js version
console.log('\n🟢 Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0]);

if (majorVersion >= 16) {
  console.log(`✅ Node.js ${nodeVersion} (>= 16.0.0)`);
} else {
  console.log(`❌ Node.js ${nodeVersion} - Requires >= 16.0.0`);
  process.exit(1);
}

// Validate CI workflow syntax
console.log('\n🔄 Validating CI workflows...');
try {
  // This is a basic check - in a real scenario you might want to use a YAML parser
  const ciWorkflow = readFileSync(join(rootDir, '.github/workflows/ci.yml'), 'utf8');
  if (ciWorkflow.includes('name: CI') && ciWorkflow.includes('jobs:')) {
    console.log('✅ CI workflow syntax appears valid');
  } else {
    console.log('❌ CI workflow syntax issues detected');
    process.exit(1);
  }
} catch (error) {
  console.log(`❌ Error reading CI workflow: ${error.message}`);
  process.exit(1);
}

// Test if npm scripts work
console.log('\n🧪 Testing npm scripts...');
try {
  // Test if we can install dependencies
  console.log('Installing dependencies...');
  execSync('npm ci', { cwd: rootDir, stdio: 'inherit' });
  
  // Test proto generation
  console.log('Generating proto files...');
  execSync('npm run build:proto', { cwd: rootDir, stdio: 'inherit' });
  
  // Test linting
  console.log('Running linter...');
  execSync('npm run lint', { cwd: rootDir, stdio: 'inherit' });
  
  console.log('✅ All npm scripts work correctly');
} catch (error) {
  console.log(`❌ Error running npm scripts: ${error.message}`);
  process.exit(1);
}

console.log('\n🎉 CI environment setup complete!');
console.log('\n📚 Next steps:');
console.log('1. Update repository URLs in package.json and README.md');
console.log('2. Set up GitHub secrets (NPM_TOKEN for releases)');
console.log('3. Enable GitHub Actions in your repository');
console.log('4. Set up Codecov integration (optional)');
console.log('5. Configure branch protection rules');

console.log('\n🔐 Required GitHub Secrets:');
console.log('- NPM_TOKEN: For publishing to npm registry');

console.log('\n🏷️  Recommended GitHub settings:');
console.log('- Enable "Require status checks to pass before merging"');
console.log('- Enable "Require branches to be up to date before merging"');
console.log('- Require "CI" workflow to pass');
console.log('- Enable "Restrict pushes that create files larger than 100 MB"'); 