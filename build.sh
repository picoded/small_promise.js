#!/bin/sh

# Normalize the working directory
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd "$DIR"

# Bin directory path
BIN_DIR="$DIR/bin"

# Original source code
SRC_JS="$DIR/small_promise.js"

# Ugly version of small promise,
# with internal variables substitutude
UGLY_JS="$BIN_DIR/ugly_small_promise.js"

########################################
#
# Let the ugly build begin
#
########################################
echo "" > "$UGLY_JS"
cat "$SRC_JS" | \
# Remove comments
perl -pe 's/((\/\/.*$)|(\/\*[\s\S]*?\*\/))//mg' | \
# small_promise -> P
perl -pe 's/small_promise/P/mg' | \
perl -pe 's/var P/var small_promise/mg' | \
# protoClass -> K
perl -pe 's/protoClass/K/mg' | \
# callback_builder -> b
perl -pe 's/callback_builder/B/mg' | \
# (callback_builder specific) promiseObj -> o 
perl -pe 's/promiseObj/o/mg' | \
# (callback_builder specific) callbackArray -> a
perl -pe 's/callbackArray/a/mg' | \
# (callback_builder specific) newStatus -> n
perl -pe 's/newStatus/n/mg' | \
# executor -> e
perl -pe 's/executor/e/mg' | \
# value -> v
perl -pe 's/value/v/mg' | \
perl -pe 's/val/v/mg' | \
# .status -> .s
perl -pe 's/.status/.s/mg' | \
# .then_array -> .t
# .catch_array -> .c
perl -pe 's/.then_array/.t/mg' | \
perl -pe 's/.catch_array/.c/mg' | \
# onFulfilled -> f
# onRejected -> r
perl -pe 's/onFulfilled/F/mg' | \
perl -pe 's/onRejected/R/mg' | \
# forEachErrMsg -> m
perl -pe 's/forEachErrMsg/M/mg' | \
# iterable -> I
perl -pe 's/iterable/I/mg' | \
# Remove blank lines
perl -pe 's/^\s*\n//mg' \
> "$UGLY_JS"
