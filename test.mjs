import cron from 'node-cron';
import fs from 'fs';
import puppeteer from 'puppeteer';
 
// Define a sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
 
let browser, page;
 
async function initializePuppeteer() {
  if(browser) {
    await browser.close();
  }
  // Launch the browser and open a new blank page
  browser = await puppeteer.launch();
  page = await browser.newPage();
}
 
cron.schedule('* * * * *', async () => { // replace with your desired cron schedule
  await initializePuppeteer();
 
  // Navigate the page to a URL
  await page.goto("https://news.sap.com/features/");
 
  // Wait for the "Show more" button to be loaded
  await page.waitForSelector(".c-button.btn.load-more");
 
  // Click the "Show more" button and prevent the default action
  await page.evaluate(() => {
    const button = document.querySelector(".c-button.btn.load-more");
    button.addEventListener("click", (event) => {
      event.preventDefault();
    });
    button.click();
  });
  await sleep(200); // Wait for the page to load
 
  // Get all articles in the grid
  const articles = await page.$$eval('article', nodes => nodes.map(node => {
    const isHeroPost = node.classList.contains('c-hero-post');
    const linkElement = node.querySelector('.c-post-link-wrapper');
    const authorElement = node.querySelector('.c-entry-author a');
    const dateElement = node.querySelector('.c-entry-date');
    const imageElement = node.querySelector(isHeroPost ? '.c-post-link-wrapper img' : '.c-post-teaser__top .post-thumbnail__img');
    const titleElement = node.querySelector(isHeroPost ? '.c-hero-post__content h2.c-heading' : 'h2.c-heading.entry-header__heading');
 
    return {
      title: titleElement ? titleElement.innerText : null,
      link: linkElement ? linkElement.href : null,
      author: authorElement ? authorElement.innerText : null,
      date: dateElement ? dateElement.innerText : null,
      image: imageElement ? imageElement.src : null,
    };
  }));
 
  // Prepare the data in the format "Section" -> "Article" -> "Article Details"
  const data = {
    Articles: articles,
  };
 
  // Write the data to a JSON file
  fs.writeFile("output.json", JSON.stringify(data, null, 2), err => {
    if (err) throw err;
    console.log('Data written to file');
  });
 
  await browser.close();
});