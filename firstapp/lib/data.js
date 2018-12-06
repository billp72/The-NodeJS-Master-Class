/*
* Library for storing and editing data
*/

//dependencies 
const fs   = require("fs");
const path = require("path");

//container for module (to be exported)

var lib = {};

//Base directory ofthe data folder
lib.baseDir = path.join(__dirname, "/../.data/");

//write data to a file
lib.create = function(dir, filename, data, callback){
	//open the file for writing
	fs.open(lib.baseDir+dir+"/"+filename+".json", "wx", function(err, fileDescriptor){
		if(!err && fileDescriptor){
			//convert data to string
			var stringData = JSON.stringify(data);
			//write to file and close it
			fs.writeFile(fileDescriptor,stringData, function(error){
				if(!error){
					fs.close(fileDescriptor, function(error){
						if(!error){
							callback(false);
						}else{
							callback("Error closing new file");
						}
					})
				}else{
					callback("Error writing to new file");
				}
			});
		}else{
			callback("Could not create file. It may already exist.");
		}
	});
}
//read data from a file
lib.read = function(dir, file, callback){
	fs.readFile(lib.baseDir+dir+"/"+file+".json","utf8",function(err, data){
		callback(err, data);
	});
}

//update file
lib.update = function(dir, file, data, callback){
	//open the file for writing
	fs.open(lib.baseDir+dir+"/"+file+".json","r+",function(err, fileDescriptor){
		if(!err && fileDescriptor){
			var stringData = JSON.stringify(data);

			//truncate the file so not to overwrite existing contents
			fs.truncate(fileDescriptor,function(err){
				if(!err){
					fs.writeFile(fileDescriptor, stringData, function(err){
						if(!err){
							fs.close(fileDescriptor, function(err){
								if(!err){
									callback(false);
								}else{
									callback("Error closing the existing file");
								}
								
							})
						}else{
							callback("error writing to existing file.");
						}
					})
				}else{
					callback("error truncating file.");
				}
			})
		}else{
			callback("could not open the file for updating, it may not exist.")
		}
	});
}

//deleteing a file
lib.delete = function(dir, file, callback){
	//unlinking from file system
	fs.unlink(lib.baseDir+dir+"/"+file+".json",function(err){
		if(!err){
			callback(false);
		}else{
			callback("Error deleteing the file");
		}
	})
}


//exported
module.exports = lib;