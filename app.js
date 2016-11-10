/**
* Copyright 2014 IBM
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
**/

var express = require('express');

var MONGODB_URL;
var app = express();
app.set('port', process.env.PORT || 80);
if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
	if (env['Compose for MongoDB']) {
        hasConnect = true;
		credentials = env['Compose for MongoDB'][0].credentials;
		MONGODB_URL=credentials.uri;
	}

}
if ( hasConnect == false ) {

   MONGODB_URL=credentials?credentials.uri:"mongodb://admin:BBLQHNSQZFUGCNZI@bluemix-sandbox-dal-9-portal.3.dblayer.com:17723/admin?ssl=true"
}
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var options = {
    mongos: {
        ssl: true,
        sslValidate: false,
    }
}


app.get('/', function (req, res) {
	MongoClient.connect(MONGODB_URL, options, function(err, db) {
	    assert.equal(null, err);
	    db.listCollections({}).toArray(function(err, collections) {
	        assert.equal(null, err);
	        collections.forEach(function(collection) {
	            console.log(collection);
	        });
	        db.close();
	        res.send(collections);
	        // process.exit(0);
	    })
	});
  	
});

app.listen(app.get('port'));
console.log(' Application Running on port' + app.get('port'));
