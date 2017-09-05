const builder = require('botbuilder');
const githubClient = require('./github-service.js');
const cardService = require('./card-service.js');
const recognizerService = require('./recognizer-service.js');

module.exports = {
    createBot: (connector) => {
        const bot = new builder.UniversalBot(
            connector,
            (session) => {
                session.endConversation(`Hi there! I'm the GitHub bot. I can help you find GitHub users.`);
            }
        );
        return bot;
    },

    createSearchDialogWaterfall: () => {
        return [
            (session, args, next) => {
                const query = builder.EntityRecognizer.findEntity(args.intent.entities, 'person');
                if (!query) {
                    builder.Prompts.text(session, `Who do you want to search for ?`);
                } else {
                    next({ response: query.entity });
                }
            },
            (session, results, next) => {
                var query = results.response;
                if (!query) {
                    session.endDialog('Request cancelled');
                } else {
                    session.sendTyping();
                    githubClient.executiveSearch(query, (profiles) => {
                        let totalCount = profiles.total_count;
                        if (totalCount == 0) {
                            session.endDialog('Sorry, no results found.');
                        } else if (totalCount > 10) {
                            session.endDialog('More than 10 results were found. Please provide a more appropriate search term.');
                        } else {
                            session.dialogData.proprty = null;
                            var usernames = profiles.items.map((item) => {
                                return item.login;
                            })

                            builder.Prompts.choice(
                                session,
                                `Please choose a user`,
                                usernames,
                                { listStyle: builder.ListStyle.button }
                            );
                        }
                    });
                }
            }, (session, results, next) => {
                //session.endConversation(`You chose ${ results.response.entity }`);
                session.sendTyping();
                githubClient.loadProfile(results.response.entity, (profile) => {
                    var card = cardService.createCard(session, profile);
                    var message = new builder.Message(session).attachments([card]);
                    session.endConversation(message);
                });
            }
        ];
    },

    createHelpDialogWaterfall: () => {
        return [
            (session) => {

                let textArray = [
                    'To search try typing: look for {user}',
                    'To search try typing: search {user}',
                    'To search try typing: search for {user}',
                    'To search try typing: find me my friend {user}'
                ];
                let randomNumber = Math.floor(Math.random() * textArray.length);

                session.endDialog(textArray[randomNumber]);
            }
        ];
    },

    createHelloDialogWaterfall: () => {
        return [
            (session) => {             
                session.endDialog(`Hi there! I'm the GitHub bot. I can help you find GitHub users. At any point, you can type {help} to see suggestions.`);
            }
        ];
    }
}