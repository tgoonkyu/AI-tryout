#!/usr/bin/env node

/**
 * Sync resources from central resources/ directory to frontend/public
 * This script runs automatically before dev and build commands
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const projectRoot = path.resolve(__dirname, '..', '..');
const resourcesDir = path.join(projectRoot, 'resources');
const publicDir = path.join(__dirname, '..', 'public');

console.log('🔄 Syncing resources from resources/ to frontend/public...');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy coin images
console.log('  📁 Copying coin images...');
const imagesSource = path.join(resourcesDir, 'images');
const coinFiles = ['coin-heads.svg', 'coin-tails.svg'];

coinFiles.forEach(file => {
  const sourcePath = path.join(imagesSource, file);
  const destPath = path.join(publicDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`    ✅ ${file}`);
  } else {
    console.warn(`    ⚠️  ${file} not found in resources/images/`);
  }
});

// Create sounds directory
const publicSoundsDir = path.join(publicDir, 'sounds');
if (!fs.existsSync(publicSoundsDir)) {
  fs.mkdirSync(publicSoundsDir, { recursive: true });
}

// Copy sound files if they exist
console.log('  🔊 Checking for sound files...');
const soundsSource = path.join(resourcesDir, 'sounds');
const soundFiles = ['flip-start.mp3', 'coin-rattle.mp3', 'flip-result.mp3'];

soundFiles.forEach(file => {
  const sourcePath = path.join(soundsSource, file);
  const destPath = path.join(publicSoundsDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`    ✅ ${file}`);
  } else {
    console.log(`    ⚠️  ${file} not found (will be needed for sound effects)`);
  }
});

console.log('');
console.log('✨ Resource sync complete!');
console.log('   Frontend can now access resources from /public');
