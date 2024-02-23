// food categories
const FOOD_CATEGORIES = [
    '육류', '한식', '분식', '기름진음식', '해산물',
    '일식', '중식', '양식', '과일/디저트',
    '견과류/마른안주', '찜/탕'
];

const deleteRegexp = /(요리|안주|등등)/g;

/**
 * Verifies list of tags. Filter invalid tags and return null if tag is absent
 * @param {String[]} tags 
 * @return {String[]} valid tags as list
 */
function verifyTags(tags) {
    if(!tags || tags.length < 1) return null;

    let ret = [];
    let len = tags.length;
    for(let i=0; i<len; i++) {
        let tag = tags[i];
        if(FOOD_CATEGORIES.includes(tag)) {
            ret.push(tag);
        }
        else {
            tag = tag.replace("디젝트", "디저트");
            tag = tag.replaceAll(deleteRegexp, "");
            tag = tag.replaceAll(".", "");
            tag = tag.trim();

            if(FOOD_CATEGORIES.includes(tag)) {
                ret.push(tag);
            }
        }
    }

    return ret.length > 0? ret : null;
}

export { verifyTags };