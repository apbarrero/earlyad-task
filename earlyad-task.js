var EarlyAd = require('earlyad');
var async = require('async');

module.exports = function (ctx, done) {

   var repolist = [
      "apbarrero/earlyad-task",
      "git://github.com/auth0/wt-cli.git",
   ];

   var webhook = ctx.body;
   if (webhook.ref_type != 'tag') {
      done(null, "No tag update, nothing to do");
   }
   else {
      var repo = webhook.repository.git_url;
      var newVersion = webhook.ref;

      var dep = new EarlyAd({ url: repo, version: newVersion }, { token: ctx.data.GITHUB_TOKEN });

      var reposToUpdate = [];
      async.series([
         function(callback) {
            dep.checkDepRepoList(repolist, function(err, res) {
               if (err) callback(err);
               else {
                  if (res && res.length > 0) {
                     reposToUpdate = res;
                     var reposToUpdateNames = reposToUpdate.map(function(item, i, array) {
                        return item.repo;
                     });
                     console.log("Number of repositories to update: " + reposToUpdate.length);
                     console.log("Detected need to update " + JSON.stringify(reposToUpdateNames) + " dependent on " + dependency.url);
                  }
                  else {
                     console.log("No need to update " + repo + " on any repos in the list");
                  }
                  callback();
               }
            });
         },
         function(callback) {
            async.map(reposToUpdate, function(r, callback) {
               var data = {
                  repoUrl: r.repo,
                  pack: r.pack,
                  title: "Update dependency on " + repo + " to new version " + newVersion
               };

               dep.createPullRequest(data, callback);
            }, function(err, res) {
               if (err) callback(err);
               else {
                  callback(null);
               }
            });
         }
      ], function(err, res) {
         if (err) done(err)
         else
            done(null, "Success");
      });
   }
};

