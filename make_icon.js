const fs = require('fs');
const { execSync } = require('child_process');

// Install jimp for image processing
try {
    require('jimp');
} catch {
    console.log('Installing jimp...');
    execSync('npm install jimp', { stdio: 'inherit' });
}

async function createIcon() {
    const { Jimp } = await import('jimp');
    const img = await Jimp.read('unnamed-removebg-preview.png');
    const size = Math.max(img.width, img.height);
    
    // Create square canvas
    const square = new Jimp({ width: size, height: size, color: 0x00000000 });
    const x = Math.floor((size - img.width) / 2);
    const y = Math.floor((size - img.height) / 2);
    square.composite(img, x, y);
    
    // Resize to 256x256
    square.resize({ w: 256, h: 256 });
    await square.write('mucchad-square.png');
    
    // Convert to ICO
    const pngToIco = (await import('png-to-ico')).default;
    const buf = await pngToIco('mucchad-square.png');
    fs.writeFileSync('etc/mucchad-icon.ico', buf);
    
    console.log('Icon created successfully!');
    fs.unlinkSync('mucchad-square.png');
}

createIcon().catch(console.error);
