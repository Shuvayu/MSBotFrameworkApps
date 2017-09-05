const env = require('dotenv').config();
const builder = require('botbuilder');
const restify = require('restify');
const recognizerService = require('./services/recognizer-service.js');
const botService = require('./services/bot-service.js');

// create the bot
const connector = new builder.ChatConnector();
const bot = botService.createBot(connector);
const recognizer = recognizerService.createLUISRecognizer(process.env.LUIS_ENDPOINT);
bot.recognizer(recognizer);

bot.dialog('search', botService.createSearchDialogWaterfall()).triggerAction({
    matches: 'search'
    // onSelectAction: (session, args) => {
    //     // this allows you to rewrite the default action.
    //     session.beginDialog(args.action, args)
    // }
});

bot.dialog('help', botService.createHelpDialogWaterfall()).triggerAction({
    matches: 'help',
    onSelectAction: (session, args) => {
        // this allows you to rewrite the default action.
        session.beginDialog(args.action, args)
    }
});

bot.dialog('hello', botService.createHelloDialogWaterfall()).triggerAction({
    matches: 'hello',
    onSelectAction: (session, args) => {
        // this allows you to rewrite the default action.
        session.beginDialog(args.action, args)
    }
});

const server = restify.createServer();
server.post('/api/messages',connector.listen());
server.listen(
    process.env.PORT || 3978,
    () => console.log('Server is up and listening !!!')
);