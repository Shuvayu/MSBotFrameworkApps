const builder = require('botbuilder');
const restify = require('restify');

// create the bot
const connector = new builder.ChatConnector();
const bot = new builder.UniversalBot(
    connector,
    [
        function(session){
            builder.Prompts.text(session,
                'Hello! what is your name ?',
                { retryPrompt: `Please enter your name...`}
            );
        },
        function(session, results){
            session.endDialog(`Hello, ${results.response}`);
        }
    ]
);

bot.dialog('help', [
    (session) => {
        session.endDialog(`I'm a simple bot ...`);
    }
]).triggerAction({
    matches: /^help$/i,
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