function traverseTree(o)
{
  // can also check if property is null, like o["thing"] != "object"
  if (typeof o["thing"] == "string") {
    console.log(o["thing"]);
    return o["thing"];
    // keep going if we find an object
  } else if(typeof o["thing"] == "object") {
    console.log(o["thingid"]);
    return traverseTree(o["thing"]);
  } else {
      return false;
  }  
}

var jsonData = {
  "thingid": 0,
  "thing": {
    "thingid": 1,
    "thing": {
      "thingid": 2,
      "thing": {
        "thingid": 3,
        "thing": {
          "thingid": 4,
          "thing": {
            "thingid": 5,
            "thing": {
              "thingid": 6,
              "thing": "find_me"
            }
          }
        }
      }
    }
  }
}


var x = traverseTree(jsonData);

console.log('found value is :' + x);