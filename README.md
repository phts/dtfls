# dtfls

[![npm](https://img.shields.io/npm/v/dtfls.svg)](https://www.npmjs.com/package/dtfls)

Back up and restore your config files.

This is a port of [dotfiles](https://github.com/phts/dotfiles) to Node.js.

## Requirements

* Node v6.0.0 or higher

## Install

**via npm**:

```
npm install -g dtfls
```

## Usage

### CLI

* Print difference between local and system configs

        dtfls diff <APP...>

* Install local configs to the system

        dtfls install <APP...>

* Print system installation path

        dtfls path <APP>

* Run post-install scripts (it is being run automatically after install)

        dtfls postinstall <APP...>

* Pull configs from the system to the local folder

        dtfls pull <APP...>

Use `dtfls --help` to read a common usage information and
`dtfls <command> --help` to read about a specific command.

### Folder structure

Each set of configs should be placed in separate folders.
Names of such folders should not contain spaces.
These folders should contain the same hierarchy which should be
in the user folder (`~`) of the target system.

Mapping of local path to system path for particular configs can be changed
with a file [`path.user.json`](https://github.com/phts/dtfls/blob/master/examples/path.user.json.example).

Additionally there is a support for post-install scripts. They can be
added in [`postinstall.user`](https://github.com/phts/dtfls/blob/master/examples/postinstall.user.example) file.

## Example

Local repo structure:

    my configs
      \_ git
      |  \_ .gitconfig
      |
      |_ profile
      |  \_ .profile
      |
      |_ sublime-text-3
      |  \_ .config
      |     \_ sublime-text-3
      |        \_ Packages
      |           \_ User
      |              |_ Default (Linux).sublime-keymap
      |              |_ Default (Linux).sublime-mousemap
      |              \_ Preferences.sublime-settings
      |
      |_ zsh
      |  \_ .zshrc
      |
      |_ path.user.json
      \_ postinstall.user.js

And a workflow example:

    $ cd "my configs"
    $ git pull                          <--- pull changes from your repo with configs
    $ dtfls install git                 <--- install git configs from the repo to system
    $ dtfls pull sublime-text-3         <--- copy Sublime Text configs from system to the local repo
    $ git commit -am "Update Sublime Text configs"    <--- commit updated configs
    $ git push                                        <--- and push
