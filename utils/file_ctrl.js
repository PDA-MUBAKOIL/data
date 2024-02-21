import fs from 'fs';

/**
 * Save file for given dir & name with data
 * @param {*} outputDir directory name(rel)
 * @param {*} fileName filename with extension
 * @param {*} data data - string
 */
function saveFile(outputDir, fileName, data) {
    if(!fs.existsSync(outputDir)) {
        console.log(`Output directory ${outputDir} does not exists. Created new directory ${outputDir}`);
        fs.mkdirSync(outputDir);
    }
    fs.writeFileSync(`${outputDir}/${fileName}`, JSON.stringify(data), (err) => {console.error(err)});
    console.log(`FILE : ${outputDir}/${fileName} DONE`);
}

/**
 * read json file and return data
 * @param {*} inputDir 
 * @param {*} fileName 
 * @returns data
 */
function readFile(inputDir, fileName) {
    const filePath  = `${inputDir}/${fileName}`;
    if(fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        console.log(`${data.length} bytes data loaded`);

        return data;
    } else {
        console.log(`Cannot find file : ${filePath}`);
        return [];
    }
}

/**
 * read json file and return data as JS object
 * @param {*} inputDir 
 * @param {*} fileName 
 * @returns data as JS object
 */
function loadData(inputDir, fileName) {
    const data = readFile(inputDir, fileName);

    const ret = JSON.parse(data);
    console.log(`converted ${ret.length} JSON element`);
    return ret;
}

export { saveFile, loadData };