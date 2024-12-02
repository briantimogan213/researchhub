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
    runCommand('npx', ['postcss', './src/tailwind.css', '-o', './public/css/main.min.css', '--watch']);

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for second

    console.log('Running Typescript build watcher...');
    // Run TypeScript compiler in watch mode
    runCommand('npx', ['tsc', '--watch']);
}

// Execute the main function
main();