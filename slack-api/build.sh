#!/bin/bash -e

APP_NAME=tsukedaicho-slack-api
VERSION=0.1.0

if [ -z $HOME_REGISTRY ]; then
  echo "ERROR: HOME_REGISTRY not defined." 1>&2
  exit 1
fi

case $1 in
  "amd64" | "arm64")
    ARCH=$1
    ;;
  *)
    echo "ERROR: Invalid platform. (available:amd64,arm64)" 1>&2
    exit 1
esac
echo "Platform: $ARCH"

case $2 in
  "push")
    echo "Mode: push to registry"
    PUSH=true
    ;;
  *)
    echo "Mode: load for local docker"
    PUSH=false
    ;;
esac

cd ..

DOCKER_BUILDKIT=1 docker build -f slack-api/$ARCH.Dockerfile -t $HOME_REGISTRY/$APP_NAME:$VERSION .

cd slack-api

if $PUSH
then
  docker push $HOME_REGISTRY/$APP_NAME:$VERSION
fi
