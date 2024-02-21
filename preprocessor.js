import fs from 'fs';
import { saveFile } from './utils/file_ctrl.js';
import getGptResponse from './utils/gpt_classifier.js';

const FILE_PATH = 'output/crawl/details.json';
const OUTPUT_DIR = 'output/gpt';
const OUTPUT_FILE_NAME = 'gpt.json';

const jsonFile = fs.readFileSync(FILE_PATH, 'UTF-8');
const jsonData = JSON.parse(jsonFile).slice(0, 5);
// const jsonData = JSON.parse(jsonFile);

console.log(`operation starts for ${jsonData.length} items`);

// TODO: Add delay
for(let i=0; i<jsonData.length; i++) {
    const elem = jsonData[i];
    if(elem.food === '') continue;

    const category = await getGptResponse(elem.food);
    console.log(category);
    
    if(i % 5 === 0) {
        console.log(`[${i}/${jsonData.length}] DONE`);
    }
    elem.foodTags = category.split(',');
}

console.log(jsonData);

saveFile(OUTPUT_DIR, OUTPUT_FILE_NAME, jsonData);