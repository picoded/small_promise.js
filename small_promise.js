var small_promise = (function() {
	
	// Core functions
	//--------------------------------------------------------------------------------------------------------
	
	/// Internal Function: callback_template
	/// Used to build the accept / reject call back passed to executor
	function callback_template(promiseObj, callbackArray, newStatus) {
		return function(val) {
			if( promiseObj.status === 0 ) {
				// Update status and value
				promiseObj.status = newStatus;
				promiseObj.value = val;
				// Trigger all the listeners
				callbackArray.forEach(function(callback) {
					callback(val);
				});
				// Garbage collect
				callbackArray = null;
				promiseObj.then_array = null;
				promiseObj.catch_array = null;
			}
		}
	}
	
	/// Function: small_promise
	/// Consturctor of the promise
	function small_promise(executor) {
		// 0 = "unresolved", 1 = "resolved", -1 = "rejected"
		this.status = 0;
		executor(
			callback_template(this, this.then_array = [], 1),
			callback_template(this, this.catch_array = [], -1)
		);
	}
	
	/// Function: then
	small_promise.prototype.then = function(onFulfilled,onRejected) {
		if(onFulfilled) {
			if(this.status > 0) { // Promise already resolved, call it NOW
				onFulfilled(this.value);
			} else {
				this.then_array.push(onFulfilled);
			}
		}
		this.catch(onRejected);
	}
	
	/// Function: catch
	small_promise.prototype.catch = function(onRejected) {
		if(onRejected) {
			if(this.status < 0) { // Promise already resolved, call it NOW
				onRejected(this.value);
			} else {
				this.catch_array.push(onRejected);
			}
		}
	}
	
	// Static functions / variables
	//--------------------------------------------------------------------------------------------------------
	
	/// Static Variable: isNotNative
	/// true boolean, used to check if promise polyfill, is not native implementation
	small_promise.isNotNative = true;
	
	/// Static Function: resolve
	small_promise.resolve = function(val) {
		return (
			(val instanceof small_promise)?
			val :
			(new small_promise(function(onFulfilled) { onFulfilled(val) }))
		);
	}
	
	/// Static Function: reject
	small_promise.reject = function(val) {
		return (new small_promise(function(onFulfilled,onRejected) { onRejected(val) }));
	}
	
	// The only error message supported, because this may actually accidentally happen
	// Without realising, while following MDN docs. And trigger a nasty surprise in IE
	var forEachErrMsg = "all/race assumes an object/array with forEach implementation";
	
	/// Static Function: race
	small_promise.race = function(iterable) {
		if( !iterable.forEach ) { throw new TypeError(forEachErrMsg); }
		return (new small_promise(function(onFulfilled,onRejected) {
			iterable.forEach(function(n) {
				n.then(onFulfilled,onRejected);
			});
		}));
	}
	
	/// Static Function: all
	small_promise.all = function(iterable) {
		if( !iterable.forEach ) { throw new TypeError(forEachErrMsg); }
		return (new small_promise(function(onFulfilled,onRejected) {
			var res = []; //result array
			iterable.forEach(function(n) {
				n.then(function(val) {
					res.push(val);
				},onRejected);
			});
			onFulfilled(res);
		}));
	}
	
	return small_promise;
})();
