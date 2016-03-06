var EarlyAd = require('earlyad').EarlyAd;
var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.put('/', function (req, res) {

   var repolist = [
      "apbarrero/earlyad-task",
      "git://github.com/auth0/wt-cli.git",
   ];

   var webhook = req.body;
   if (webhook.ref_type != 'tag') {
      res.send("No tag update, nothing to do");
   }
   else {
      var repo = webhook.repository.git_url;
      var newVersion = webhook.ref;

      var dep = new EarlyAd({ url: repo, version: newVersion }, { token: process.env.GITHUB_TOKEN });

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
                     console.log("Detected need to update " + JSON.stringify(reposToUpdateNames) + " dependent on " + dep.packageInfo.url);
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
      ], function(err, result) {
         if (err) {
            res.status(500);
            res.send("Failed to process webhook. Error: " + err);
         }
         else {
            res.send("Webhook successfully processed");
         }
      });

   }
});

app.listen(process.env.PORT || 5000);

