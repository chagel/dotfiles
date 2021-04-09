#!/bin/bash

set -euo pipefail

curl https://raw.githubusercontent.com/chagel/dotfiles/main/aliases/basic -o /tmp/dotfile_basic

BASH=$HOME/.bash_profile

echo "### OH-MY-DOTFILES ###" >> $BASH 

cat /tmp/dotfile_basic >> $BASH

echo "###" >> $BASH

echo "Imported aliases to ~/.bash_profile"

