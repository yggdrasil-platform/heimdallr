#!/usr/bin/env bash

source ./scripts/set_vars.sh

##
# Main function
##
function main() {
  set_vars

  # Start the server.
  node "${DIST_PATH}"/index.js
}

# And so, it begins...
main
