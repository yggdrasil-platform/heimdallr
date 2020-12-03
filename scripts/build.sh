#!/usr/bin/env bash

source ./scripts/set_vars.sh

##
# Main function
##
function main() {
  set_vars

  # Delete the dist directory.
  "${BIN_PATH}"/rimraf "${DIST_PATH}"
  printf "%b Removed dist/ directory.\n" "${INFO_PREFIX}"

  # Transpile.
  printf "%b Compiling TypeScript...\n" "${INFO_PREFIX}"
  "${BIN_PATH}"/tsc

  printf "%b Done!\n" "${INFO_PREFIX}"
}

# And so, it begins...
main
