const fs = require('fs');
const https = require('https');

// Simple PNG to ICO converter using sharp if available, otherwise use png-to-ico
async function convertIcon() {
    try {
        const sharp = require('sharp');
        const png = fs.readFileSync('unnamed-removebg-preview.png');
        
        // Create 256x256 icon
        await sharp(png)
            .resize(256, 256)
            .toFile('etc/mucchad-icon-256.png');
        
        console.log('Icon resized! Now use an online converter or install png-to-ico');
        console.log('Run: npm install png-to-ico');
    } catch (e) {
        console.log('Installing png-to-ico...');
        const { execSync } = require('child_process');
        execSync('npm install png-to-ico', { stdio: 'inherit' });
        
        const pngToIco = require('png-to-ico').default || require('png-to-ico');
        const buf = await pngToIco('unnamed-removebg-preview.png');
        fs.writeFileSync('etc/mucchad-icon.ico', buf);
        console.log('Icon created successfully at etc/mucchad-icon.ico');
    }
}

convertIcon();
