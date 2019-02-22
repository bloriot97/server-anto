#!/usr/bin/env bash
set -e

echo "$DOCKER_PASSWORD" | docker login -u loriotbe --password-stdin
docker build -t loriotbe/server-anto .
docker push loriotbe/server-anto
