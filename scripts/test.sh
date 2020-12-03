#!/usr/bin/env bash

source ./scripts/set_vars.sh

###
# Creates a temporary PostgreSQL container and runs tests.
###

function read_env_file {
  set -a
  [ -f .env.test ] && source .env.test
  set +a
}

##
# Main function
##
function main {
  set_vars

  # Read test env file
  read_env_file

  # Run tests.
  "${BIN_PATH}"/jest --runInBand
}

# And so, it begins...
main
