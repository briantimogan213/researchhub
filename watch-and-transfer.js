const { exec } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

// Paths
const jsxDist = path.resolve(__dirname, 'src', 'Views', 'react', 'src'); // src folder
const buildScript = 'npm run build:vite';
// const transferScript = 'node transfer.js'; // Transfer script command

// Run Vite in watch mode
const viteProcess = exec(buildScript, { shell: true });
viteProcess.stdout.on('data', (data) => console.log(data));
viteProcess.stderr.on('data', (data) => console.error(data));
console.log('Vite is running in watch mode...');

// Watch jsxDist directory for changes
chokidar.watch(jsxDist, { persistent: true }).on('change', (filePath) => {
  console.log(`File changed: ${filePath}`);
  console.log('Running transfer script...');
  exec(buildScript, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error running transfer script: ${err.message}`);
      return;
    }
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  });
});
