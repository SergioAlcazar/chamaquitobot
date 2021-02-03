const TeleBot = require('telebot');
const request = require('request');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
console.log('Creating bot with token ' + TELEGRAM_BOT_TOKEN);
const bot = new TeleBot(TELEGRAM_BOT_TOKEN);

bot.on(['/start', '/hello'], (msg) => msg.reply.text('¡Ya estoy aquí!'));
bot.on(['/platillo'], (msg) => {
    try {
        return getPlatillo().then(function(result) {
            msg.reply.text(result);
        });
    } catch(error) {
        msg.reply.text('¡ÁNDELE!¡Algo salió mal!');
    }
});

bot.start();

async function getPlatillo() {
    let res = await doRequest();
    if (JSON.parse(res).dishName) {
        return JSON.parse(res).dishName;
    } else {
        return '¡AY, AY, AY! ¡Me quedé atorado!';
    }
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
