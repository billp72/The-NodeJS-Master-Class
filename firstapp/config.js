/*
config and export configuration variables

*/

//container for all evnironments

var environments = {}

//staging (default) environment
environments.staging = {
	"httpPort": 3000,
	"httpsPort": 3001,
	"envName": "staging"
}

//production normally at port 80 (http) and 431 (https)
environments.production = {
	"httpPort": 5000,
	"httpsPort": 5001,
	"envName": "production"
}

//determin which environment was passed as commandline arg
var currentEnvironment = typeof(process.env.NODE_ENV) === "string" ? process.env.NODE_ENV.toLowerCase() : "";

// check one of the environments is set in our config
var environmentToExport = typeof(environments[currentEnvironment]) === "object" ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;