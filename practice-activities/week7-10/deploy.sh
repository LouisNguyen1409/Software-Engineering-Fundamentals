#!/usr/bin/env bash

WORKING_DIRECTORY="~/www/cs1531deploy"

USERNAME="t2-test"
SSH_HOST="ssh-t2-test.alwaysdata.net"

scp -r ./deploy/ ./package.json ./tsconfig.json ./package-lock.json "$USERNAME@$SSH_HOST:$WORKING_DIRECTORY"
ssh "$USERNAME@$SSH_HOST" "cd $WORKING_DIRECTORY && npm i"
