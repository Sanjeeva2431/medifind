import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Copy web assets to dist folder for Capacitor Android build
copyRecursiveSync(path.join(rootDir, 'index.html'), path.join(distDir, 'index.html'));
copyRecursiveSync(path.join(rootDir, 'styles.css'), path.join(distDir, 'styles.css'));
copyRecursiveSync(path.join(rootDir, 'manifest.json'), path.join(distDir, 'manifest.json'));
copyRecursiveSync(path.join(rootDir, 'sw.js'), path.join(distDir, 'sw.js'));
copyRecursiveSync(path.join(rootDir, 'js'), path.join(distDir, 'js'));

console.log('⚡ MediFind Web Assets bundled into /dist for Android APK build!');
