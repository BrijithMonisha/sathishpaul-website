// Import required Node.js modules
import fs from 'fs';                       // File system module for reading/writing files
import path from 'path';                   // Path utilities for file system operations
import { fileURLToPath } from 'url';       // Convert file URL to path
import { create } from 'xmlbuilder2';      // XML builder library to create XML documents

// Get the directory of the current script file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calculate the path to the project root (two levels up from src/scripts/)
const projectRoot = path.resolve(__dirname, '../..');
const publicDir = path.join(projectRoot, 'public');

// Set the base URL for your website
const baseUrl = 'https://www.sathishpaul.net';
// Add your routes here eg /gospeltoons-eng, /gospeltoons-tamil, /catholic-designs, etc.
const routes = [
    '/', // Currently only includes the homepage
    '/gospeltoons-eng',
    '/gospeltoons-tamil',
    '/gospeltoons-eng-new',
    '/gospeltoons-tamil-new',
    '/catholic-designs',
];

// Helper function to normalize image paths (ensure they start with /)
const normalizeImagePath = (imagePath) => {
    if (!imagePath) return '';
    return imagePath.startsWith('/') ? imagePath : '/' + imagePath;
};

// Load gallery images for Catholic Designs page
let galleryImages = {};
try {
    const galleryData = JSON.parse(fs.readFileSync(path.join(publicDir, 'galleryImages.json'), 'utf8'));
    galleryImages = galleryData;
    console.log('✅ Loaded galleryImages.json');
} catch (error) {
    console.warn('⚠️  Could not load galleryImages.json:', error.message);
}

// Load gospel data for Gospel Toons pages
let gospelData = {};
try {
    const gospelDataRaw = JSON.parse(fs.readFileSync(path.join(publicDir, 'gospel-data.json'), 'utf8'));
    gospelData = gospelDataRaw;
    console.log('✅ Loaded gospel-data.json');
} catch (error) {
    console.warn('⚠️  Could not load gospel-data.json:', error.message);
}

// ============================================
// Generate Text/Page Sitemap (sitemap.xml)
// ============================================
const textSitemap = create({ version: '1.0' }).ele('urlset', { 
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
});

// Loop through each route and add it to the text sitemap (no images)
routes.forEach(route => {
    const url = textSitemap.ele('url');
    url.ele('loc').txt(baseUrl + route);
    url.ele('lastmod').txt(new Date().toISOString());
});

// Write the text sitemap
const textSitemapPath = path.join(publicDir, 'sitemap.xml');
const textXml = textSitemap.end({ prettyPrint: true });
fs.writeFileSync(textSitemapPath, textXml);
console.log(`✅ Text sitemap generated: sitemap.xml (${routes.length} pages)`);

// ============================================
// Generate Image Sitemap (sitemap-images.xml)
// ============================================
const imageSitemap = create({ version: '1.0' }).ele('urlset', { 
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
    'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1'
});

let totalImages = 0;

// Helper function to collect images for a route
const getImagesForRoute = (route) => {
    const images = [];
    
    if (route === '/catholic-designs') {
        // Add all images from galleryImages.json
        Object.keys(galleryImages).forEach(category => {
            const categoryImages = galleryImages[category] || [];
            categoryImages.forEach(image => {
                if (image.src) {
                    images.push({
                        loc: baseUrl + normalizeImagePath(image.src),
                        title: image.title || '',
                        caption: image.title || ''
                    });
                }
            });
        });
    } else if (['/gospeltoons-eng', '/gospeltoons-eng-new'].includes(route) && gospelData.english) {
        // Add all English gospel toons images
        Object.keys(gospelData.english).forEach(month => {
            const monthData = gospelData.english[month] || [];
            monthData.forEach(item => {
                if (item.path) {
                    images.push({
                        loc: baseUrl + normalizeImagePath(item.path),
                        title: item.name || '',
                        caption: item.name || ''
                    });
                }
            });
        });
    } else if (['/gospeltoons-tamil', '/gospeltoons-tamil-new'].includes(route) && gospelData.tamil) {
        // Add all Tamil gospel toons images
        Object.keys(gospelData.tamil).forEach(month => {
            const monthData = gospelData.tamil[month] || [];
            monthData.forEach(item => {
                if (item.path) {
                    images.push({
                        loc: baseUrl + normalizeImagePath(item.path),
                        title: item.name || '',
                        caption: item.name || ''
                    });
                }
            });
        });
    }
    
    return images;
};

// Loop through each route and add images
routes.forEach(route => {
    const images = getImagesForRoute(route);
    
    // Only add URL entry if it has images
    if (images.length > 0) {
        const url = imageSitemap.ele('url');
        url.ele('loc').txt(baseUrl + route);
        url.ele('lastmod').txt(new Date().toISOString());
        
        // Add all images for this route
        images.forEach(image => {
            totalImages++;
            const imageElement = url.ele('image:image');
            imageElement.ele('image:loc').txt(image.loc);
            if (image.title) {
                imageElement.ele('image:title').txt(image.title);
                imageElement.ele('image:caption').txt(image.caption);
            }
        });
    }
});

// Write the image sitemap
const imageSitemapPath = path.join(publicDir, 'sitemap-images.xml');
const imageXml = imageSitemap.end({ prettyPrint: true });
fs.writeFileSync(imageSitemapPath, imageXml);
console.log(`✅ Image sitemap generated: sitemap-images.xml (${totalImages} images)`);

// Log final success message
console.log(`\n✅ Both sitemaps generated successfully!`);
console.log(`   - sitemap.xml: ${routes.length} pages`);
console.log(`   - sitemap-images.xml: ${totalImages} images`);