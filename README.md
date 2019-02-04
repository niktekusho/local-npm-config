# local-npm-config (CLI)

[![Build Status](https://travis-ci.org/niktekusho/local-npm-config.svg?branch=master)](https://travis-ci.org/niktekusho/local-npm-config)

Do you work across multiple machines on JavaScript projects? If yes is your answer, then you might want to answer the question:

*How many times do you type `npm init -y` in the your favorite shell?*

What if you could keep a stable npm configuration across those machines and setup sensible defaults for npm?

This is the main goal of this project: make it easy to create, share and apply npm configuration files without exposing the `.npmrc` file contents, which might contain sensible info about your npm account (tokens anyone?).

## Installation

**Note:** to use this CLI application, you have to have installed [Node.js](https://nodejs.org/) and a console you can run commands into. The **minimum required version** of Node.js is: [8 - codename "Carbon"](https://github.com/nodejs/Release#release-schedule).

In your console, run the following command:

```sh
$ npm install -g local-npm-config
```

<!-- [![Install animation](./assets/install.gif)](./assets/install.gif) -->

## Usage

In your console, all the following commands print the help of the module:

-   `$ local-npm-config --help`
-   `$ localnpm -h`

<!-- [![Usage animation](./assets/examples.gif)](./assets/examples.gif) -->

