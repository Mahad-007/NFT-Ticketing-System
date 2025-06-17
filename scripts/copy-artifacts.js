const fs = require('fs');
const path = require('path');

// Create src/artifacts directory if it doesn't exist
const artifactsDir = path.join(__dirname, '../src/artifacts');
if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
}

// Copy artifacts from hardhat artifacts to src/artifacts
const hardhatArtifactsDir = path.join(__dirname, '../artifacts');
if (fs.existsSync(hardhatArtifactsDir)) {
    fs.cpSync(hardhatArtifactsDir, artifactsDir, { recursive: true });
    console.log('Artifacts copied successfully!');
} else {
    console.error('Hardhat artifacts directory not found. Please run "npx hardhat compile" first.');
} 