import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';

const FFMPEG_VERSION = '5.1.1'; // Matches typical ffmpeg-static version
const ARCH = process.arch; // 'x64'
const PLATFORM = process.platform; // 'linux', 'win32'

// Only run on Linux (Azure)
if (PLATFORM !== 'linux') {
    console.log('Skipping FFmpeg download (not Linux)');
    process.exit(0);
}

const targetDir = path.join(process.cwd(), 'node_modules', 'ffmpeg-static');
const targetFile = path.join(targetDir, 'ffmpeg');

if (fs.existsSync(targetFile)) {
    console.log('FFmpeg binary already exists.');
    process.exit(0);
}

console.log('FFmpeg binary missing. Downloading for Linux x64...');

// Create dir if missing
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// URL for ffmpeg-static linux-x64 binary (hosted by the package maintainers or similar reliable source)
const downloadUrl = `https://github.com/eugeneware/ffmpeg-static/releases/download/b${FFMPEG_VERSION}/linux-x64`;

const file = fs.createWriteStream(targetFile);

https.get(downloadUrl, (response) => {
    if (response.statusCode !== 200) {
        console.error(`Failed to download FFmpeg: ${response.statusCode}`);
        process.exit(1);
    }

    response.pipe(file);

    file.on('finish', () => {
        file.close();
        console.log('Download complete.');
        
        // Make executable
        try {
            fs.chmodSync(targetFile, 0o755);
            console.log('Made FFmpeg executable.');
        } catch (err) {
            console.error('Failed to chmod FFmpeg:', err);
        }
    });
}).on('error', (err) => {
    fs.unlink(targetFile, () => {});
    console.error('Download error:', err);
    process.exit(1);
});
