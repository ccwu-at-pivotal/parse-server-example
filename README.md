# parse-server-example for PWS (http://run.pivotal.io)

Example project using the parse-server module on Express.

Read the full server guide here: https://parse.com/docs/server/guide

### For Local Development

* Make sure you have at least Node 4.1. `node --version`
* Clone this repo and change directory to it.
* `npm install`
* Install mongo locally using http://docs.mongodb.org/master/tutorial/install-mongodb-on-os-x/
* Run `mongo` to connect to your database, just to make sure it's working. Once you see a mongo prompt, exit with Control-D
* Run the server with: `npm start`
* By default it will use a path of /parse for the API routes.  To change this, or use older client SDKs, run `export PARSE_MOUNT=/1` before launching the server.
* You now have a database named "dev" that contains your Parse data
* Install ngrok and you can test with devices

### Getting Started With Pivotal Web Services + Mongolab Development

* Clone the repo and change directory to it
* Use the Cloud Foundry CLI to log in and prepare the app. Don't have an account try using Pivotal Web Services (http://run.pivotal.io)
* Use the MongoLab service via the cf CLI: `cf create-service mongolab sandbox parse-mongo`
* Deploy the application to Cloud Foundry `cf push` // the manifest will define key parameters and request a random-route, note that it will fail since it can't find the Mongo instance. Next step.
* Bind the application to the monogo service `cf bind-service parse-server4pws parse-mongo`
* By default it will use a path of /parse for the API routes.  To change this, or use older client SDKs, run `cf set-env parse-server4pws PARSE_MOUNT /1`
* Restart your application to take the URI it with: `cf restage parse-server4pws` and your server is up and running.

### Using it

You can use the REST API, the JavaScript SDK, and any of our open-source SDKs:

Example request to a server running locally:

```
curl -X POST \
  -H "X-Parse-Application-Id: myAppId" \
  -H "Content-Type: application/json" \
  -d '{"score":1337,"playerName":"Sean Plott","cheatMode":false}' \
  http://localhost:1337/parse/classes/GameScore
  
curl -X POST \
  -H "X-Parse-Application-Id: myAppId" \
  -H "Content-Type: application/json" \
  -d '{}' \
  http://localhost:1337/parse/functions/hello
```

To use it remotely. Substitute the route provided when you run the command `cf app parse-server`
Example using it via JavaScript:

```
Parse.initialize('myAppId','unused');
Parse.serverURL = 'https://whatever.herokuapp.com';
var obj = new Parse.Object('GameScore');
obj.set('score',1337);
obj.save().then(function(obj) {
  console.log(obj.toJSON());
  var query = new Parse.Query('GameScore');
  query.get(obj.id).then(function(objAgain) {
    console.log(objAgain.toJSON());
  }, function(err) {console.log(err); });
}, function(err) { console.log(err); });
```

You can change the server URL in all of the open-source SDKs, but we're releasing new builds which provide initialization time configuration of this property.
