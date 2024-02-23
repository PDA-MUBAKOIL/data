import fs from 'fs';
import { saveFile } from './utils/file_ctrl.js';

const FILE_PATH = 'output/gpt/details.json';
const OUTPUT_DIR = 'output/out';
const PRODUCT_FILE_NAME = 'products.json';
const BREWER_FILE_NAME = 'brewers.json';
const IMG_BASE_URL = 'https://thesool.com'

// address regex
const PREFIX = [
    '서울', '인천', '대전', '세종', '광주', '울산', '부산', '대구',
    '경기', '충북', '충남', '강원', '전북', '전남', '경북', '경남', '제주',
]

const siRegexp = new RegExp("(특별시|광역시|특별자치시|시)$");
const doRegexp = new RegExp("(북도|남도)$");
const jejuRegexp = new RegExp("(특별자치도|도)$");

const jsonFile = fs.readFileSync(FILE_PATH, 'UTF-8');
const jsonData = JSON.parse(jsonFile);

console.log(`operation starts for ${jsonData.length} items`);

let products = [];
let brewers = new Map();

let invalidAddrCnt = 0;

for(let i=0; i<jsonData.length; i++) {
    let item = jsonData[i];
    let product = {...item};
    
    // modify address
    product.address = convertAddress(item.address);
    if(product.address === "invalid") {
        invalidAddrCnt ++;
        continue;
    }

    // collect brewers
    if(brewers.get(item.brewer) === undefined) {
        let brewer = {
            name: item.brewer,
            address: product.address,
            link: item.homepage,
            tel: item.tel,
        }
        brewers.set(brewer.name, brewer);
    }
    product.region = product.address.split(' ')[0];

    // remove white spaces
    product.cap = product.cap.replaceAll('\n|\t', '');

    // add image base URL
    product.imgUrl = IMG_BASE_URL + product.imgUrl;

    // trim food tags
    product.tags = trimFoodTags(item.foodTags);

    // multiple alcohol values
    product.percent = convertAlcohol(item.alcohol);

    products.push(product);
}

console.log(`${invalidAddrCnt} items dropped for invalid address`);

let brewersArr = [...brewers.values()];
// console.log(brewersArr);

saveFile(OUTPUT_DIR, PRODUCT_FILE_NAME, products);
saveFile(OUTPUT_DIR, BREWER_FILE_NAME, brewersArr);

console.log(`Process finished with ${products.length} product, ${brewers.size} brewers`);


/**
 * Modify to adequate address name
 * @param {string} addr 
 * @returns {string} modified addresss
 */
function convertAddress(addr) {
    const prefix = addr.split(" ")[0].trim();
    let modifiedPrefix = '';

    if(siRegexp.test(prefix))
        modifiedPrefix = prefix.replace(siRegexp, "");
    else if(doRegexp.test(prefix))
        modifiedPrefix = prefix.charAt(0) + prefix.charAt(2);
    else if(jejuRegexp.test(prefix))
        modifiedPrefix = prefix.replace(jejuRegexp, "");
    else if(PREFIX.includes(prefix))
        modifiedPrefix = prefix;
    else return "invalid";
        
    return addr.replace(prefix, modifiedPrefix);
}

/**
 * Trim tags
 * @param {string[]} tags tag list
 * @returns {string[]} list of tags without whitespace
 */
function trimFoodTags(tags) {
    return Array.isArray(tags) ? tags.map((elem) => elem.trim().replace(' 및 ', '/')) : null;
}

/**
 * Trim and handle multiple alcohol field values
 * @param {*} str alcohol
 * @returns converted to format
 */
function convertAlcohol(str) {
    str = str.replace(/%+/g,"%");

    let values = str.split('%').map((elem) => elem.trim()+"%");
    values.pop();

    return values.join(', ');
}