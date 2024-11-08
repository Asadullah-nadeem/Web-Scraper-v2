const express = require('express');
const fs = require('fs'); 
const path = require('path'); 
const url = require('url');
const scraper = require('./scraper'); 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index', { title: 'Web Scraper', data: null });
});

app.post('/scrape', async (req, res) => {
    const urlString = req.body.url;

    try {
        const scrapedData = await scraper(urlString); 
        const parsedUrl = new URL(urlString);
        const domainName = parsedUrl.hostname.replace('www.', '');
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }
        const filePath = path.join(uploadsDir, `scraped_data_${domainName}_${Date.now()}.json`);
        fs.writeFile(filePath, JSON.stringify(scrapedData, null, 2), (err) => {
            if (err) {
                console.log('Error saving file:', err);
                res.render('index', { title: 'Web Scraper', data: { error: 'Failed to save data to file' } });
            } else {
                console.log(`Data saved to ${filePath}`);
            }
        });
        res.render('index', { title: 'Web Scraper', data: { ...scrapedData, filePath: `/uploads/${path.basename(filePath)}` } });
    } catch (error) {
        res.render('index', { title: 'Web Scraper', data: { error: error.message } });
    }
});

// Set up the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
