import mongoose from "mongoose";
import dotenv from 'dotenv';

import { loadData } from './utils/file_ctrl.js';
import { Drinks, Brewer } from './models.js';

dotenv.config();
const MONGO_HOST = process.env.MONGO_HOST_URL;
const DATA_DIR = 'output/out';
const DROP_BEFORE_ACTION = true;

// DB connection
mongoose.connect(MONGO_HOST, {
    retryWrites: true,
    w: 'majority'
}).then((resp) => {
    // console.log(resp);
    console.log("Connected");
    return DROP_BEFORE_ACTION;
}).then(async (drop) => {
    if(drop) {
        console.log("Drop existing collections")
        let cnt = 0;
        cnt += await Drinks.collection?.drop() ? 1 : 0;
        cnt += await Brewer.collection?.drop() ? 1 : 0;
        return cnt;
    }
    return 0;
}).then(async (length) => {
    console.log(`dropped ${length} collections`);

    const brewerData = loadData(DATA_DIR, 'brewers.json');
    const brewsers = await Brewer.insertMany(brewerData);

    const brewersMap = createBrewerMap(brewsers);

    const drinkData = loadData(DATA_DIR, 'products.json');
    // console.log(campaignData[0]);
    const drinkDataWithBrewerId = appendBrewerId(drinkData, brewersMap);

    console.log(drinkDataWithBrewerId[0]);

    await Drinks.insertMany(drinkDataWithBrewerId);

    return;
}).then(() => {
    console.log(`DONE, close connection`);
    mongoose.disconnect();
})
.catch((error) => {
    console.log(error);
    console.log(`failed to connect DB : ${MONGO_HOST}`);
    mongoose.disconnect();
});



/**
 * Create map(key: name, value: objectId) from array.
 * @param {Array} list 
 * @return brewer map
 */
function createBrewerMap(list) {
    let ret = new Map();
    list.forEach((elem, idx) => {
        if(!ret.get(elem.name))
            ret.set(elem.name, elem._id);
    });
    return ret;
}

/**
 * Append Brewer's id using name
 * @param {Array} list 
 * @param {Map} map 
 * @return {Array} array of product with brewer id
 */
function appendBrewerId(list, map) {
    let ret = [];
    ret = list.map((elem, id) => {
        return {
            ...elem,
            brewerId: map.get(elem.brewer)
        };
    });
    return ret;
}