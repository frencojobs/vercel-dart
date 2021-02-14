#!/usr/bin/env bash
set -euo pipefail

cd $HOME
curl -sfLS "https://storage.googleapis.com/dart-archive/channels/${DART_CHANNEL}/release/${DART_VERSION}/sdk/dartsdk-linux-x64-release.zip" >dart.zip
unzip -oq dart.zip
rm dart.zip
