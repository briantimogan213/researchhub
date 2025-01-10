const fs = require('fs');
const path = require('path');

// Source and destination directories
const sourceDir = path.join(__dirname, 'jsxDist'); // Replace with your actual build directory
const destinationDir = path.join(__dirname, 'public', 'jsx');

// Ensure destination directory exists
if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
}

// Move `.js` files from sourceDir to destinationDir
fs.readdir(sourceDir, (err, files) => {
    if (err) {
        console.error(`Error reading source directory: ${err.message}`);
        process.exit(1);
    }

    files.forEach((file) => {
        const sourceFile = path.join(sourceDir, file);
        const destFile = path.join(destinationDir, file);

        // Check if the file is a `.js` file
        if (path.extname(file) === '.js' || path.extname(file) === '.mjs') {
            // Move the file
            fs.rename(sourceFile, destFile, (err) => {
                if (err) {
                    console.error(`Error moving file "${file}": ${err.message}`);
                } else {
                    console.log(`Moved: ${file}`);
                }
            });
        }
    });

    // Once all files are processed, delete the source directory
    files.forEach((file, index) => {
        if (index === files.length - 1) {
            // Ensure it's the last file being processed
            fs.rm(sourceDir, { recursive: true, force: true }, (err) => {
                if (err) {
                    console.error(`Error removing source directory: ${err.message}`);
                } else {
                    console.log(`Removed folder: ${sourceDir}`);
                }
            });
        }
    });
});
