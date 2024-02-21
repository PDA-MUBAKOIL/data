import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const API_KEY = process.env.GPT_API_KEY;
const openai = new OpenAI({ apiKey: API_KEY });

const FOOD_CATEGORIES = [
    '육류', '한식', '분식', '기름진음식', '해산물',
    '일식', '중식', '양식', '과일 및 디저트',
    '견과류 및 마른안주', '찜 및 탕'
];

const SYSTEM_MESSAGE = 'Your job is to classify given sentense to given categories of food in korean.\
Input message might be food, foods, or description about foods.\
Result does not have to be single value, align all the possible categories seperated by comma.\
Any other descriptions are not required. Simply answer possible categories in given categories.\
Categories are' + FOOD_CATEGORIES.join([', ']);

/**
 * generate chat GPT completion response that classifies categories of food.
 * @param {*} msg target message to classify
 * @return string : comma seperated categories
 */
async function getGptResponse(msg) {
    const completions = await openai.chat.completions.create({
        messages: [
            {"role": "system", "content": SYSTEM_MESSAGE},
            {"role": "user", "content": msg}
        ],
        model: "gpt-3.5-turbo",
        temperature: 1.2,
    })

    return completions.choices[0].message.content;
};

export default getGptResponse;