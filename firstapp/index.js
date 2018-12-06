/*
* Primary file for the API
*/
//curl to test server code-- curl localhost:[port]/path?params
//dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const stringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");
const _data = require("./lib/data");

//TODO: delete this
_data.update("test","newFile",{"fizz":"buzz"}, function(err){
	console.log("this was the error "+err);
})

//instantiating the http server
var httpServer = http.createServer(function(req, res){
	unifiedServer(req, res);
});
//start the server and have it listen on port 3000
httpServer.listen(config.httpPort, function(){
	console.log("The server is listening on: "+config.envName+" in "+config.httpPort);
});
//instantiate https server
var httpsServerOptions = {
	"key": fs.readFileSync("./https/key.pem"),
	"cert": fs.readFileSync("./https/cert.pem")
}
var httpsServer = https.createServer(httpsServerOptions, function(req, res){
	unifiedServer(req, res);
});
//start https server
httpsServer.listen(config.httpsPort, function(){
	console.log("The server is listening on: "+config.envName+" in "+config.httpsPort);
});
//unified server logic for http and https
var unifiedServer = function(req, res){

	//get url and parse it
	var parseURL = url.parse(req.url, true);

	//get path from the url
	var path = parseURL.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g, '');

	//get the http method
	var method = req.method.toLowerCase();

	//Get query string
	var queryStringObject = parseURL.query;

	//get the headers as an object
	var headers = req.headers;

	//get the payload, if any. Stream in a payload
	var decoder = new stringDecoder("utf-8");
	var buffer = "";
	var data = req.on("data", function(data){
		buffer += decoder.write(data);
	});
	req.on("end",function(){
		buffer += decoder.end();

		//choose the handler this request should go to, else use the notFound
		var chosenHandler = typeof(router[trimmedPath]) !== "undefined" ? router[trimmedPath] : handlers.notFound;

		var data = {
			"trimmedPath": trimmedPath,
			"queryStringObject": queryStringObject,
			"method": method,
			"headers": headers,
			"payload": buffer
		}

		//rout the request specified in the router
		chosenHandler(data, function(statusCode, payload){
			//use the status code called by the handler, or default to 200
			statusCode = typeof(statusCode) === "number" ? statusCode : 200;
			//use the payload called back by the handler, or default to an empty object
			payload = typeof(payload) === "object" ? payload : {};

			//convert object payload to string
			var payloadString = JSON.stringify(payload);

			//return response
			res.setHeader("content-type", "application/json");//this makes json pretty 
			res.writeHead(statusCode);
			res.end(payloadString);

			//log request path
			console.log("request is recieved: ", statusCode, payloadString);
		});
	});
}
//handlers
var handlers = {};

//ping handler
handlers.ping = function(data, callback){
	callback(200);
}

//not found
handlers.notFound = function(data, callback){
	callback(404)
}
//router
var router = {
	"ping": handlers.ping
};