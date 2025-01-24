const { spawn } = require('child_process');
const fs = require('fs');
const tscOutputDir = './src/Views/react/dist';

require('dotenv').config({
    path: ".env.production"
});

// Helper function to run a command and log its output
function runCommand(command, args = [], options = {}) {
    return spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        ...options
    });
}

// Main function to execute all commands
async function main() {
    // Remove old typescript build directory
    if (fs.existsSync(tscOutputDir)) {
        fs.rmSync(tscOutputDir, {recursive: true });
    }

    console.log('Running Tailwind build watcher...');
    // Run postcss with Tailwind CSS in watch mode
    runCommand('npm', ['run' ,'watch:tailwind']);

    console.log('Running Typescript build watcher...');

    runCommand('node', ['watch-and-transfer.js']);
    console.log("Serving Development Server..");
    runCommand('browser-sync', [
        "start",
        "--proxy",
        `localhost${process.env.URI_PREFIX}`,
        "--files",
        "public/jsx/react-app.umd.js, src/**/*.php, public/css/*.css",
        "--https",
        "--cert",
        "cert/server.crt",
        "--key",
        "cert/server.key"
    ]);
    await new Promise((resolve) => {}); // Wait forever
}

// Execute the main function
main();