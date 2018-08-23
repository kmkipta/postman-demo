/*
 *  @request post response page I 
 *  @test    Check Response Times
 */
    
    
tests["Status code is 200"] = responseCode.code === 201;
tests["Response time is acceptable"] = responseTime < 1000; // milliseconds

// test response time
pm.test("Response time is less than 1000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});

// test status code
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
    pm.expect(pm.response.status).to.be.eql('Created');
    pm.expect(pm.response.code).to.be.eql(201);
});

// what about additional response details?
pm.test("Test Response Structure", function() {
    pm.response.to.be.json;
    pm.test("Market Value Exists",  function() {
        pm.expect(pm.response.json()).to.have.property('id');
    }); 
});



/*
 *  @request basic get page II 
 *  @test    Find data in collection by obj value; find
 */
    
var jsonData = pm.response.json();

// check if numsix has ramos name
pm.test("Ramos test", function () {
    
    // old for loop dont use
    /*
    var numSix;
    for (let i = 0; i < jsonData.data; i++) {
        if(jsonData.data[i].id == 6) {
            numsix = jsonData.data[i];
            break; 
        }
    }
    */
    // pass in array to search; return selected item
    var numsix = _.find(jsonData.data, function(o) { 
        //return o.id == data.id; 
        return o.id == 6; 
    });

    console.log(numsix);
    
    // check name Test Case
     pm.expect(numsix.last_name).to.eql("Ramos");
    //pm.expect(numsix.last_name).to.eql(data.name);
});


/*
 *  @request list of resources (redirect) III
 *  @test    Using Environment Vars; find
 */
    

/* Part 1 */
var jsonData = pm.response.json();

// get id of fuschia rose
var myColor = _.find(jsonData.data, function(o) { 
    return o.color == 'fuschia rose'; 
    //return o.color == data.colorname; 
});

pm.environment.set("fuschiaid", myColor);

/* Part 2*/
// validate environment var from part 1 in
// get single resource (redirect) III


/*
 *  @request string manipulation IV
 *  @test    string manipulation; pre/post
 */
    

/* PRE REQUEST */
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0
var yyyy = today.getFullYear();

dd = (dd < 10) ? ('0' + dd) : dd;

mm = (mm < 10) ? ('0' + mm) : mm;

today = yyyy + '-' + mm + '-' + dd;

console.log(today);

pm.environment.set("todaydate", today);

/* POST REQUEST */

// post date, then parse response date and test 
// note preq date; make sure new date returned matches set date

var jsonData = pm.response.json();

pm.test("date parsing test", function () {
    var returnedDate = jsonData.updatedAt;
    returnedDate = returnedDate.split('T')[0];

    console.log(returnedDate);
    
    // get name form response and compare to data 
    pm.expect(returnedDate).to.eql(pm.environment.get("todaydate"));
});

/*
 *  @request mock request V
 *  @test    
 */

// no test


/*
 *  @request recursive request VI
 *  @test    traversing json tree 
 */

var jsonData = pm.response.json();

pm.test("find lowest leaf", function () {

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

    var x = traverseTree(jsonData);
    console.log('found value is :' + x);
    pm.expect(x).to.eql('find_me');
});

/*
 *  @request consecutive request VII
 *  @test    get single resource for every color in color list
 *           via new requests
 */

// get single resource for every color in color list

var jsonData = pm.response.json();
console.log(jsonData.data);

// get total number of colors to look for, then set env variable to use later
var numberOfColors = _.size(jsonData.data);
pm.environment.set("numcolors", numberOfColors);
// set colorid to first in list; continue counting in next request
pm.environment.set("colorid", jsonData.data[0].id);

// example of what NOT to do
// _.forEach(jsonData.data, function(o) { 
    
//     console.log("executing request for color id: " + o.id);
    
//     // set colorid for request
//     pm.environment.set("colorid", o.id);
//     postman.setNextRequest("get single resource (redirect) LAST");
// });

//postman.setNextRequest();

/*
 *  @request get single resource (redirect) VIII
 *  @test    postman request control flow
 */

var jsonData = pm.response.json();

// set colorid for request
var currentColorID = pm.environment.get("colorid");
console.log("executing request for color id: " + currentColorID);

pm.test("check if json response value is " + currentColorID, function () {
    pm.expect(jsonData.data.id).to.eql(currentColorID);
});

currentColorID++;

if(currentColorID <= pm.environment.get("numcolors")) {
    pm.environment.set("colorid", currentColorID)
    postman.setNextRequest("get single resource (redirect) LAST");
} else {
    postman.setNextRequest();
}
