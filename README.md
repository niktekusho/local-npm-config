# local-npm-config (CLI)

[![License](https://img.shields.io/github/license/niktekusho/local-npm-config.svg?style=flat)](./LICENSE)
[![](https://img.shields.io/npm/v/local-npm-config.svg)](https://www.npmjs.com/package/local-npm-config)
[![](https://github.com/niktekusho/local-npm-config/workflows/Build%20Status/badge.svg)](https://github.com/niktekusho/local-npm-config/actions)
[![](https://img.shields.io/node/v/local-npm-config.svg)](https://www.npmjs.com/package/local-npm-config)
[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

Do you work across multiple machines on JavaScript projects? If yes is your answer, then you might want to answer the question:

*How many times do you type `npm init -y` in your favorite shell?*

What if you could keep a stable npm configuration across those machines and set up sensible defaults for npm?

The primary goal of this project is to make it easy to create, share and apply npm *init* configuration files without exposing your "`.npmrc`" content, which might contain sensible info about your npm account (tokens maybe?).

## Installation

**Note:** to use this CLI application, you have to have installed [Node.js](https://nodejs.org/) and a console you can run commands into. The **minimum required version** of Node.js is: [14 - codename "Fermium"](https://github.com/nodejs/Release#release-schedule).

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

### Export configuration to a file

You can export the npm init configuration from a file so that you can share it between environments easily. This feature goes through the CLI prompt and writes the result into a JSON file in the *current working directory* (the directory in which you run the app).

```sh
 $ local-npm-config -e
```

*Note*: at the moment, you can not change the name of the generated file.

The generated file, named "`local-npm-config.json`", has the following structure:

```json
{
  "author": {
    "name": "<name>",
    "email": "<email>",
    "url": "<url>"
  },
  "license": "<license>",
  "version": "<version>"
}
```

To minimize file size (even though it currently isn't a problem), if a value is left blank, it *does not exist* in the generated file.
The app validates the exported configuration against a JSON schema before writing it to the file.

This command supports the dry run option (`-d` argument).

### Apply a configuration from a file

You can apply the npm init configuration from a file, maybe [exported](#export-configuration-to-a-file) by this very app, so that you can keep configurations synced easily.

```sh
 $ local-npm-config -i <local_or_remote_path>
```

For example, if my configuration lives on [this gist](https://gist.github.com/niktekusho/b4f229c24db26512f02b552401053a7c), I could use either one of the following commands to apply it to my current local environment:

```sh
 # First option!
 # Since I need the raw JSON file from the gist, I just copied the URL of the "raw" gist
 $ local-npm-config -i https://gist.githubusercontent.com/niktekusho/b4f229c24db26512f02b552401053a7c/raw/188f486f0433759bf9b3a2b6c3de29111cd38fc1/npm-init-config.json

# Second option!
# Use the browser to download the file into my "downloads" directory and give the CLI its path
 $ local-npm-config -i ~/downloads/npm-init-config.json
```

This command supports the dry run option (`-d` argument).

<!-- [![Usage animation](./assets/examples.gif)](./assets/examples.gif) -->
