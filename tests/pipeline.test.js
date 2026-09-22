const assert = require('assert');
const fs = require('fs');

console.log('Running pipeline validation tests...');

const packageJson = JSON.parse(
    fs.readFileSync('package.json', 'utf8')
);

assert(packageJson.name, 'Package name should exist');
assert(packageJson.version, 'Package version should exist');
assert(packageJson.scripts, 'NPM scripts should exist');
assert(packageJson.dependencies, 'Dependencies should exist');

console.log('✓ Package metadata test passed');
console.log('✓ NPM scripts test passed');
console.log('✓ Dependencies test passed');
console.log('All automated tests passed.');
