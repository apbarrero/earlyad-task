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

// Looks for `repoUrl` to be included in `package.dependencies`
// and checkes for `version` to be newer.
// Returns true if so and false otherwise
//
// - `pack`: contents of a `package.json`
// - `dependency`: {
//    url: <normalized repository url, e.g. 'git://github.com/user/repo'>,
//    version: 'X.Y.Z'
// }
function checkDepVersion(pack, dependency) {
   var urlRegex = new RegExp(dependency.url + "#(.*)");
   for (dep in pack.dependencies) {
      var match = urlRegex.exec(pack.dependencies[dep]);
      if (match) {
         var currentVersion = match[1];
         return isNewerVersion(dependency.version, currentVersion);
      }
   }
   return false;
}

module.exports.isNewerVersion = isNewerVersion;
module.exports.checkDepVersion = checkDepVersion;
