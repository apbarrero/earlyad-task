module.exports = function (ctx, done) {
   var webhook = ctx.data;
   if (webhook.ref_type != 'tag') {
      done(null, "No tag update, nothing to do");
   }
   else {
      var newVersion = webhook.ref;
      var repo = webhook.repository.git_url;
      console.log("Repository: " + repo);
      console.log("New version: " + newVersion);
      done();
   }
};

