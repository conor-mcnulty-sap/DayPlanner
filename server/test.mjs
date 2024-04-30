import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://news.sap.com');

  // Get all items under "SAP News" Section
  const listItems = await page.$$eval('.c-posts-list ul li a', elements => elements.map(element => ({
    title: element.textContent.trim(),
    link: element.getAttribute('href')
  })));

  // Log each item in the format "Title: {title}, Link: {link}"
  // listItems.forEach(item => console.log(`Title: ${item.title}, Link: ${item.link}`));
  
  // End of SAP News Section

  // Get all items under "Featured Articles" Section
  const articles = await page.$$eval('.c-posts-grid__inner article', elements => elements.map(element => ({
    title: element.querySelector('h2.c-heading').textContent.trim(),
    link: element.querySelector('a.c-post-link-wrapper').getAttribute('href'),
    author: element.querySelector('.c-entry-author a').textContent.trim(),
    date: element.querySelector('.c-entry-date').textContent.trim(),
    image: element.querySelector('.post-thumbnail__img.wp-post-image').getAttribute('src')
  })));

  // Log each article in the format "Title: {title}, Link: {link}, Author: {author}, Date: {date}"
  //articles.forEach(article => console.log(`Title: ${article.title}, Link: ${article.link}, Author: ${article.author}, Date: ${article.date}, Image: ${article.image}`));

  // End of Featured Articles Section

  // Get Corporate Blog
  const blogPosts = await page.$$eval('.c-hero-post', elements => elements.map(element => ({
    title: element.querySelector('.c-hero-post__content--inner h2.c-heading').textContent.trim(),
    link: element.querySelector('.c-post-link-wrapper').getAttribute('href'),
    author: element.querySelector('.c-entry-author a').textContent.trim(),
    date: element.querySelector('.c-entry-date').textContent.trim(),
    image: element.querySelector('.wp-post-image').getAttribute('src'),
    excerpt: element.querySelector('.c-entry-excerpt').textContent.trim()
  })));
  
  // Log each blog post in the format "Title: {title}, Link: {link}, Author: {author}, Date: {date}, Image: {image}, Excerpt: {excerpt}"
  /**
  blogPosts.forEach(blogPost => {
    console.log(`Title: ${blogPost.title}, Link: ${blogPost.link}, Author: ${blogPost.author}, Date: ${blogPost.date}, Image: ${blogPost.image}, Excerpt: ${blogPost.excerpt}`);
  }); **/

  // Prepare the data in the format "Section" -> "Article" -> "Article Details"
  const data = {
    "SAP News": listItems,
    "Articles": articles,
    "BlogPosts": blogPosts
  };

  // Write the data to a JSON file
  fs.writeFileSync('output.json', JSON.stringify(data, null, 2));
  
  await browser.close();
})();