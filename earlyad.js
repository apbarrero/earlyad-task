#!/usr/bin/env node

var semver = require('semver');
var GitHubApi = require('github');

github = new GitHubApi({
   // required
   version: "3.0.0",
   // optional
   debug: true,
   protocol: "https",
   host: "api.github.com",
   pathPrefix: "",
   timeout: 5000,
   headers: {
      "user-agent": "auth0-pr-checker"
   }
});

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

function normalize(url) {
   // 'user/repo#x.y.z' format, with optional version
   var pattern = /(^[^\/]+\/[^\/#]+)(#.*)?$/;
   if (url.startsWith('git://')) {
      return url;
   }
   else {
      var match = pattern.exec(url);
      if (match) {
         var nurl = "git://github.com/" + match[1] + ".git";
         if (match[2]) nurl += match[2];
         return nurl;
      }
   }
}

// Looks for `dependency.url` to be included in `package.dependencies`
// and checks for `version` to be newer.
//
// Returns the updated `dependencies` object for `package` if so
// and null otherwise
//
// - `pack`: contents of a `package.json`
// - `dependency`: {
//    url: "git URL, e.g. 'git://github.com/user/repo' or 'user/repo' for github repos",
//    version: 'X.Y.Z'
// }
function checkDepVersion(pack, dependency) {
   var depUrl = normalize(dependency.url);
   var urlRegex = new RegExp(depUrl + "#(.*)");
   for (dep in pack.dependencies) {
      var match = urlRegex.exec(normalize(pack.dependencies[dep]));
      if (match) {
         var currentVersion = match[1];
         if (isNewerVersion(dependency.version, currentVersion)) {
            var dependencies = JSON.parse(JSON.stringify(pack.dependencies));
            dependencies[dep] = dependencies[dep].replace(/#.*$/, "#" + dependency.version);
            return dependencies;
         }
      }
   }
   return null;
}

// Extract user and repo name form a github URL
function extractUserRepo(url) {
   var match = /^([^\/]+)\/([^\/\.]+)$/.exec(url);
   if (match) {
      return { user: match[1], repo: match[2] };
   }
   else {
      match = /^git:\/\/github.com\/(.*\/.*).git/.exec(url);
      if (match) {
         return extractUserRepo(match[1]);
      }
   }
   return null;
}

// Return the contents of `package.json` for a github repo at `repoUrl`
// `repoUrl` may have a full git or abbreviated URL
function fetchPackageJson(repoUrl, done) {
   var repo = extractUserRepo(repoUrl);
   github.repos.getContent({
      user: repo.user,
      repo: repo.repo,
      path: "package.json"
   }, function(err, res) {
      if (err) done(err);
      else {
         done(null, JSON.parse(new Buffer(res.content, 'base64').toString('ascii')));
      }
   });
};

// Check a `repo` to see if `dependency` is included in its
// dependency list with version lesser than `dependency.version`
//
// Return the corresponding package.json updated value for
// `dependencies` property
function checkDepRepo(repo, dependency, done) {
   fetchPackageJson(repo, function(err, res) {
      if (err) done(err);
      else {
         done(null, checkDepVersion(res, dependency));
      }
   });
}


module.exports.isNewerVersion = isNewerVersion;
module.exports.checkDepVersion = checkDepVersion;
module.exports.extractUserRepo = extractUserRepo;
module.exports.fetchPackageJson = fetchPackageJson;
module.exports.checkDepRepo = checkDepRepo;
