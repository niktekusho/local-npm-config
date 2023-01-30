# Contributing to this project

- [Contributing to this project](#contributing-to-this-project)
  - [Code of Conduct](#code-of-conduct)
  - [Issues](#issues)
    - [Submitting Issues](#submitting-issues)
  - [Resolving Issues](#resolving-issues)
    - [Setup your local *devenv*](#setup-your-local-dev-env)
    - [Submitting a pull request](#submitting-a-pull-request)
  - [Release](#release)

## [Code of Conduct](./CODE_OF_CONDUCT.md)

This project has a [Code of Conduct](./CODE_OF_CONDUCT.md) to which all contributors must adhere.

## Issues

[Issues](https://github.com/niktekusho/local-npm-config/issues) collects questions, bug reports and feature requests.
We use [GitHub Issues](https://guides.github.com/features/issues/) to track issues in this project.
For any issue, there are fundamentally three ways you can contribute:

1. if you believe that you have discovered a bug in this project, or you think some feature is missing or something is unclear to you creating a new issue is the way to report it (remember to search before though 😉);
2. you can also help either by providing supporting details (a test case that demonstrates a bug) or providing suggestions on how to address the issue;
3. and of course you can help fix either in the form of demonstrating that the issue reported is not a problem anymore or by opening a Pull Request that changes some bit of something in
   `niktekusho/local-npm-config` in a concrete and reviewable manner.

When opening a new issue in the `niktekusho/local-npm-config` issue tracker, you are presented with a basic template that should be filled in.

```markdown
<!--
Thank you for reporting an issue.

This issue tracker is for bugs and issues found within the project "local-npm-config".

Please fill in as much of the template below as you're able.

Node version: output of `node -v`
NPM/Yarn version: output of `npm -v` or `yarn -v`
Platform: output of `uname -a` (UNIX), or version and 32 or 64-bit (Windows) (output of `winver` is really appreciated!)
-->

* **Node version**:
* **NPM/Yarn version**:
* **Platform**:

<!-- Enter your issue details below this comment. -->
```

You should follow the template to the best of your ability: do not worry if you cannot answer every detail, just fill in what you can.

When you are reporting a bug, the two most important pieces of information we need to properly evaluate the report is a description of the behavior you are seeing and a simple test case we can use to recreate the problem on our own.
If we cannot recreate the issue, it becomes impossible for us to fix it.

Once a contributor has opened an issue, it is not uncommon for there to be discussion around it.
Some contributors may have differing opinions about the issue, including whether the observed behavior is a bug or a feature.
This discussion is part of the process, and each contributor should strive to keep it focused, helpful, and professional.

Short, clipped responses that provide neither additional context nor supporting detail are not helpful or professional.
To many, such responses are merely annoying and unfriendly.

### Submitting Issues

tldr.

- Search the issue tracker before opening an issue.
- Use a clear and descriptive title.
- The more time you put into an issue, the more we will.
- Always be respectful to other people.

## Resolving Issues

In the vast majority of cases, contributors resolve issues by opening a Pull Request.
The process for opening and reviewing a Pull Request is similar to that of opening and triaging issues but carries with it a necessary review and approval workflow.
This workflow ensures that the proposed changes meet the minimal quality and practical guidelines of this project.

Depending on the area you are working on you might need to set up a local development environment (*dev-env* for short).

### Setup your local *dev-env*

To contribute to this project, you should have the following software installed in your machine:

-  `git`: [GitHub has a cool guide to install everything you need.](https://help.github.com/articles/set-up-git/)
-  `node`: [The official site contains everything you need to know. This project requires at least Node version 8.](https://nodejs.org/en/)
-  `VS Code`: [Visual Studio Code is the recommended text editor/IDE for this project.](https://code.visualstudio.com/)

You should also be somewhat proficient using command line interfaces. If you use Visual Studio Code, you get a decent terminal basically for free.

Once you have installed everything, you can fork this repository: a fork is a full copy of this repository which you can edit on your own.
[GitHub has a specific guide for this, so check it out](https://help.github.com/articles/fork-a-repo/).
From this point on, this "guide" relies heavily on git commands. If you are not comfortable with them, check out one of the ["awesome git" tutorials](https://github.com/dictcp/awesome-git#tutorial).
Moreover, if you're stuck, don't hesitate to ask for directions from the community (in the issue you're working on, for example).

Now it's time to bring *your fork* from the cloud to your local computer: the process of bringing your repository from the cloud to your PC is called **clone** and the fastest way of doing this is using the following command (you need to type this in your terminal):

```sh
$ git clone https://github.com/<your_github_username>/local-npm-config
$ cd local-npm-config
```

Now you are inside your local repository, almost ready to make your changes.
To keep your fork updated, you should add a *"link"* to the original repository:

```sh
$ git remote add upstream https://github.com/niktekusho/local-npm-config
```

Now you need to install the dependencies of this project:

```sh
$ npm install
```

Whether you'll write code or documentation, it's a good habit to create an independent line of development for each specific "topic" you are working on.
These lines are called *branches*. To create a new branch, you can run the following command:

```sh
$ git checkout -b <my_branch_name> -t upstream/master
```

Now open your favorite text editor/IDE and start making changes!
To save your changes, you need to follow these steps:

1.  always check what you have changed with `git status`;
2.  add the files you have changed to your staging area with `git add <file_path>`;
3.  commit them in your local repository with `git commit -m <change_description>`;
4.  push them to your online fork `git push`.

If you've changed the project's code, you should ensure that what you've changed didn't break existing functionalities.
The `npm test` command ensures your contribution works and adheres to this project code style ("lint").

### Submitting a pull request

- Non-trivial changes are often best discussed in an issue first, to prevent you from doing unnecessary work.
- For ambitious tasks, you should try to get your work in front of the community for feedback as soon as possible. Open a pull request as soon as you have done the minimum needed to demonstrate your idea. At this early stage, don't worry about making things perfect, or 100% complete. Add a [WIP] prefix to the title, and describe what you still need to do. This convention lets reviewers know not to nit-pick small details or point out improvements you already know you need to make.
- New features should be accompanied with tests and documentation.
- Don't include unrelated changes.
- Lint and test before submitting the pull request by running `$ npm test`.
- Make the pull request from a [topic branch](https://github.com/dchelimsky/rspec/wiki/Topic-Branches), not master.
- Use a clear and descriptive title for the pull request and commits.
- Write a convincing description of why we should land your pull request. It's your job to convince us. Answer "why" it's needed and provide use-cases.
- You might be asked to do changes to your pull request. There's never a need to open another pull request. [Just update the existing one.](https://github.com/RichardLitt/knowledge/blob/master/github/amending-a-commit-guide.md)

## Test the CLI locally

Just run `npm install && npm link` and you'll have access to the package on your local machine.

Note: this will link *your* **local copy** of **local-npm-config** in your global npm packages repository and will override the package installed from npm's public package registry.
It's advisable to run `npm unlink` after you're done with these manual tests.

Then you can use the same commands described in the [main README](../README.md) (such as `local-npm-config -i <file|url>`).

## Release

The release process is managed using [np](https://github.com/sindresorhus/np).
When a release is ready, the command `npm run release` initiates the release process, ensuring that everything is properly checked.
