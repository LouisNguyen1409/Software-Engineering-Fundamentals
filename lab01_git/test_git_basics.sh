#!/bin/bash

author="$(git config user.name)"

if [ "$author" = "" ]
then
    echo 'You did not configure your user.name :(.'
    exit 1
fi

if [ "$(git config user.email)" = "" ]
then
    echo 'You did not configure your user.email :(.'
    exit 1
fi

commits=$(git rev-list HEAD --count --author="$author")

if [ "$commits" -eq 0 ]
then
    echo 'You did not make a commit :(.'
    exit 1
else
    echo "Tests passed!"
fi
