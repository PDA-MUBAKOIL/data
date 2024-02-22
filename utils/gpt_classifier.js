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

const SYSTEM_MESSAGE = 'Your job is to classify given input to target categories.\
Input message might be food, foods, description about foods, or description about foods that well-matched to korean traditional alcohol\
Result does not have to be single value, align all the possible categories separated by comma.\
Any other descriptions are not required. Simply answer possible categories in given categories in format [input_number] : ouput\
Target Categories are' + FOOD_CATEGORIES.join([', ']) + '.\
There might be multiple inputs, generate outputs for each input.\
And your output message for each input must be also separated by new line character.\
None of inputs can be omitted, the accuracy of answer is less important than output format. Do not ommit any inputs\
';

/**
 * generate chat GPT completion response that classifies categories of food.
 * @param {*} msg target message to classify
 * @return {Promise<String>} : comma seperated categories
 */
async function getGptResponseMessage(msg) {
    const completions = await openai.chat.completions.create({
        messages: [
            {"role": "system", "content": SYSTEM_MESSAGE},
            {"role": "user", "content": msg}
        ],
        model: "gpt-3.5-turbo",
        temperature: 1.0,
    })

    return completions.choices[0].message.content;
};

/**
 * generate chat GPT completion response that classifies categoreis of multiple food list.
 * @param {*} prompts target prompts(messages) to classify - { "role", "content" }
 * @returns {Promise<String>} result : new line separated lists and comma separated categories
 */
async function getGptResponseMessages(prompts) {
    // console.log(prompts)
    const completions = await openai.chat.completions.create({
        messages: [
            {"role": "system", "content": SYSTEM_MESSAGE},
            ...prompts
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.8,
    })

    return completions.choices[0].message.content;
};

/**
 * Classify food categories by Chat GPT
 * @param {Array} foodList list of foods
 * @returns {Promise<String[]>} list of categories
 */
async function classifyFoods(foodList) {
    const prompts = [];
    for(let i=0; i<foodList.length; i++) {
        const prompt = {"role": "user", "content": `input ${i+1}: ${foodList[i]}`};

        prompts.push(prompt);
    }

    const res = await getGptResponseMessages(prompts);
    // console.log(res);

    return res.split('\n');
}

export default classifyFoods;