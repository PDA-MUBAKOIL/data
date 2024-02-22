import fs from 'fs';
import { saveFile } from './utils/file_ctrl.js';
import classifyFoods from './utils/gpt_classifier.js';

const FILE_PATH = 'output/crawl/details.json';
const OUTPUT_DIR = 'output/gpt';
const OUTPUT_FILE_NAME = 'gpt.json';
const LOG_FILE_NAME = `failure_log.json`
const STRIDE = 20;

const jsonFile = fs.readFileSync(FILE_PATH, 'UTF-8');
// for test
// const jsonData = JSON.parse(jsonFile).slice(0, 200);
const jsonData = JSON.parse(jsonFile);

console.log(`operation starts for ${jsonData.length} items`);
let failed = [];

for(let i=0; i<jsonData.length; i+=STRIDE) {
    // End of Data
    const end = i+STRIDE > jsonData.length ? jsonData.length : i+STRIDE;

    // assign food lists as array
    let foodList = [];
    for(let j=i; j<end; j++) {
        foodList.push(jsonData[j].food === '' ? '한식' : jsonData[j].food.replaceAll('..|...', ''));
    }
    // console.log("input", foodList.length);

    // classify
    const foodTagList = await classifyFoods(foodList);
    // console.log("res", foodTagList.length);

    // Error occurred
    if(foodList.length !== foodTagList.length) {
        console.log(`[${i} - ${end}] failed. generated ${foodTagList.length} items for ${foodList.length}`);
        failed.push(i);
        continue;
    }
    
    // response as JS object
    for(let j=0; j<foodTagList.length; j++) {
        jsonData[i+j].foodTags = foodTagList[j].split(':')[1].split(',');
    }
    
    if(end % 100 === 0) console.log(`[${end}/${jsonData.length}] DONE`);
}

console.log(`Finished : total ${jsonData.length} items, ${failed.length * STRIDE} items failed`);

// save data
saveFile(OUTPUT_DIR, OUTPUT_FILE_NAME, jsonData);
saveFile(OUTPUT_DIR, LOG_FILE_NAME, failed);