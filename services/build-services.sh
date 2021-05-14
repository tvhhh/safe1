#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

docker build "$SCRIPT_DIR/data" -t safe1/data
if [ $? -ne 0 ]; then
  echo "Failed to build docker image safe1/data"
  exit 1
fi

docker build "$SCRIPT_DIR/control" -t safe1/control
if [ $? -ne 0 ]; then
  echo "Failed to build docker image safe1/control"
  exit 1
fi

echo "Successfully built safe1 services"
exit 0