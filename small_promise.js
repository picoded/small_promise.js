var small_promise = (function() {
	
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
	/// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
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
	/// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
	small_promise.prototype.catch = function(onRejected) {
		if(onRejected) {
			if(this.status < 0) { // Promise already resolved, call it NOW
				onRejected(this.value);
			} else {
				this.catch_array.push(onRejected);
			}
		}
	}
	
	/// Static Variable: isNotNative
	/// true boolean, used to check if promise polyfill, is not native implementation
	small_promise.isNotNative = true;
	
	return small_promise;
})();
