//
// Sneaky way to include the source code
//
// See: http://stackoverflow.com/a/20473643/793842
//
var fs = require("fs");
function read(f) {
	return fs.readFileSync(f).toString();
}
function include(f) {
	eval.apply(global, [read(f)]);
}

//
// Include the small_promise code
//
include("small_promise.js");

/// Static Function: deferred
/// This is for A+ Compliance Test Suite
small_promise.deferred = function() {
	var ret = {};
	ret["promise"] = new small_promise(function(resolve,reject) { 
		ret["resolve"] = resolve; 
		ret["reject"] = reject; 
	});
	return ret;
}
	
// The APLUS promise test case,
// 
// To install run: npm install promises-aplus-tests
// See details at: https://github.com/promises-aplus/promises-tests
var promisesAplusTests = require("promises-aplus-tests");

//
// Let the test begins
//
promisesAplusTests(small_promise, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
});