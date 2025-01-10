const { spawn } = require('child_process');
const fs = require('fs');
const tscOutputDir = './src/Views/react/dist';

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
    // Run TypeScript compiler in watch mode
    // runCommand('npx', ['tsc']);
    runCommand('node', ['watch-and-transfer.js']);

    // console.log('Compiling ESM React Modules watcher...');
    // Run the custom compile script in watch mode
    // runCommand('node', ['compile.js']);
    runCommand('browser-sync', ["start", "--proxy", "localhost/smcc-research-hub", "--files", "public/jsx/react-app.umd.js"]);
    await new Promise((resolve) => {}); // Wait forever
}

// Execute the main function
main();