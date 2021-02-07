# Referenced from https://github.com/importpw/vercel-bash/blob/master/src/build.sh

#!/usr/bin/env bash
set -euo pipefail

ROOT_PATH="$(pwd)"

# Install dart only in production
if [ "${VERCEL_DEV-}" != "1" ]; then
    echo "Installing \`dart\`"
    curl -sfLS "https://storage.googleapis.com/dart-archive/channels/stable/release/2.10.5/sdk/dartsdk-linux-x64-release.zip" >dart.zip
    unzip -oq dart.zip
    rm dart.zip
    PATH="$PATH:$ROOT_PATH/dart-sdk/bin"
    echo "Done installing \`dart\`"
fi

# Copy files into TMP
cd "$(dirname "$ENTRYPOINT_PATH")"
cp "$(basename "$ENTRYPOINT_PATH")" $TMP
cd $TMP
mv "$(basename "$ENTRYPOINT_PATH")" entrypoint.dart
cp "$BUILDER/bootstrap.dart.template" bootstrap.dart

# Build binary file
pub get
dart2native bootstrap.dart -o bootstrap

# Make cache folder & copy bootstrap file into it
mkdir -p $DIST
cp bootstrap $DIST
