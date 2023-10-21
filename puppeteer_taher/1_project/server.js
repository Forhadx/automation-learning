// import express from "express";

// const app = express();

// app.listen(5000, () => console.log("listening on port"));

import puppeteer from "puppeteer";
import { setTimeout } from "timers/promises";

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: { width: 1920, height: 1080 },
  slowMo: 250,
  userDataDir: "temporary",
});
const page = await browser.newPage();

//======== one
async function examplePage() {
  await page.goto("https://example.com", {
    waitUntil: "networkidle2",
    timeout: 60000, // 60sec
  });
  await page.screenshot({ path: "example.com.png" });

  await browser.close();
}
// examplePage();

//===== two
async function fullPageSS() {
  await page.goto("https://devconfbd.com/", {
    waitUntil: "networkidle2",
    timeout: 60000, // 60sec
  });
  await page.screenshot({ path: "devconfbd.png", fullPage: true });
  await browser.close();
}
// fullPageSS();

//====== three
// click and open a modal then take ss
async function three() {
  await page.goto("https://devconfbd.com/");
  await page.waitForSelector("img[alt='guest']");
  await page.click("img[alt='guest']"); // click the first image
  await setTimeout(1000);
  await page.screenshot({ path: "guest.png" });
  await browser.close();
}
// three();

//====== four
// modify with another way of three
async function four() {
  await page.goto("https://devconfbd.com/");
  let guestElem = await page.waitForSelector("img[alt='guest']");
  await guestElem.scrollIntoView(); // wait for the element to scroll
  await setTimeout(1000);

  await guestElem.click("img[alt='guest']"); // click the first image
  await setTimeout(1000);

  await page.screenshot({ path: "guest.png" });
  await browser.close();
}
// four();

//====== five
// search and find page
async function five() {
  await page.goto("https://duckduckgo.com/", {
    waitUntil: "networkidle2",
  });

  /*
  await page.waitForSelector("#searchbox_input");
  await page.type("#searchbox_input", "devconfbd");
  await page.click(".searchbox_searchButton__F5Bwq");
  await page.waitForSelector('[data-testid="result-title-a"]');
  await page.screenshot({ path: "duck.png" });
  */

  const searchInput = await page.waitForSelector("#searchbox_input");
  await searchInput.type("devconfbd");

  const searchBtn = await page.waitForSelector(
    ".searchbox_searchButton__F5Bwq"
  );
  await searchBtn.click();

  let result = await page.waitForSelector('[data-testid="result-title-a"]');
  await result.screenshot({ path: "duck.png" });

  await browser.close();
}
// five();

//====== six
// search and find page
async function six() {
  await page.goto("https://duckduckgo.com/", {
    waitUntil: "networkidle2",
  });

  const searchInput = await page.waitForSelector("#searchbox_input");
  await searchInput.type("devconfbd");

  const searchBtn = await page.waitForSelector(
    ".searchbox_searchButton__F5Bwq"
  );
  await searchBtn.click();

  let firstResult = await page.waitForSelector(
    '[data-testid="result-title-a"]'
  );
  await firstResult.click();

  await page.waitForSelector(".sponsors a, .supporter a");
  let sponsorsLinks = await page.evaluate(() => {
    return [...document.querySelectorAll(".sponsors a")].map(
      (data) => data?.href
    );
  });
  let supportersLinks = await page.evaluate(() => {
    return [...document.querySelectorAll(".supporter a")].map(
      (data) => data?.href
    );
  });

  // console.log({ sponsorsLinks, supportersLinks });

  // const queue = new PQueue({concuren});
  let allData = [];
  for (let link of supportersLinks) {
    allData.push(await getLinks(link));
  }

  console.log(allData);

  await browser.close();
}
six();

async function getLinks(link) {
  console.log("link...", link);
  const page = await browser.newPage();

  await page.goto(link, { waitUntil: "networkidle2", timeout: 0 }); // timeout:0 = unlimited time
  const title = await page.title();
  const hostname = await page.evaluate(() => window.location.hostname);
  await page.screenshot({ path: `./public/${hostname}.png` });
  let fbLink = await page.evaluate(
    () => document.querySelector("a[href*=facebook]")?.href
  );
  await page.close();
  return {
    link,
    title,
    hostname,
    fbLink,
  };
}

// await browser.close();
