const builder = require('botbuilder');

module.exports = {
    createCard: (session, profile) => {
        var card = new builder.HeroCard(session);

        card.title(profile.login);
        card.images([builder.CardImage.create(session, profile.avatar_url)]);

        if (profile.name) { card.subtitle(profile.name); }

        let text = '';
        if (profile.company) { text += profile.company; }
        if (profile.email) { text += profile.email; }
        if (profile.bio) { text += profile.bio; }
        card.text(text);

        card.tap(new builder.CardAction.openUrl(session, profile.html_url));
        return card;
    }
}