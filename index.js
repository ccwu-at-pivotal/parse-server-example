// Example express application adding the parse-server module to expose Parse
// compatible API routes. This is a fork of the code at
// https://github.com/ParsePlatform/parse-server-example
//
// note this is an example and not kept in sync with upstream.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var http = require('http');

// For Pivotal Cloud Foundry Deploy, get MongoDB URI
// This is different from the heroku method of a flat 
// environment variable space to provide greater
// flexibility and more of the same service if needed
// Details about VCAP_services can be found at:
//
// https://docs.run.pivotal.io/devguide/deploy-apps/environment-variable.html#VCAP-SERVICES
//
// This app assumes that you have created a Monglab Mongo DB instance using
//
// `cf create-service mongolab sandbox parse-mongo`
// `cf bind-service <APPNAME> parse-mongo`
// `cf restage <APPNAME>`

var vcap_services = JSON.parse(process.env.VCAP_SERVICES);

if (!process.env.VCAP_SERVICES) {
  console.log('DATABASE_URI not specified via VCAP_SERVICES, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: vcap_services.mongolab[0].credentials.uri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: 'myAppId',
  masterKey: 'myMasterKey'
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a web site.');
});

var port = process.env.PORT || 1337;
var httpServer = http.createServer(app);
httpServer.listen(port, function() {
  console.log('parse-server-example running on port ' + port + '.');
});
