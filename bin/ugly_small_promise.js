var small_promise = (function() {
	function Q(v) {
		return typeof v === "function";
	}
	function B(o, a, n) {
		return function(v) {
			if( o.s == 0 ) {
				o.s = n;
				o.v = v;
				a.forEach(function(C) {
					C(v);
				});
				a = o.t = o.c = null;
			}
		};
	}
	function P(e) {
		this.s = 0;
		e(
			B(this, this.t = [], 1),
			B(this, this.c = [], -1)
		);
	}
	var K = P.prototype;
	K.then = function(F,R) {
		if(Q(F)) {
			if(this.s > 0) { 
				F(this.v);
			} else if(this.s == 0) { 
				this.t.push(F);
			}
		}
		this.catch(R);
		return this;
	};
	K.catch = function(R) {
		if(Q(R)) {
			if(this.s < 0) { 
				R(this.v);
			} else if(this.s == 0) { 
				this.c.push(R);
			}
		}
		return this;
	};
	P.isNotNative = true;
	P.resolve = function(v) {
		return (
			(v instanceof P)?
			v :
			(new P(function(F) { F(v); }))
		);
	};
	P.reject = function(v) {
		return (new P(function(F,R) { R(v); }));
	};
	var M = "all/race requires an object/array with forEach implementation";
	P.race = function(I) {
		if( !I.forEach ) { throw new TypeError(M); }
		return (new P(function(F,R) {
			I.forEach(function(N) {
				N.then(F,R);
			});
		}));
	};
	P.all = function(I) {
		if( !I.forEach ) { throw new TypeError(M); }
		return (new P(function(F,R) {
			var res = []; 
			I.forEach(function(N) {
				N.then(function(v) {
					res.push(v);
				},R);
			});
			F(res);
		}));
	};
		return P;
})();
