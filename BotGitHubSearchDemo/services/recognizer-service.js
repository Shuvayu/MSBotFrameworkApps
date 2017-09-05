const builder = require('botbuilder');

module.exports = {
    createLUISRecognizer : (LUIS_ENDPOINT) => {
        const recognizer = new builder.LuisRecognizer(LUIS_ENDPOINT);
        recognizer.onEnabled((context, callback) => {
            // Checking if we are in a conservation
            if(context.dialogStack().length > 0){
                callback(null, false);
            }else{
                callback(null, true);
            }
        });
        return recognizer;
    }
}