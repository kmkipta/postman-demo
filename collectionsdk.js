var fs = require('fs'), // needed to read JSON file from disk
	Collection = require('postman-collection').Collection,
	myCollection;

// Load a collection to memory from a JSON file on disk (say, sample-collection.json)
myCollection = new Collection(JSON.parse(fs.readFileSync('team_demo.postman_collection.json').toString()));

// log items at root level of the collection
console.log(myCollection.toJSON());

// adding single item
var newItem = {
    "id": "newitem",
    "name": "BasicItemAdded",
    "description": "Simple HTTP Get Request",
    "request": "http://echo.getpostman.com/get",
    "response": []
}

myCollection.items.add(newItem);

console.log(myCollection.toJSON());


// check if url is valid
var foundItem = myCollection.oneDeep('newitem');
console.log(foundItem);
console.log(foundItem.request.url);
console.log(myCollection.oneDeep('newitem').request.url);

// log the collection to console to see its contents
fs.writeFileSync('sdkcollection.postman_collection', JSON.stringify(myCollection, null, 2));
