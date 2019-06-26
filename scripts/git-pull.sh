#!/bin/sh

branch="$1"
if [ -z "$1" ] && [ -z "$2" ]; then
  branch="origin/master"
fi
echo "$branch"

git fetch --all
git reset --hard "$branch"
git pull