const axios = require('axios');
const cheerio = require('cheerio');

const htmlTags = [
    'title', 'meta', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
    'p', 'a', 'div', 'span', 'img', 'ul', 'ol', 'li', 'form', 
    'input', 'button', 'table', 'tr', 'td', 'th', 'header', 
    'footer', 'section', 'article', 'aside', 'nav', 'strong', 
    'em', 'b', 'i', 'u', 'blockquote', 'code', 'pre', 'hr', 
    'label', 'textarea', 'select', 'option', 'iframe', 'video', 
    'audio', 'canvas', 'svg', 'link', 'style', 'script', 
    'meta', 'base', 'head', 'body', 'html', 'br', 'footer', 
    'address', 'details', 'summary', 'progress', 'meter', 
    'fieldset', 'legend', 'caption', 'col', 'colgroup', 'time', 
    'mark', 'q', 's', 'sub', 'sup', 'del', 'ins', 'dfn', 'cite', 
    'abbr', 'bdi', 'bdo', 'ruby', 'rt', 'rp', 'wbr', 'var', 
    'samp', 'kbd', 'dfn', 'output', 'summary', 'object', 'param', 
    'noscript', 'picture', 'source', 'track', 'template', 
    'style', 'link', 'meta', 'title'
];

async function scrapeData(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const scrapedData = {
            url,
            content: {}
        };
        htmlTags.forEach(tag => {
            const elements = $(tag);
            if (elements.length > 0) {
                scrapedData.content[tag] = [];
                elements.each((i, el) => {
                    if (tag === 'img') {
                        scrapedData.content[tag].push($(el).attr('src'));
                    } else if (tag === 'a') {
                        scrapedData.content[tag].push($(el).attr('href'));
                    } else {
                        scrapedData.content[tag].push($(el).text().trim());
                    }
                });
            } else {
                scrapedData.content[tag] = null; 
            }
        });
        return scrapedData;
    } catch (error) {
        throw new Error('Failed to scrape the website: ' + error.message);
    }
}

module.exports = scrapeData;
