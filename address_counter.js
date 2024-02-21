import fs from 'fs';

const jsonFile = fs.readFileSync('output/crawl/details.json');
const jsonData = JSON.parse(jsonFile);

const len = jsonData.length;

const PREFIX = [
    '서울', '인천', '대전', '세종', '광주', '울산', '부산', '대구',
    '경기도', '충청북도', '충청남도', '강원도', '전라북도', '전라남도',
    '경상북도', '경상남도', '제주도', '충북', '충남', '전북', '전남', '경북', '경남'
]

let cnt = 0;
let foodCnt = 0;
for(let i=0; i<len; i++) {
    const addr = jsonData[i].address;
    let flag = false;

    for(let j=0; j<PREFIX.length; j++) {
        if(addr.startsWith(PREFIX[j])) {
            flag = true;
            break;
        }
    }
    foodCnt += jsonData[i].food === '' ? 1 : 0;
    cnt += flag ? 0 : 1;
}

console.log(cnt);
console.log(foodCnt);