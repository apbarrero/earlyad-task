#!/usr/bin/env node

var semver = require('semver');

// Checks if `newVersion` is actually greater than `curVersion`
//
// Both input parameters are expected to be text strings with
// semantic version contents according to http://semver.org,
// i.e. `X.Y.Z`
// Will return false if any the parameter values are non-compliant
function isNewerVersion(newVersion, curVersion) {
   return semver.valid(newVersion)
       && semver.valid(curVersion)
       && semver.gt(newVersion, curVersion);
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
