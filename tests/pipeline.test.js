const assert = require('assert');
const http = require('http');
const { spawn } = require('child_process');

console.log('Starting app for automated testing...');

const server = spawn('node', ['app.js'], { env: { ...process.env, PORT: 3001 } });

let output = '';
server.stdout.on('data', (d) => { output += d.toString(); });
server.stderr.on('data', (d) => { output += d.toString(); });

function checkEndpoint(retries) {
  http.get('http://localhost:3001/', (res) => {
    assert.strictEqual(res.statusCode, 200, `Expected 200, got ${res.statusCode}`);
    console.log('✓ App responded with 200 on /');
    console.log('All automated tests passed.');
    server.kill();
    process.exit(0);
  }).on('error', (err) => {
    if (retries > 0) {
      setTimeout(() => checkEndpoint(retries - 1), 1000);
    } else {
      console.error('✗ App did not respond in time:', err.message);
      console.error('App output:', output);
      server.kill();
      process.exit(1);
    }
  });
}

setTimeout(() => checkEndpoint(10), 1500);
