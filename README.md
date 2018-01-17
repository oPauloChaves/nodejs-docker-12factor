## Git

* The `master` branch is considered the working tree. You have to make sure the code in there is production ready.
* The `develop` branch should be used to work on new features and for whatever new task you're working on, you start a new branch from `develop`. When you're done you merge it back to develop.
    * When working in a team this merging is usually accomplished by a PR where some team mate will review your code, accept and merge the PR
    * When merging new changes from `develop` into your feature branch you can use `git rebase develop` to keep your branch commits on top of `develop` branch commits
* After your code in `develop` branch is ready for release you can create release branch with the version like `release/1.0` and the deploy it to staging environment. Since the release is in a new branch you're safe from changes being made into `develop`
    * If there's any bug in a `release` branch, you create a branch from it, fix the bug, send a PR, merge the PR into the `release` branch.
    * When the `release` branch is ready for production you submit a PR to `master` branch, create a tag like `v1.0.0` from `master` branch and deploy.
* `hot-fix` branches are intended for emergencies, are branched from `master` and thus allowed to be merged directly into `master` when fixed.
    * When `hotfix` is done and merged back into `master` you tag a new version like `v1.0.1`
    * Also don't forget to merge `master` which now has the hotfix into `develop` to make sure new features get those changes. 
* When your develop branches are merged you may remove them manually or automacally when your branch is merged on github for example

## Yarn

Yarn was built to deterministic, reliable and fast

## Links

* [The Twelve-Factor App](https://12factor.net/)
* [git-flow cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
 