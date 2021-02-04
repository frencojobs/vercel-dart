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
    PATH="$PATH:/usr/lib/dart/bin"
    echo "Done installing \`dart\`"
fi

# Copy files into TMP
cd "$(dirname "$ENTRYPOINT_PATH")"
cp "$(basename "$ENTRYPOINT_PATH")" $TMP
cd $TMP
mv "$(basename $ENTRYPOINT_PATH)" entrypoint.dart
cp "$BUILDER/bootstrap.dart.template" bootstrap.dart

# Build binary file
pub get
dart2native bootstrap.dart -o bootstrap

# Make cache folder & copy bootstrap file into it
mkdir -p $DIST
cp bootstrap $DIST
