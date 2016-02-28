# What is small_promise.js ?

Because IE do not support this feature.

So I made an as lightweight as possible Promise API implementation as per MDN documentation. (Not the full ES6 / APlus specs).

Written in no-nonsense plain JS. No require, no module, no etc.

# Parameter Type safety = off

Because i generally do code logic debugging in chrome / firefox ANYWAY. 

And passing the wrong parameter type (like a null callback) is a logic error.

# iterable = array

The iterable parameter used in the MDN documentation is assumed to be an array. 

Go find a larger polyfill if you need other alternatives

# Will this be blazing fast ?

Dunno. This is meant to be a super small polyfill. It should be very fast, but no promises.

# Polyfill target ?

IE 9 and above really.

An IE 8 version is also added.

I did not bother about IE 7 and below.

# TODO ?

Full extensive proper test cases, because i been too lazy to get this done. 
