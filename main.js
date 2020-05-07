#! /usr/bin/env node
const puppeteer = require('puppeteer');

if(process.argv.length < 4){
    console.log("Please provide input and output path");
    process.exit(1);
}


(async ()=>{
    let filepath = process.argv[2];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(filepath, {waitUntil: 'networkidle2'});
    await page.pdf({path: process.argv[3], format: 'A5'});

    await browser.close();
})();