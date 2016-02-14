#!/usr/bin/env node

function parseVersion(v) {
   var match = /^(\d+)\.(\d+)\.(\d+)$/.exec(v);
   if (!match)
      throw "Not semantic version compliant";
   return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      release: parseInt(match[3], 10)
   };
}

function intVersion(v) {
   return (v.major * 1000000) + (v.minor * 1000) + v.release;
}

// Checks if `newVersion` is actually greater than `curVersion`
//
// Both input parameters are expected to be test strings with
// semantic version contents, i.e. `X.Y.Z`
function isNewerVersion(newVersion, curVersion) {
   try {
      var newV = parseVersion(newVersion);
      var curV = parseVersion(curVersion);
      return intVersion(newV) > intVersion(curV);
   }
   catch (e) {
      return false;
   }
}

module.exports = isNewerVersion;
