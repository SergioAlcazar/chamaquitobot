const TeleBot = require('telebot');
const request = require('request');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TeleBot(TELEGRAM_BOT_TOKEN);

bot.on(['/start', '/hello'], (msg) => msg.reply.text('¡Ya estoy aquí!'));
bot.on('/platillo', (msg) => {
    return getPlatillo().then(function(result) {
        msg.reply.text(result);
    });
});

bot.start();

async function getPlatillo() {
    let res = await doRequest();
    return JSON.parse(res).dishName;
}

function doRequest() {
    return new Promise(function (resolve, reject) {
        request('https://mexican-dish-generator-api.herokuapp.com/getRandomDish', { json: true }, (err, res, body) => {
            if (!err && res.statusCode == 200) {
                resolve(JSON.stringify(body));
            } else {
                reject(JSON.stringify(err));
            }
        });
    });
}