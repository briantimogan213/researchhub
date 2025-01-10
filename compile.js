const fs = require('fs');
const path = require('path');
const Terser = require('terser');
const chokidar = require('chokidar');

// Directories
const inputDir = 'jsxbuild';
const outputDir = 'src/Views/react/dist';

// Remove old output directory
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, {recursive: true });
}

// Ensure output directory exists
fs.mkdirSync(outputDir, { recursive: true });

// Function to minify a file
async function minifyFile(filePath) {
  console.log("filepath:", filePath);
  // Construct output path with the same directory structure
  const relativePath = path.relative(inputDir, filePath);
  const outputFile = path.join(outputDir, relativePath.replace(/\.js$/, '.js'));
  const outputDirPath = path.dirname(outputFile);

  // Ensure output directory exists
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath, { recursive: true });
  }

  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const result = await Terser.minify(code, { module: true });
    fs.writeFileSync(outputFile, result.code);
    console.log(`Minified ${filePath} to ${outputFile}`);
  } catch (err) {
    console.error(`Error minifying ${filePath}:`, err);
  }
}

// Function to recursively get all .js files
function getAllJsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsFiles(filePath));
    } else if (path.extname(file) === '.js') {
      results.push(filePath);
    }
  });
  return results;
}

// Check if `--watch` argument is present
const watchMode = process.argv.includes('--watch');

// Watch for changes in the input directory
if (watchMode) {
  chokidar.watch(path.join(inputDir, '**/*.js')).on('change', filePath => {
    console.log(`File changed: ${filePath}`);
    minifyFile(filePath);
  });
}

// Minify existing files initially
const allJsFiles = getAllJsFiles(inputDir);
Promise.all(allJsFiles.map(filePath => minifyFile(filePath)))
  .then(() => {
    console.log(watchMode ? 'Watching for file changes...' : 'Minification complete.');
  })
  .catch(err => {
    console.error('Error during initial minification:', err);
  });
