#! /usr/bin/env node
const puppeteer = require('puppeteer');
const merge = require('easy-pdf-merge');
const fs = require('fs');

if(process.argv.length < 4){
    console.log("Please provide input and output path");
    process.exit(1);
}

pages = process.argv.slice(2, -1);
output_filename = process.argv.slice(-1)[0];


async function printPage(browser, url, filename){
    let page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});
    await page.pdf({path: filename, format: 'A5'});
    return filename;
}

const mergeMultiplePDF = (pdfFiles) => {
    return new Promise((resolve, reject) => {
        merge(pdfFiles, output_filename,function(err){

            if(err){
                console.log(err);
                reject(err)
            }

            console.log('Success');
            resolve()
        });
    });
};

(async ()=>{
    const browser = await puppeteer.launch({headless: true});
    let pdf_promises = [];
    pages.forEach((d_page, page_index)=>{
        pdf_promises.push(printPage(browser, d_page, page_index+'.pdf'));
    });

    let pdf_results = await Promise.all(pdf_promises);


    await browser.close();
    await mergeMultiplePDF(pdf_results);
    pdf_results.forEach(pdf=>{
        fs.unlink(pdf, err => {if (err) throw err;});
    })
})();

