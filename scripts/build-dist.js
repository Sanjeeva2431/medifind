import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSync } from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else if (exists) {
        fs.copyFileSync(src, dest);
    }
}

// 1. Copy static web assets to dist folder
copyRecursiveSync(path.join(rootDir, 'styles.css'), path.join(distDir, 'styles.css'));
copyRecursiveSync(path.join(rootDir, 'manifest.json'), path.join(distDir, 'manifest.json'));
copyRecursiveSync(path.join(rootDir, 'sw.js'), path.join(distDir, 'sw.js'));
copyRecursiveSync(path.join(rootDir, 'js'), path.join(distDir, 'js'));

// 2. Bundle all ES module scripts into a single standalone bundle.js for 100% Android WebView compatibility
try {
    buildSync({
        entryPoints: [path.join(rootDir, 'js', 'app.js')],
        bundle: true,
        outfile: path.join(distDir, 'bundle.js'),
        format: 'iife',
        target: ['es2018', 'chrome70'],
        minify: false
    });
    console.log('⚡ Bundle JS successfully compiled to /dist/bundle.js');
} catch (e) {
    console.error('esbuild bundling error:', e);
}

// 3. Create dist/index.html loading bundle.js
let html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
html = html.replace('<script type="module" src="js/app.js"></script>', '<script src="bundle.js"></script>');
fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf8');

console.log('⚡ MediFind Web Assets bundled into /dist for Android APK build!');
