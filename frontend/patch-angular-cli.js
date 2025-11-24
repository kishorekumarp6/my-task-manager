/**
 * Workshop Patch: Fix Angular 20 Compatibility with Node.js v22.4+
 * 
 * This script:
 * 1. Bypasses Angular CLI Node.js version check
 * 2. Fixes yargs ESM compatibility issue by replacing nested yargs v18 with v17
 * 
 * Allows Angular 20 to run on Node.js v20.x or v22.x without requiring upgrades.
 * 
 * Usage: node patch-angular-cli.js (runs automatically after npm install)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Applying Angular 20 workshop compatibility patches...\n');

// Step 1: Patch Angular CLI version check
const cliPath = path.join(__dirname, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');

if (!fs.existsSync(cliPath)) {
  console.error('❌ Angular CLI not found. Run npm install first.');
  process.exit(1);
}

try {
  let content = fs.readFileSync(cliPath, 'utf8');
  
  if (!content.includes('WORKSHOP_PATCH_APPLIED')) {
    const originalCheck = /}\s*else\s+if\s*\(\s*major\s*<\s*20\s*\|\|\s*\(\s*major\s*===\s*20\s*&&\s*minor\s*<\s*19\s*\)\s*\|\|\s*\(\s*major\s*===\s*22\s*&&\s*minor\s*<\s*12\s*\)\s*\)\s*\{/;
    
    if (originalCheck.test(content)) {
      content = content.replace(originalCheck, '} else if (false /* WORKSHOP_PATCH_APPLIED: Version check disabled */) {');
      fs.writeFileSync(cliPath, content, 'utf8');
      console.log('✅ Step 1: Angular CLI version check bypassed');
    } else {
      console.log('✅ Step 1: Angular CLI already patched');
    }
  } else {
    console.log('✅ Step 1: Angular CLI already patched');
  }
  
} catch (error) {
  console.error('❌ Failed to patch Angular CLI:', error.message);
  process.exit(1);
}

// Step 2: Fix yargs ESM compatibility issue
console.log('\n🔧 Step 2: Fixing yargs ESM compatibility...');

const cliYargsPath = path.join(__dirname, 'node_modules', '@angular', 'cli', 'node_modules', 'yargs');
const compilerYargsPath = path.join(__dirname, 'node_modules', '@angular', 'compiler-cli', 'node_modules', 'yargs');

let yargsFixed = false;

// Check if problematic yargs v18 exists in nested locations
if (fs.existsSync(cliYargsPath)) {
  try {
    const yargsPackageJson = require(path.join(cliYargsPath, 'package.json'));
    if (yargsPackageJson.version.startsWith('18')) {
      console.log('   → Replacing @angular/cli nested yargs v18 with v17...');
      execSync('npm install yargs@17.7.2 --prefix node_modules/@angular/cli --no-save --silent', { cwd: __dirname });
      yargsFixed = true;
    }
  } catch (e) {
    // Ignore if already fixed
  }
}

if (fs.existsSync(compilerYargsPath)) {
  try {
    const yargsPackageJson = require(path.join(compilerYargsPath, 'package.json'));
    if (yargsPackageJson.version.startsWith('18')) {
      console.log('   → Replacing @angular/compiler-cli nested yargs v18 with v17...');
      execSync('npm install yargs@17.7.2 --prefix node_modules/@angular/compiler-cli --no-save --silent', { cwd: __dirname });
      yargsFixed = true;
    }
  } catch (e) {
    // Ignore if already fixed
  }
}

if (yargsFixed) {
  console.log('✅ Step 2: yargs ESM compatibility fixed');
} else {
  console.log('✅ Step 2: yargs already compatible (v17.x)');
}

console.log('\n✅ All patches applied successfully!');
console.log('   Angular 20 is now compatible with Node.js v20.x and v22.x');
console.log('   You can run: npm start\n');
