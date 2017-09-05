const querystring = require('querystring');
const https = require('https');

module.exports = {
    executiveSearch: function(query, callback){
        this.loadData('/search/users?q=' + querystring.escape(query),callback);
    },

    loadProfile: function(username, callback){
        this.loadData('/users/' + querystring.escape(username), callback);
    },

    loadData: function(path, callback) {
        var options = {
            host: 'api.github.com',
            port: 443,
            path: path,
            method: 'GET',
            headers: {
                'User-Agent': 'sample-bot-test'               
            }
        };
        var profile;
        var request = https.request(options, function(response){
            var data = "";
            response.on('data', function(chunk) {data += chunk;});
            response.on('end', function(){
                if(data){
                    callback(JSON.parse(data));
                }else{
                    callback(""); 
                }               
            });
        });
        request.end();
    }
}