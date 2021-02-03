# Referenced from https://github.com/importpw/vercel-bash/blob/master/src/build.sh

#!/usr/bin/env bash
set -euo pipefail

# Install dart only in production
if [ "${VERCEL_DEV-}" != "1" ]; then
    echo "Installing \`dart\`"
    sudo apt update
    sudo apt install apt-transport-https
    sudo sh -c "wget -qO- https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -"
    sudo sh -c "wget -qO- https://storage.googleapis.com/download.dartlang.org/linux/debian/dart_stable.list > /etc/apt/sources.list.d/dart_stable.list"

    sudo apt update
    sudo apt install dart
    echo "Done installing \`dart\`"
fi

# Create the cache directory
mkdir -p "$DIST"

# Copy entrypoint file into the cache
cd "$(dirname "$ENTRYPOINT")"
cp "$(basename "$ENTRYPOINT")" "$DIST/"
if [ -f "pubspec.yaml" ]; then
    cp "pubspec.yaml" "$DIST/"
fi

# Rename entrypoint to be used in bootstrap
cd "$DIST"
mv "$(basename $ENTRYPOINT)" "entrypoint.dart"

# Copy bootstrap file into the cache
cp "$BUILDER/bootstrap.dart" "$DIST"

# Get pub dependencies
if [ -f "pubspec.yaml" ]; then
    pub get
fi

# Build the binary file
dart2native "bootstrap.dart" -o "bootstrap"
