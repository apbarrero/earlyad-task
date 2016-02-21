# Early adopter

Early adopter is a node.js dependency checker and updater

Early adopter will update versions in your project dependencies as soon
as a new version is published.

## Deploy

You will need to [create a Github access token](https://github.com/blog/1509-personal-api-tokens)
and use [ `wt-cli` ](https://github.com/auth0/wt-cli) to create the webtask:

    $ wt create --secret GITHUB_TOKEN=<your github account token> earlyad-task.js

Then use the obtained URL as a [Github webhook](https://developer.github.com/webhooks/)
for the repositories whose versions you want to track. The webhook should be configured
to be triggered only for the [create event](https://developer.github.com/v3/activity/events/types/#createevent).

Then, whenever a new tag with semantic version format is pushed to the repositories
having this webhook, the webtask will be fired and if any of the repos in its list
depends on the one that triggered the webhook, a pull request updating the version
for the new tag will be created.

