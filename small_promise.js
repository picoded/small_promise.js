var small_promise = (function() {
	
	// Core functions
	//--------------------------------------------------------------------------------------------------------
	
	/// Internal Function: callback_builder
	/// Used to build the accept / reject call back passed to executor
	function callback_builder(promiseObj, callbackArray, newStatus) {
		return function(val) {
			if( promiseObj.status === 0 ) {
				// Update status and value
				promiseObj.status = newStatus;
				promiseObj.value = val;
				// Trigger all the callback listeners
				callbackArray.forEach(function(C) {
					C(val);
				});
				// Garbage collect
				callbackArray = promiseObj.then_array = promiseObj.catch_array = null;
			}
		};
	}
	
	/// Function: small_promise
	/// Consturctor of the promise
	function small_promise(executor) {
		// 0 = "unresolved", 1 = "resolved", -1 = "rejected"
		this.status = 0;
		executor(
			callback_builder(this, this.then_array = [], 1),
			callback_builder(this, this.catch_array = [], -1)
		);
	}
	
	/// Variable: Prototype class object
	/// Used to optimize down character count after uglifying
	var protoClass = small_promise.prototype;
	
	/// Function: then
	protoClass.then = function(onFulfilled,onRejected) {
		if(onFulfilled) {
			if(this.status > 0) { // Promise already resolved, call it NOW
				onFulfilled(this.value);
			} else { //Q up the callbacks
				this.then_array.push(onFulfilled);
			}
		}
		this.catch(onRejected);
	};
	
	/// Function: catch
	protoClass.catch = function(onRejected) {
		if(onRejected) {
			if(this.status < 0) { // Promise already resolved, call it NOW
				onRejected(this.value);
			} else { //Q up the callbacks
				this.catch_array.push(onRejected);
			}
		}
	};
	
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
			(new small_promise(function(onFulfilled) { onFulfilled(val); }))
		);
	};
	
	/// Static Function: reject
	small_promise.reject = function(val) {
		return (new small_promise(function(onFulfilled,onRejected) { onRejected(val); }));
	};
	
	// The only error message supported, because this may actually accidentally happen
	// Without realising, while following MDN docs. And trigger a nasty surprise in IE
	var forEachErrMsg = "all/race requires an object/array with forEach implementation";
	
	/// Static Function: race
	small_promise.race = function(iterable) {
		if( !iterable.forEach ) { throw new TypeError(forEachErrMsg); }
		return (new small_promise(function(onFulfilled,onRejected) {
			iterable.forEach(function(N) {
				N.then(onFulfilled,onRejected);
			});
		}));
	};
	
	/// Static Function: all
	small_promise.all = function(iterable) {
		if( !iterable.forEach ) { throw new TypeError(forEachErrMsg); }
		return (new small_promise(function(onFulfilled,onRejected) {
			var res = []; //result array
			iterable.forEach(function(N) {
				N.then(function(val) {
					res.push(val);
				},onRejected);
			});
			onFulfilled(res);
		}));
	};
	
	return small_promise;
})();
