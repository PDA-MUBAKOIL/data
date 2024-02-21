import axios from "axios";
import * as cheerio from 'cheerio';

import {saveFile} from './utils/file_ctrl.js';

// const

// https://thesool.com/front/find/M000000082/list.do?pageIndex=2
// https://thesool.com/front/find/M000000082/view.do?productId=PR00001217
const BASE_URL = "https://thesool.com/front/find/M000000082";
const IMG_BASE_URL = 'https://thesool.com'

// total 102 pages : 240220
const TOTAL_PAGE_COUNT = 1;

const PRODUCT_INFO_FIELD = ['type', 'material', 'alcohol', 'cap', 'awards', 'etc'];
const PLACE_INFO_FIELD = ['brewer', 'address', 'homepage', 'tel'];

const OUTPUT_DIR = "output/crawl";
const LIST_FILE_NAME = "prod_list.json";
const DETAIL_FILE_NAME = "details.json";


// operation
console.log(`starting : total ${TOTAL_PAGE_COUNT} page expected`);
const listData = await getProductIdList(TOTAL_PAGE_COUNT);
console.log(`DONE : ${listData.length} product found`);
saveDataToFile(OUTPUT_DIR, LIST_FILE_NAME, listData);

console.log(`starting : total ${listData.length} item expected`);
const detailData = await getDetailInfo(listData);
console.log(`DONE : ${detailData.length} items`);
saveDataToFile(OUTPUT_DIR, DETAIL_FILE_NAME, detailData);


// functions

/**
 * get product id from html
 * @param pageCnt number of target pages
 * @returns list of product id as array
 */
async function getProductIdList(pageCnt) {
    let ret = [];
    let pageNo = 1;

    while(pageNo <= pageCnt) {
        
        const response = await fetchData(`${BASE_URL}/list.do?pageIndex=${pageNo}`, 'get');
        // console.log(response.status)
        if(response.status !== 200) {
            console.log(`${BASE_URL}/list.do?pageIndex=${pageNo}\nRequest failed with status code : ${response.status}}`);
            continue;
        }
        // console.log(response);
        const $ = cheerio.load(response.data);
        const $list = $('.product-list ul');
    
        ret.push(...extractProductId($list, $));
        
        if(pageNo % 10 === 0) {
            console.log(`[${pageNo}, ${pageCnt}] DONE[${ret.length}] items found`);
        }
    
        pageNo ++;
    }
    return ret;
}

/**
 * get list of product details
 * @param {*} list list of product id
 * @returns list of product details
 */
async function getDetailInfo(list) {
    let len = list.length;
    let ret = [];
    console.log(`collecting ${len} items`);

    for(let i=0; i<len; i++) {
        let productId = list[i];
        const response = await fetchData(`${BASE_URL}/view.do?productId=${productId}`);

        if(response.status !== 200) {
            console.log(`${BASE_URL}/view.do?productId=${productId}\nRequest failed with status code : ${response.status}`);
            continue;
        }

        // TODO : extract detail data        
        const $ = cheerio.load(response.data);
        const $content = $('.product-view');

        ret.push(extractProductDetail($content, $));
    }
    return ret;
}

/**
 * save data as file with log
 * @param {*} outputDir 
 * @param {*} fileName 
 * @param {*} data 
 */
function saveDataToFile(outputDir, fileName, data) {
    console.log(`${fileName} finished with ${data?.length} items`);
    saveFile(outputDir, fileName, data);
}

/**
 * get data from body.startNum by body.limit
 * @param {*} url target URL
 * @param {*} method http method
 * @param {} body request body : {startNum, limit, order} are required
 * @returns 
 */
async function fetchData(url, method, body) {
    try {
        const response = await axios({
            method: method,
            url: url,
            data: body? body : null
        });

        return response;
    } catch (err) {
        console.error(err);
    }
}

/**
 * returns product id from html
 * @param {*} list html element that contains list
 * @param {*} $ cheerio
 * @returns array of product id
 */
function extractProductId(list, $) {
    let ret = [];
    $(list).find('.title-area').each((i, el) => {
        const onclickLink = $(el).find('.name').prop('onclick');

        ret.push(parseId(onclickLink))
    })
    // console.log(ret.length);
    return ret;
}

/**
 * parse product id from onclick attribute
 * @param {*} str onclick attribute
 * @returns product id as string
 */
function parseId(str) {
    return str.split("\'")[1];
}

/**
 * get product detail from html
 * @param {*} content div with class name = product-view
 * @param {*} $ cheerio
 * @returns product details as object
 */
function extractProductDetail(content, $) {
    let ret = {};

    ret.name = $(content).find('.subject').text().trim();
    
    const $detail = $(content).find('.detail');
    
    ret.imgUrl = $detail.find('.thumb img').prop('src').trim();
    
    const $infoList = $detail.find('.info .info-list span');
    $infoList.each((i, el) => {
        ret[PRODUCT_INFO_FIELD[i]] = $(el).text().trim();
    })

    ret.description = $(content).find('.intro .text').text().replaceAll("\n", '').trim();
    ret.food = $(content).find('.food .text').text().trim();

    const $placeInfoList = $(content).find('.place .text li');

    $placeInfoList.each((i, el) => {
        let str = (i===3) ? $(el).text().replace("문의", '').trim() : $(el).find('span').text().trim();

        ret[PLACE_INFO_FIELD[i]] = str;
    })

    return ret;
}